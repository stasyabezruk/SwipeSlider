'use strict'
var helper = {
    getEl: function (query, parent) {
        var context = document.querySelector(parent) || document;
        return context.querySelector(query);
        debugger;
    },
    getElAll: function (query, parent) {
        var context = document.querySelector(parent) || document;
        return context.querySelectorAll(query);
        debugger;
    },
    addEvent: function (evnt, elem, func) {             //зачем проверка?
       if (elem.addEventListener)
          elem.addEventListener(evnt,func,false);
       else if (elem.attachEvent) {
          elem.attachEvent("on"+evnt, func);
       }
       else {
          elem[evnt] = func;
       }
       debugger;
    },
    addClass: function (obj, class_name){
        // ^ - указывает, что символы сопоставимы с началом строки
        // | - ИЛИ
        // $ - указывает, что символы сопоставимы с концом строки
        var re = new RegExp("(^|\\s)" + class_name + "(\\s|$)", "g");   //?

        if (re.test(obj.className)) return
        obj.className = (obj.className + " " + class_name).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
        debugger;   
    },
    removeClass: function (obj, class_name) {
        var classes = obj.className.split(' '),
            i;

        for (i = 0; i < classes.length; i++) {
            if (classes[i] == class_name) {
              classes.splice(i, 1);
              i--;
            }
        }
        obj.className = classes.join(' ');
        debugger;
    },
    hasClass: function (target, className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
        debugger;
    },
    create: function (name, attributes) {
        var el = document.createElement(name),
            val,
            i;

        if (typeof attributes == 'object') {
            for (i in attributes) {
                el.setAttribute(i, attributes[i]);

                if ( i.toLowerCase() == 'class' ) {
                    el.className = attributes[i]; // for IE compatibility

                } else if ( i.toLowerCase() == 'style' ) {
                    el.style.cssText = attributes[i]; // for IE compatibility
                }
            }
        }        
        
        for (i = 2; i < arguments.length; i++) {
            val = arguments[i];
            if ( typeof val == 'string' ) {
                val = document.createTextNode(val)
            };
            el.appendChild(val);
        }
        
        return el;
    } 
}