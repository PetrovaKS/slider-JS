// Функционал:

// кнопки далее и назад
// подпись текста к каждому слайду
// вывод номера и максимального количества (1/3,2/3,/3/3)
// пагинация (при клике - переключается на нужный слайд)
// Дополнительные параметры:

// loop - возможность листать слайдер по кругу (например когда на 3 слайде нажимаем далее - переходим на 1). true или false
// navs - Вывод стрелочек или их отключение. true или false
// pags - вывод пагинации или отключение. true или false
// auto - слайдер сам переключается, если delay не указан, раз в 5 сек. А
// stopMouseHover - если навести мышкой на слайд, он не переключается, как только мышку убрали, снова пошло. Работает только когда auto равен true. true или false
// delay - время в секундах на показ слайда, если auto true

const slides = [
    {
        img: './img/foto1.jpg',
        text: 'Caption Text 1'
    },
    {
        img: './img/foto2.jpg',
        text: 'Caption Text 2'
    },
    {
        img: './img/foto3.jpg',
        text: 'Caption Text 3'
    },
    {
        img: './img/foto4.jpg',
        text: 'Caption Text 4'
    },
    {
        img: './img/foto5.jpg',
        text: 'Caption Text 5'
    },
    {
        img: './img/foto6.jpg',
        text: 'Caption Text 6'
    },
];



class Slider {
    constructor (imgArrow, selector, config) {
        this.slides = imgArrow;
        this.selector = selector;
        this.config = config;
        this.index = 0;
        this.play = null;
        this.delay = this.config.delay || 5;
    }

    init() {
        this._draw();

        if (this.config.navs === true) {
            this.rightArrowEl.addEventListener('click', () => { // клик по кнопке «вперед»
                this._right();
            });
    
            this.leftArrowEl.addEventListener('click', () => { // клик по кнопке «назад»
                this._left();
            });
        }


        if (this.config.pags === true) {  
            this.circleListEl.forEach((circle) => { // клики по кнопкам индикатора текущего кадра
                circle.addEventListener('click', (e) => {
                    const index = Number(e.target.getAttribute('data-id'));
                    if (index === this.index) return;
                    this._goto(index);
                });
            });
        }

        if (this.config.auto === true) { // включить автоматическую прокрутку, если тру

            this._play(this.delay);

            this.sliderEl.addEventListener('mouseenter', () => clearInterval(this.play));  // когда мышь над слайдером — останавливаем автоматическую прокрутку
            this.sliderEl.addEventListener('mouseleave', () => this._play(this.delay)); // когда мышь покидает пределы слайдера — опять запускаем прокрутку
        }
    }

    _draw() {

        this.sliderEl = document.querySelector(this.selector);

        if (this.config.pags === true) {

            this.sliderEl.insertAdjacentHTML('afterend', '<div id="pag"></div>');
            this.pagEl = document.querySelector('#pag');

            for (let i = 0; i < this.slides.length; i++) {
                this.pagEl.insertAdjacentHTML('beforeend', `<div class="pag_circle" data-id=${i}></div>`);
            }

            this.circleListEl = document.querySelectorAll('.pag_circle');
            this.circleListEl[this.index].classList.add('active');
        }

        if (this.config.navs === true) {
            this.sliderEl.insertAdjacentHTML('afterbegin', 
                `<img src="left.png" alt="left" class="left">
                 <img src="right.png" alt="right" class="right">`
                );

            this.leftArrowEl = document.querySelector('.left');
            this.rightArrowEl = document.querySelector('.right');
        }

        this.sliderEl.insertAdjacentHTML('beforeend', '<div class="slider_imgs"></div>');
        this.sliderImgsEl = document.querySelector('.slider_imgs');

        for (let i = 0; i < this.slides.length; i++) {
            this.sliderImgsEl.insertAdjacentHTML('beforeend', 
            `<div class="img" style="background-image: url(${this.slides[i].img})">
                <div class="img_title">${this.slides[i].text}</div>
                <div class="img_number"><span class="current_num">${i + 1}</span> / <span class="amount">${this.slides.length}</span></div>
            </div>
            `);
        }

        this.allImgsListEl = document.querySelectorAll('.img');
        this.allImgsListEl.forEach(img => img.style.width = 100/this.slides.length + '%'); // ширина отдельной картинки в процентах
        this.sliderImgsEl.style.width = 100 * this.slides.length + '%'; // ширина дива со всеми картинками
    }

    _right() { // перейти к следующему кадру
        this._goto(this.index + 1);
    }

    _left() { // перейти к предыдущему кадру
        this._goto(this.index - 1);
    }

    _goto(index) { // перейти к кадру с индексом index

        if (this.config.loop === true) {
            // изменить текущий индекс
            if (index > this.slides.length - 1) {
                this.index = 0;
            } else if (index < 0) {
                this.index = this.slides.length - 1;
            } else {
                this.index = index;
            }
        } else {
            // изменить текущий индекс
            if (index > this.slides.length - 1) {
                this.index = this.slides.length - 1;
            } else if (index < 0) {
                this.index = 0;
            } else {
                this.index = index;
            }
        }
        // выполнить смещение
        this._move();

    }
    
    _move() { // рассчитать и выполнить смещение

        // на сколько нужно сместить, чтобы нужный кадр попал в окно
        const offset = 100/this.slides.length * this.index;
        this.sliderImgsEl.style.transform = `translateX(-${offset}%)`;
        this.circleListEl.forEach(circle => circle.classList.remove('active'));
        this.circleListEl[this.index].classList.add('active');
    }

    _play(delay) { // запустить автоматическую прокрутку
        this.play = setInterval(() => this._right(), delay * 1000);
    }
}


let slider = new Slider (slides, '#slider', {loop: true, navs: true, pags: true, auto: true, delay: 3})
slider.init()