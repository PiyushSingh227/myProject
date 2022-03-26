(function ($) {
    jQuery.fn.carouselLineArrow = function (options) { //
        options = $.extend({
            lineDur: 5000, //duration of line-time animation (ms), default is 5000
            slideDur: 500, //duration of toggle slide animation (ms), default is 500
            heightIsProportional: true, // height of slider is proportional to the width when resized, defaultl is true
            linePosition: 'bottom', // position of line-time: 'bottom' or 'top', default is 'bottom'
            lineHeight: '5px', // height of line-time (px, em, rem, %), default is '5px';
            lineColor: 'red' // color of line-time, default is 'red'
        }, options);

        let make = function () {
            //реализация метода

            // стилизуем слайдер
            $(this).css('overflow', 'hidden');

            // узнаем соотношение сторон в картинке 
            let $this = $(this);
            let items = $(this).children(); //слайда
            let imgItem = items.first().children(); //
            let imgsItem = items.children(); //все картинки
            let imgWidth = imgItem.width(); //ширина картинки
            let imgHeight = imgItem.height(); //высота картинки
            let proportial = imgHeight / imgWidth; //соотн. сторон

            // костыль с padding-bottom для получения пропорционального слайдера
            $(this).wrap("<div class='carousel-wrapper-middle'></div>");
            $('.carousel-wrapper-middle').wrap("<div class='carousel-wrapper-outer'></div>");
            $('.carousel-wrapper-outer').css('width', '100%');
            $('.carousel-wrapper-middle').css('width', '100%');

            if (options.heightIsProportional) {
                $('.carousel-wrapper-middle').css('padding-bottom', (proportial * 100) + '%');
            } else {
                wrapperWidth = $('.carousel-wrapper-outer').width();
                $('.carousel-wrapper-middle').css('padding-bottom', imgHeight * wrapperWidth / imgWidth);
            }

            $('.carousel-wrapper-middle').css('position', 'relative');

            // устанавливаем абсолютное позиционирование для слайдов
            $(this).css('position', 'absolute');
            $(this).css('width', '100%');
            $(this).css('height', '100%');
            $(this).css('top', '0%');
            $(this).css('left', '0%');
            items.css('position', 'absolute');
            items.css('width', '100%');
            items.css('height', '100%');
            items.css('top', '0%');
            items.css('left', '0%');
            //imgsItem.css('max-width', '100%');
            imgsItem.css('width', '100%');
            imgsItem.css('height', '100%');
            imgsItem.css('object-fit', 'cover');

            items.css('display', 'none');
            items.eq(0).css('display', 'block');

            ///////////////////////////////////////////
            //создаем полосу длительности показа слайда
            ////////////////////////////////////////////
            $(this).append('<div class="carouselLineArrow-line"><div class="carouselLineArrow-innerline"></div></div>');
            let line = $(this).children('.carouselLineArrow-line');
            // стилизуем line, innerLine
            // if (options.linePosition == 'bottom') {
            //     line.css('bottom', '0');
            // } else {
            //     line.css('top', '0');
            // }
            line.css(options.linePosition, '0');
            line.css('height', options.lineHeight);
            let innerLine = line.children('.carouselLineArrow-innerline');
            innerLine.css('background-color', options.lineColor);
          
            //////////////////////////////////////////////
            /////////  создаем стрелки ///////////////////
            //////////////////////////////////////////////
            $(this).append('<div class="carouselLineArrow-arrow carouselLineArrow-arrow-right"><div class="carouselLineArrow-arrow-inner"></div></div>');
            $(this).append('<div class="carouselLineArrow-arrow carouselLineArrow-arrow-left"><div class="carouselLineArrow-arrow-inner"></div></div>')
            let arrowLeft = $this.children('.carouselLineArrow-arrow-left');
            let arrowRight = $this.children('.carouselLineArrow-arrow-right');

            // параметры
            let iLast = items.length - 1; // индекс последнего слайда
            let iCurr = 0;
            let iNext; // индекс следующего
            let iPrev; // индекс предыдущего
            let sliderHover = false; //мышь над слайдером
            // нужен для проверки: запускать ли анимацию на Line
            let lineIsAnim = false; // на line есть анимация
            let slideIsAnim = false; // на slide есть анимация


            // функции определения следующего и предыдущего индекса
            function nextI(i) {
                return (i < iLast) ? i + 1 : 0;
            }