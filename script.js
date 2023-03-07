// ПАРАМЕТРЫ ИГРЫ
// масштаб поля
let scale = 10;
let name = '';


let poleDOM = document.querySelector(".pole");
let tabloDOM = document.querySelector(".tablo");
let resultDom = document.querySelector(".result");
let gameDom = document.querySelector(".game");
let buttonDom = document.querySelector(".btn");

let scaleDom = document.getElementById("scale");
let nameDom = document.getElementById("name");
// let square = document.querySelector('.square');

let direction = 'Up';
let result = 0;
let bestResult = 0;

// головной класс 
// который отражает наполнение клетки (square) неким элементом  
// и манипуляции с этой клеткой и элементом
class Container {

    #x = 0;
    #y = 0;
    
    dom = null;

    constructor() { }

    // ставит контейнер с содержимым на поле
    set(x, y) {
        this.#x = x;
        this.#y = y;
        let square = document.getElementById(`X${x}Y${y}`);
        square.appendChild(this.dom);
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
        // width="" height="" data-x="" data-y=""
    }

    // ставим яблоко на поле
    set() {
        //  проверка координат чтоб не поставить на змею
        let x = getRandom(1, 10);
        let y = getRandom(1, 10);
        // крутим пока не попадем в пустую клетку
        while (snake.runDownSnake(x, y)) {
            x = getRandom(1, 10);
            y = getRandom(1, 10);
        }
        super.set(x, y);
    }

    // удаляем яблоко с поля
    // используем метод контейнера    
}

// тело змеи это массив контейнеров со своими координатами и содержимым
// этот класс не наследник контейнера 
class Snake {
    
     #body = [];

    // создаем змею голова-тело(под вопросом)-хвост
    constructor() {

        let head = new Container();
        head.dom = document.createElement('img');
        head.dom.setAttribute('src', './images/head.png');
        head.dom.setAttribute('alt', 'head');
        head.dom.setAttribute('width', '100%');
        head.dom.setAttribute('height', '100%');
        head.dom.classList.add('snake');
        this.#body.push(head);

        // this.#body.push(this.createPart());
        // this.#body.push(this.createPart());

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
        // обнуляю для повторной инициации        
        this.#body[0].set(x, y);
        this.#body[1].set(x + 1, y);
        // this.#body[2].set(x + 2, y);
        // this.#body[3].set(x + 3, y);
    }

    // Создание части тела змеи
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

    // двинем змею в целевую точку  остальное тело должно просто сдвинутся по имеющейся цепочке   
    // походу проверяем если сьели яблоко удлиняемся
    // выходе результат движения
    // true -  продолжаем игру
    // false  - конец
    move(directionNext) {
        // если команда обратно, направвление движения не меняю
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
        // устанавливаем новые координаты и сразу корректируем на пересечение границы
        if (directionNext == 'Right') {
            newX = head.getX();
            newY = (head.getY() + 1) > 10 ? 1 : head.getY() + 1;
        } else if (directionNext == 'Left') {
            newX = head.getX();
            newY = (head.getY() - 1) < 1 ? 10 : head.getY() - 1;
        } else if (directionNext == 'Up') {
            newX = (head.getX() - 1) < 1 ? 10 : head.getX() - 1;
            newY = head.getY();
        } else if (directionNext == 'Down') {
            newX = (head.getX() + 1) > 10 ? 1 : head.getX() + 1;
            newY = head.getY();
        };

        // проверка на поедание яблока
        if (this.eatAple(newX, newY)) {
            result++;
            // перепишем результат на форме
            tabloDOM.innerHTML = result;
            // удалим яблоко с поля
            apple.remove();
            // передвигаем на его место только голову и на место головы записываем обычную часть 
            // и возвращаемся
            let part = this.createPart();
            this.#body.unshift(head); // добавили голову вместо яблока
            this.#body[1] = this.createPart(); //  вместо головы вписали часть
            this.#body[1].set(head.getX(), head.getY()); // части присвоим координаты головы
            head.set(newX, newY) // голове присвоим новые координаты
            // ставим новое яблоко (потом можно вынести в таймер)
            apple.set();
            return; // выходим
        }

        // проверка на столкновение с собой
        if (this.runDownSnake(newX, newY)) {
            if (result > +bestResult) {
                localStorage.setItem('bestResult', result);
            }
            buttonDom.classList.remove('none');
            gameDom.innerHTML = 'Игра окончена';
            return false
        }; // гейм закончен

        // если это обычное движение передвигаем координаты с хвоста

        for (let i = this.#body.length - 1; i > 0; i--) {
            // сдвинули тело
            this.#body[i].set(this.#body[i - 1].getX(), this.#body[i - 1].getY());
        }
        // дописали голову в новые координаты
        head.set(newX, newY);
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

let apple = new Apple();
let snake = new Snake();

// Инициация поля игры
function init() {
    // проверим наличие сохраненной шкалы
    
    if (!(!localStorage.getItem('scale'))) {
        scale = localStorage.getItem('scale');
    }
    scaleDom.setAttribute('value',scale);

    if (!(!localStorage.getItem('name'))) {
        name = localStorage.getItem('name');
    }
    nameDom.setAttribute('value',name);

    result = 0;
    tabloDOM.innerHTML = result;
    //  очищаем поле если это перезапуск
    while (poleDOM.firstChild) {
        poleDOM.removeChild(poleDOM.firstChild);
    }
    // раскраска поля
    for (let x = 1; x <= scale; x++) {
        for (let y = 1; y <= scale; y++) {
            let square = document.createElement('div'); // создаём элемент клетку поля
            square.classList.add('square'); // добавляем класс
            // console.log(11);
            square.id = `X${x}Y${y}`;
            square.style.gridcolumnstart = x;
            square.style.gridcolumnstart = x;
            square.style.gridrowstart = y;
            square.style.gridrowend = y;
            // square.innerHTML = square.id;
            poleDOM.appendChild(square);
        }
    }

    // Добавим яблоко (потом вынести в таймер)
    apple.set(getRandom(1, 10), getRandom(1, 10));
    // Добавим змею   
    snake = new Snake();
    snake.setInitial(5, 5);
    
    // результат (надо вывести)
     gameDom.innerHTML = '';
     bestResult = localStorage.getItem('bestResult');
     if (!(!bestResult)) {
        resultDom.innerHTML = 'Лучший результат: '+ bestResult;
     }
    //  buttonDom.classList.add('none');
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

// При перезагрузе читаем сторидж
document.addEventListener("DOMContentLoaded", function () {
    
    // render(myJSON);
    // Инициация игры
    init();

});

addEventListener("keydown", function (ev) {

    if (ev.code == 'ArrowRight') {
        snake.move('Right');
    }
    if (ev.code == 'ArrowLeft') {
        snake.move('Left');
    }
    if (ev.code == 'ArrowUp') {
        snake.move('Up');
    }
    if (ev.code == 'ArrowDown') {
        snake.move('Down');
    }
});

addEventListener("click", function (ev) {
    if (ev.target == buttonDom) {         
        init(); 
    }else if (ev.target == scaleDom) {         
        localStorage.setItem('scale', scaleDom.getAttribute('value'));
    }else if (ev.target == nameDom) {         
        localStorage.setItem('name', nameDom.getAttribute('name'));
}
    else {
        console.log("click");
        // запускаем таймер  
    }
});



