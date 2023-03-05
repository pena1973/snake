// ПАРАМЕТРЫ ИГРЫ
// масштаб поля
const scale = 5;

let pole = document.querySelector(".pole");
let square = document.querySelector('.square');

class Apple {
    // создаем яблоко
    constructor() {
        const image = document.createElement('img');
        image.setAttribute('src', './images/apple.png');
        image.setAttribute('alt', 'apple');
        image.classList.add('apple'); // добавляем класс border-blue
        // gallery.appendChild(image); // добавляем изображение в конец элемента gallery
    }

    // ставит яблоко на поле
    set(x, y) {
        square = document.getElementsById(`X${x}Y${y}`);
        square.appendChild(this);
    }
    // получает координаты яблока
    get() {

    }
    // удаляет яблоко из заданной ячейки
    remove(x, y) {

    }
}
let apple = new Apple();

// Инициация игры
function init() {
    // раскраска поля
    for (let x = 1; x <= scale; x++) {
        for (let y = 1; y <= scale; y++) {
            let square = document.createElement('div'); // создаём элемент
            square.classList.add('square'); // добавляем класс
            console.log(11);
            square.id = `X${x}Y${y}`;
            square.style.gridcolumnstart = x;
            square.style.gridcolumnend = x;
            square.style.gridrowstart = y;
            square.style.gridrowstart = y;
            square.innerHTML = square.id;
            pole.appendChild(square);
        }
    }
    // Добавим яблоко
    apple.set(getRandom(1, 10), getRandom(1, 10));
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
});
