
const gallery = document.querySelector('.gallery');
const image = document.createElement('img'); // создаём элемент <img>
image.setAttribute('src', 'https://picsum.photos/200/300.jpg'); // прописываем URL изображения
image.setAttribute('alt', 'Random image'); // прописываем альтернативный текст для изображения
image.classList.add('border-blue'); // добавляем класс border-blue
gallery.appendChild(image); // добавляем изображение в конец элемента gallery


