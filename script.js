// ПАРАМЕТРЫ ИГРЫ
// масштаб поля
let scale = 10;
// имя игрока
let name = '';


let poleDOM = document.querySelector(".pole");
let tabloDOM = document.querySelector(".tablo");
let resultDom = document.querySelector(".result");
let gameDom = document.querySelector(".game");
let resetGameDom = document.getElementById("resetGame");

let resetStorageDom = document.getElementById("resetStorage");
let scaleDom = document.getElementById("scale");
let nameDom = document.getElementById("name");

// начальные
let direction = 'Up';
let result = 0;
let bestResult = 0;
// переменная пока игра в процессе будет тру
// чтобы в этот момент отключить возможность сброса настроек
let gameInProcess = false;
// Интервал движения который будем ускорять
let timeInterval = 500;
// ID bнтервала движения чтоб отменить потом
// сначала оно пустое
let intervalID = null;

// головной класс 
// который отражает наполнение клетки (square) неким элементом  (яблоко, либо кусок змеи)
// и манипуляции с этой клеткой и элементом
class Container {

    #x = 0;
    #y = 0;

    dom = null;

    #rotate = 0;// поворот изображения элемента

    constructor() { }

    // ставит контейнер с содержимым на поле
    set(x, y, rotate) {
        this.#x = x;
        this.#y = y;
        this.#rotate = rotate;
        let square = document.getElementById(`X${x}Y${y}`);
        square.appendChild(this.dom);
        this.dom.style.rotate = rotate + 'deg';
        // this.dom.style.borderRadius = '40%';
    }
    // удаляет контейнер из заданной ячейки
    remove() {
        this.#x = 0;
        this.#y = 0;
        if (this.dom != null) this.dom.remove();
    }

    // координаты
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getRotate() {
        return this.#rotate;
    }
}

// от контейнера наследуем яблоко
class Apple extends Container {

    // создаем яблоко
    constructor() {
        super();
        this.dom = document.createElement('img');
        this.dom.setAttribute('src', './images/apple.png');
        this.dom.setAttribute('alt', 'apple');
        this.dom.setAttribute('width', '80%');
        this.dom.setAttribute('height', '80%');
        this.dom.classList.add('apple');
    }

    // ставим яблоко на поле
    set() {
        //  проверка координат чтоб не поставить на змею
        let x = getRandom(1, scale);
        let y = getRandom(1, scale);
        // крутим пока не попадем в пустую клетку
        while (snake.runDownSnake(x, y)) {
            x = getRandom(1, scale);
            y = getRandom(1, scale);
        }
        super.set(x, y, 0);
    }    
}

// тело змеи это массив контейнеров со своими координатами и содержимым
// этот класс не наследник контейнера 
class Snake {

    #body = []; 

    // создаем змею голова-хвост
    constructor() {

        let head = new Container();
        head.dom = document.createElement('img');
        head.dom.setAttribute('src', './images/head.png');
        head.dom.setAttribute('alt', 'head');
        head.dom.setAttribute('width', '100%');
        head.dom.setAttribute('height', '100%');
        head.dom.classList.add('snake');
        this.#body.push(head);

        let tail = new Container();
        tail.dom = document.createElement('img');
        tail.dom.setAttribute('src', './images/tail.png');
        tail.dom.setAttribute('alt', 'head');
        tail.dom.setAttribute('width', '100%');
        tail.dom.setAttribute('height', '100%');
        tail.dom.classList.add('snake');
        this.#body.push(tail);
    }

    // Разместим змею на поле в стартовой точке
    // Передаю начальную точку куда поставить
    setInitial(x, y) {
        // если это рестарт из змеи вырежу тело
        if (this.#body.length > 2) {
            let head = this.#body[0];
            let tail = this.#body[this.#body.length - 1];
            this.#body = [];
            this.#body.push(head);
            this.#body.push(tail);
        }
        
        this.#body[0].set(x, y, 0);
        this.#body[1].set(x + 1, y, 0);
    }


    // Создание средней части тела змеи
    createPart() {
        let part = new Container();
        part.dom = document.createElement('img');
        part.dom.setAttribute('src', './images/body.png');
        part.dom.setAttribute('alt', 'head');
        part.dom.setAttribute('width', '100%');
        part.dom.setAttribute('height', '100%');
        part.dom.classList.add('snake');
        return part;
    }

    //  ГЛАВНАЯ функция змеи - движение
    // двигаем  змею в целевую точку, 
    // она задается в зависимнсти от входного параметра  -  направление
    // остальное тело должно просто сдвинутся по имеющейся цепочке   
    // в процессе проверяем если сьели яблоко удлиняемся
    // если сьели себя  -  конец
    // выходе результат движения
    // true -  продолжаем игру
    // false  - конец
    move(directionNext) {
        // если команда обратно, направвление движения не меняю змея идет как шла
        if ((directionNext == 'Right' && direction == 'Left')
            || (directionNext == 'Left' && direction == 'Right')
            || (directionNext == 'Up' && direction == 'Down')
            || (directionNext == 'Down' && direction == 'Up'))
            directionNext = direction;
        else
            direction = directionNext;
        let head = this.#body[0];

        // ищем новое потенциальное положение головы
        let newX = 0;
        let newY = 0;
        let newRotate = 0;
        // устанавливаем новые координаты и сразу корректируем на пересечение границы
        //  выйдем с другой стороны, здесь можно было и сразу на завершение отправить 
        // но мне так есть больше нравится
        if (directionNext == 'Right') {
            newX = head.getX();
            newY = (head.getY() + 1) > scale ? 1 : head.getY() + 1;
            newRotate = 90;
        } else if (directionNext == 'Left') {
            newX = head.getX();
            newY = (head.getY() - 1) < 1 ? scale : head.getY() - 1;
            newRotate = 270;
        } else if (directionNext == 'Up') {
            newX = (head.getX() - 1) < 1 ? scale : head.getX() - 1;
            newY = head.getY();
            newRotate = 0;
        } else if (directionNext == 'Down') {
            newX = (head.getX() + 1) > scale ? 1 : head.getX() + 1;
            newY = head.getY();
            newRotate = 180;
        };

        // проверка на поедание яблока если да выполняем действия
        if (this.eatAple(newX, newY)) {
            // Увеличим результат
            result++;
            tabloDOM.innerHTML = result;
            
            // удалим яблоко с поля
            apple.remove();
            // передвигаем на его место только голову 
            // и на место головы записываем обычную часть и возвращаемся            
            this.#body.unshift(head); // добавили голову вперед
            this.#body[1] = this.createPart(); //  вместо головы вписали часть
            this.#body[1].set(head.getX(), head.getY(), head.getRotate()); // части присвоим координаты головы
            head.set(newX, newY, newRotate) // голове присвоим новые координаты
            // ставим новое яблоко
            apple.set();
            // увеличим скорость
            timeInterval = (timeInterval > 100) ? timeInterval - 10 : timeInterval;
            return true; // выходим
        }

        // проверка на столкновение с собой если да выполняем действия
        if (this.runDownSnake(newX, newY)) {
            // сохраним лучший результат
            if (result > +bestResult) {
                localStorage.setItem('bestResult', result);
            }
            // покажем кнопку перезапуска игры и надпись            
            resetGameDom.classList.remove('none');
            gameDom.innerHTML = 'Игра окончена';
            // активируем настройки 
            resetStorageDom.removeAttribute('disabled');
            scaleDom.removeAttribute('disabled');
            nameDom.removeAttribute('disabled');
            // Отметим что игра не в процессе
            gameInProcess = false;
            // остановим движ
            clearTimeout(intervalID);
            return false;
        }; // гейм закончен

        // если это обычное движение передвигаем координаты с хвоста
        for (let i = this.#body.length - 1; i > 0; i--) {
            // сдвинули тело
            this.#body[i].set(this.#body[i - 1].getX(), this.#body[i - 1].getY(), this.#body[i - 1].getRotate());
        }
        // дописали голову в новые координаты
        head.set(newX, newY, newRotate);

        // коррекция ротации хвоста
        let xTail = this.#body.length - 1; // индекс хвоста
        this.#body[xTail].set(this.#body[xTail].getX(), this.#body[xTail].getY(), this.#body[xTail - 1].getRotate());

        return true; // продолжаем играть
    }

    // проверяет пересечения новых координат c любой частью тела змеи      
    // true - пересечения есть
    // falce - пересечение  нет
    runDownSnake(x, y) {
        for (let i = 0; i < this.#body.length; i++) {
            if (this.#body[i].getX() == x && this.#body[i].getY() == y)
                return true;
        }
        return false;
    }
    // проверяет столкновения  головы (новых координат) с яблоком
    // true - Сьели
    // falce - Не сьели
    eatAple(newX, newY) {
        return (apple.getX() == newX && apple.getY() == newY) ? true : false;
    }
}

// мои главные актеры на поле
let apple = new Apple();
let snake = new Snake();

// Инициация игрового поля
function init() {
    
    // проверим наличие сохраненной шкалы
    if (!(!localStorage.getItem('scale'))) {
        scale = localStorage.getItem('scale');
    } else {
        scale = 10;
    }
    scaleDom.setAttribute('value', scale);

    // проверим наличие имени
    if (!(!localStorage.getItem('name'))) {
        name = localStorage.getItem('name');
    } else name = '';
    nameDom.setAttribute('value', name);
   
    // вывели табло с результатом
    result = 0;
    tabloDOM.innerHTML = result;
    
    //  очищаем поле если это перезапуск
    while (poleDOM.firstChild) {
        poleDOM.removeChild(poleDOM.firstChild);
    }
    // разлиновка поля гридами
    poleDOM.style.gridTemplateColumns = `repeat(${scale}, 1fr)`;
    poleDOM.style.gridTemplateRows = `repeat(${scale}, 1fr)`;

    // заполняем зелеными квадратиками с координатами, координаты в id 
    for (let x = 1; x <= scale; x++) {
        for (let y = 1; y <= scale; y++) {
            let square = document.createElement('div'); 
            square.classList.add('square'); 
            // console.log(11);
            square.id = `X${x}Y${y}`;
            square.style.gridcolumnstart = x;
            square.style.gridcolumnstart = x;
            square.style.gridrowstart = y;
            square.style.gridrowend = y;
            poleDOM.appendChild(square);
        }
    }

    // Добавим змею  в серединку
    let n = Math.round(scale / 2);
    snake.setInitial(n, n);

    // результат  если есть в хранилище выведу
    gameDom.innerHTML = '';
    bestResult = localStorage.getItem('bestResult');
    if (!(!bestResult)) {
        resultDom.innerHTML = 'Лучший результат: ' + bestResult;
    }
    resetGameDom.classList.add('none');
}

// Служебные функции
/////////////////////////

// Генератор случайных чисел в диапазоне
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
    // The maximum is inclusive and the minimum is inclusive
}


// листенеры
//////////////////////////

// Перезагруз страницы
document.addEventListener("DOMContentLoaded", function () {
 init();

});

// лювлю нажатия кнопок клавиатуры со стрелками
addEventListener("keydown", function (ev) {
    if (ev.code == 'ArrowRight') {
        direction = 'Right';       
    }
    if (ev.code == 'ArrowLeft') {
        direction = 'Left';       
    }
    if (ev.code == 'ArrowUp') {
        direction = 'Up';       
    }
    if (ev.code == 'ArrowDown') {
        direction = 'Down';       
    }
});

// слушаю события на поле браузера смотря куда кликнут
addEventListener("click", function (ev) {    
    // начало новой игры    
    if (ev.target == resetGameDom && !gameInProcess) {
        init();
     // сброс настроек и результата
    } else if (ev.target == resetStorageDom && !gameInProcess) {
        localStorage.clear();
        init();
    // изменение масштаба
    } else if (ev.target == scaleDom && !gameInProcess) {
        localStorage.setItem('scale', scaleDom.value);
        init();
    // изменение имени игрока
    } else if (ev.target == nameDom && !gameInProcess) {
        localStorage.setItem('name', nameDom.value);
    // клик по зеленому полю запуск игры
    } else if (ev.target.parentElement == poleDOM && !gameInProcess) {
        // чтою юзер во время игры не нажал не нужные кнопки  -  делаю неактивными
        resetStorageDom.setAttribute('disabled', true);
        scaleDom.setAttribute('disabled', true);
        nameDom.setAttribute('disabled', true);
        //    старт 
        gameInProcess = true;        
        // Добавим яблоко изначально
        apple.set(getRandom(1, scale), getRandom(1, scale), 0);
        timeInterval = 500; // сбросим таймер
        // запустим Движ
        intervalID = setInterval(() => {
            snake.move(direction);
        }, timeInterval);
    }
    else {
        console.log("клик вне зеленого поля и кнопок - не реагирую");
    }
});



