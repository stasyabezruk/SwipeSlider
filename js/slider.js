'use strict';

var _extend = function (Parent, Child) {
    var i;  
    function Surrogate() {};//Промежуточная функция конструктор нужна для того что-бы не дать доступ к изменению прототипа родителя из дочернего обьекта

    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate();
    Child._super = Parent.prototype;
};

var Slider = (function () {
    var _interval;

    function Slider (config) {
        this.images = config.images;
        this.mode = config.mode;
        this.delay = config.swipeDelay;
        this.speed = config.swipeSpeed;
        this.target = null;
    }

    Slider.prototype.create = function (el) {
        var target = helper.getEl(el),
            showed = 1,
            type = (this instanceof SwipeSlider) ? 'swipe' : 'fade', // ?
            viewport = helper.create('div', {
                'class': 'viewport'
            }),
            slider = helper.create('ul', {
                class: 'slider ' + type
            }),
            slide = null,
            extraSlide = null,
            img = null;

        this.images.unshift(this.images[this.images.length-1]); //получаем индекс последней картинки и добавляем ее в начало
        this.images.push(this.images[1]); //добавляемв  конец картинку с индексом [1]
        debugger;

        this.images.forEach(function (item, i, arr) {
            img = helper.create('img', {
                src: item,
                alt: 'img ' + i
            });

            slide = helper.create('li', {
                class: 'slide'
            });

            slide.appendChild(img);
            slider.appendChild(slide);
            debugger;
        });

        viewport.appendChild(slider);
        target.appendChild(viewport);
    };
    Slider.prototype.interval = function () {
        var self = this;

        _interval = setInterval(function() {
           self.changeSlide();
        }, self.delay);
        debugger;
    };
    Slider.prototype._clearInterval = function () {
        clearInterval(_interval);
        debugger;
    };
    Slider.prototype.touchStarted = function (event) {
        this.touchStart = (event.touches) ? event.touches[0].pageX : event.pageX;
        debugger;
    };
    Slider.prototype.touchEnded = function (event) {
        this.touchEnd =(event.touches) ? event.changedTouches[0].pageX : event.pageX ;
        if(this.touchStart > this.touchEnd) {
            this.changeSlide(+1);
        } else if(this.touchStart < this.touchEnd) {
            this.changeSlide(-1);
        }
        debugger;
    };
    Slider.prototype.changeSlide = function () {};
    Slider.prototype.init = function () {};
    Slider.prototype.addHandler = function (el) {
        var target = helper.getEl('.viewport', this.target),
            moving,
            self = this;
            debugger;

        if (self.mode === 'auto' || self.mode === 'automanual') {
            helper.addEvent('mouseover', target, function () {
                self._clearInterval();
            });
            debugger;
            helper.addEvent('mouseout', target, function () {

                self.interval();
            });
        }
        if (self.mode === 'manual' || self.mode === 'automanual') {
            helper.addEvent('mousedown', target, function (e) {
                self.touchStarted(e);
                debugger;
                moving = function (e) {
                    e.preventDefault();
                };
                debugger;
                helper.addEvent('mousemove', target, moving);
            });
            debugger;

            helper.addEvent('mouseup', target, function (e) {
                self.touchEnded(e);
                target.removeEventListener('mousemove', moving, false);
            });

            debugger;

            helper.addEvent('touchstart', target, function (e) {
                self.touchStarted(e);
            });

            
            debugger;
            helper.addEvent('touchend', target, function (e) {
                self.touchEnded(e);
            });
            debugger;
        };
    };
    return Slider;
})();


var SwipeSlider = (function (_super) {
    _extend(_super, SwipeSlider);

    function SwipeSlider () {
        _super.apply(this, arguments);
        this.showed = 1;
    }

    SwipeSlider.prototype.changeSlide = function (direction) {
        var next = null,
            self = this,
            slides,
            i;
        this.slider = helper.getEl('.slider', this.target);
        next = (direction) ? this.showed + direction : this.showed + 1;

        helper.removeClass(self.slider, 'clear_transition');

        this.slider.style.transition = 'transform ' + this.speed + 'ms';
        this.moveSlide(100*next);
        if (next === this.images.length-1 || next === 0) {
            (function () {
                var endAnimation = function(event) {
                    self.toLoopSlides(next);
                    self.slider.removeEventListener('webkitTransitionEnd', endAnimation, false);
                }
                helper.addEvent('webkitTransitionEnd', self.slider, endAnimation);
            })();
        } else {
            this.showed = next;
        }
    };

    SwipeSlider.prototype.moveSlide = function (count) {
      this.slider.style.transform = 'translateX(-' + count + '%)';
      this.slider.style.webkitTransform = 'translateX(-' + count + '%)';
      this.slider.style.MozTransform = 'translateX(-' + count + '%)';
      this.slider.style.msTransform = 'translateX(-' + count + '%)';
      this.slider.style.OTransform = 'translateX(-' + count + '%)';
    };

    SwipeSlider.prototype.toLoopSlides = function (next) {
        var elements = this.slider.getElementsByClassName('slide');

        helper.addClass(this.slider, 'clear_transition');
        this.showed = (next === 0) ? elements.length-2 : 1;
        this.slider.style.transform = 'translateX(-' + 100*this.showed + '%)';
    };

    SwipeSlider.prototype.init = function (el) {
        var sliderContainer = helper.getEl(el);
        this.target = el;
        this.create(el);
        this.addHandler(el);

        if(this.mode === 'auto' || this.mode === 'automanual') {
            this.interval();
        }
    };
    return SwipeSlider;
})(Slider);

var FadeSlider = (function (_super) {
    _extend(_super, FadeSlider);
    function FadeSlider () {
        _super.apply(this, arguments);
    }

    return SwipeSlider;
})(Slider);

var swipe = new SwipeSlider({
	// arbitrary number of images
	images: [
		'img/1.png',
		'img/2.png',
		'img/3.png',
		'img/4.png'
	],
	// possible values: 'auto', 'manual', 'automanual'
	mode: 'automanual',
	// arbitrary interger (miliseconds)
	swipeSpeed: 500,
	// arbitrary interger (miliseconds). This is used in 'auto' and 'automanual' modes
	swipeDelay: 3000
});
var swipe1 = new SwipeSlider({
	// arbitrary number of images
	images: [
		'img/1.png',
		'img/2.png',
		'img/3.png',
		'img/4.png'
	],
	// possible values: 'auto', 'manual', 'automanual'
	mode: 'manual',
	// arbitrary interger (miliseconds)
	swipeSpeed: 500,
	// arbitrary interger (miliseconds). This is used in 'auto' and 'automanual' modes
	swipeDelay: 3000
});
swipe.init('.test');
swipe1.init('.test2');