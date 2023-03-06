// ПАРАМЕТРЫ ИГРЫ
// масштаб поля
const scale = 10;

let pole = document.querySelector(".pole");
let square = document.querySelector('.square');
let direction = 'Up';

// головной класс в который отражает наполнение квадрата неким элементом 
// и манипуляции с этим квадратом
class Container {

    #x = 0;
    #y = 0;
    dom = null;
    constructor() { }
    // ставит контейнер на поле
    set(x, y) {
        this.#x = x;
        this.#y = y;
        square = document.getElementById(`X${x}Y${y}`);
        square.appendChild(this.dom);
    }
    // Возвращает получает координаты контейнера
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    // удаляет контейнер из заданной ячейки
    remove(x, y) {
        this.#x = 0;
        this.#y = 0;
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
    remove() {
        super.remove();
        if (this.dom != null) this.dom.remove();
    }
}

class Snake {
    // тело змеи это массив контейнеров со своими координатами

    #body = [];

    // создаем змею голова-тело-хвост
    constructor() {

        let head = new Container();
        head.dom = document.createElement('img');
        head.dom.setAttribute('src', './images/head.png');
        head.dom.setAttribute('alt', 'head');
        head.dom.setAttribute('width', '100%');
        head.dom.setAttribute('height', '100%');
        head.dom.classList.add('snake');
        this.#body.push(head);

        this.#body.push(this.createPart());
        this.#body.push(this.createPart());

        let tail = new Container();
        tail.dom = document.createElement('img');
        tail.dom.setAttribute('src', './images/tail.png');
        tail.dom.setAttribute('alt', 'head');
        tail.dom.setAttribute('width', '100%');
        tail.dom.setAttribute('height', '100%');
        tail.dom.classList.add('snake');
        this.#body.push(tail);
    }

    // Разместим змею  на поле
    // этот класс не наследник контейнера поэтому никаких пересечений   
    // Передаю начальную точку  куда поставить
    setInitial(x, y) {
        this.#body[0].set(x, y);
        this.#body[1].set(x + 1, y);
        this.#body[2].set(x + 2, y);
        this.#body[3].set(x + 3, y);
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
    // выходе true -  продолжаем игру
    // false  - конец
    move(directionNext) {

        // если обратно направвление движения не меняю
        if ((directionNext == 'Right' && direction == 'Left')
            || (directionNext == 'Left' && direction == 'Right')
            || (directionNext == 'Up' && direction == 'Down')
            || (directionNext == 'Down' && direction == 'Up'))

            directionNext = direction;
        else
            direction = directionNext;

        let head = this.#body[0];

        // новое потенциальное положение головы
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
            // удалим яблоко с поля
            apple.remove();
            // передвигаем только голову и на ее место записываем обычную часть 
            // и возвращаемся
            let part = this.createPart();
            this.#body.unshift(head); // добавили голову вместо яблока
            this.#body[1] = this.createPart(); //  вместо головы вписали часть
            this.#body[1].set(head.getX(), head.getY()); // части присвоим координаты головы
            head.set(newX, newY) // голове присвоим новые координаты
            // ставим новое яблоко (потом вынести в таймер)
            apple.set(getRandom(1, 10), getRandom(1, 10));
            return; // выходим
        }

        // проверка на само поедание
        if (this.EatSelf(newX, newY)) return false; // гейм закончен

        // если валидно передвигаем координаты с хвоста

        for (let i = this.#body.length - 1; i > 0; i--) {
            // сдвинули тело
            this.#body[i].set(this.#body[i - 1].getX(), this.#body[i - 1].getY());
        }
        // дописали голову
        head.set(newX, newY)
        return true; // продолжаем играть
    }

    // проверяет столкновения 
    // указывается целевой контейнер функция проверяет перечечения контейнера и змеи и выдает 
    // true - пересечения есть
    // falce - пересечение  нет
    EatSelf(x, y) {
        for (let i = 0; i < this.#body.length; i++) {
            if (this.#body[i].getX() == x && this.#body[i].getY() == y)
                return true;
        }
        return false;
    }
    // проверяет столкновения  с яблоком
    // true - Сьели
    // falce - Не сьели
    eatAple(newX, newY) {
        return (apple.getX() == newX && apple.getY() == newY) ? true : false;
    }
}

let apple = new Apple();
let snake = new Snake();

// Инициация игры
function init() {
    // раскраска поля
    for (let x = 1; x <= scale; x++) {
        for (let y = 1; y <= scale; y++) {
            let square = document.createElement('div'); // создаём элемент
            square.classList.add('square'); // добавляем класс
            // console.log(11);
            square.id = `X${x}Y${y}`;
            square.style.gridcolumnstart = x;
            square.style.gridcolumnstart = x;
            square.style.gridrowstart = y;
            square.style.gridrowend = y;
            // square.innerHTML = square.id;
            pole.appendChild(square);
        }
    }
    // Добавим яблоко
    apple.set(getRandom(1, 10), getRandom(1, 10));
    snake.setInitial(5, 5);
}

// Генератор случайных чисел в диапазоне
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
    // The maximum is inclusive and the minimum is inclusive
}

// При перезагрузе читаем сторидж
document.addEventListener("DOMContentLoaded", function () {
    // const myJSON = readStorage();
    // render(myJSON);
    // Инициация игры
    init();
    // запускаем таймер

});

addEventListener("keydown", function (ev) {

    // здесь проверка на обратный ход
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