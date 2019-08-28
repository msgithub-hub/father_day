(function (window) {
    var isIOS = function (value) {
        return /iphone/.test(value);
    };
    var isAndroid = function (value) {
        return /android/.test(value);
    };
    var ua = navigator.userAgent;
    var screenWidth = document.body.clientWidth;
    var screenHeight = document.body.clientHeight;
    var Jumper = function (options) {
        this.container = options.container || null;
        this.jumper = options.jumper || null;
        this.g = options.g || 6;
        this.v = 0;
        this.items = [];
        this.gTimer = null
    };
    Jumper.prototype.generate = function(options) {
        var img = document.createElement('img');
        img.src = options.src;
        img.style.width = (options.width || 0) + 'px';
        img.style.left = (options.x || 0) + 'px';
        img.style.top = (options.y || 0) + 'px';
        img.style.position = 'absolute';
        img.type = options.type || 1; //1 加分 2 GG
        img.setAttribute('class', 'item');
        if (this.container) {
            this.container.appendChild(img);
            this.items.push(img);
        }
    };
    Jumper.prototype.start = function() {
        var that = this;
        that.onStart();
        this.jumper.style.left = ((screenWidth - this.jumper.offsetWidth) / 2) + 'px';
        this.jumper.style.top = (screenHeight - this.jumper.offsetHeight) -200 + 'px';
        var x = 0;
        var handleDeviceMotion = function(event) {
            var acceleration = event.accelerationIncludingGravity;
            x = acceleration.x;
            if (isAndroid(ua)) {
                that.jumper.style.left =
                    that.jumper.style.left.indexOf('px') !== -1
                        ? (Number(that.jumper.style.left.substring(0, that.jumper.style.left.length - 2)) - x) + 'px'
                        : 0;
            } else {
                that.jumper.style.left =
                    that.jumper.style.left.indexOf('px') !== -1
                        ? (Number(that.jumper.style.left.substring(0, that.jumper.style.left.length - 2)) + (x * 0.7) ) + 'px'
                        : 0;
            }
        };
        //注册陀螺仪事件,使人物左右移动
        if(window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', handleDeviceMotion, false);
        } else {
            alert('该浏览器不支持devicemotion事件')
        }
        //开启匀速模式, 所有物体匀速下坠, 人物单独开启重力加速度模式, 并检查是否有碰撞状态。
        that.gTimer = setInterval(function () {
            //垃圾清理
            if (that.items.length > 20) {
                that.items.splice(0, 6);
            }
            //匀速下落，并判断是否结束
            var isOver = that.items.some(function (item, index) {
                item.style.top =
                    item.style.top.indexOf('px') !== -1
                        ? (Number(item.style.top.substring(0, item.style.top.length - 2)) + that.g) + 'px'
                        : 0;
                if (that.isTouch(item)) {
                    if (item.type === 1) {
                        that.onScore();
                        that.container.removeChild(item);
                        return false;
                    } else {
                        return true;
                    }
                }
            });
            if (that.isOverStage()) isOver = true;
            if (isOver) {
                window.removeEventListener('devicemotion', handleDeviceMotion);
                clearInterval(that.gTimer);
                that.onOver();
                return;
            }
            //人物下落
            that.jumper.style.top =
                that.jumper.style.top.indexOf('px') !== -1
                    ? (Number(that.jumper.style.top.substring(0, that.jumper.style.top.length - 2)) + (that.g - that.v)) + 'px'
                    : 0;
            that.v--;
        }, 40)
    };
    Jumper.prototype.onScore = function() {

    };
    Jumper.prototype.isTouch = function(target) {
        var l1 = this.jumper.offsetLeft;
        var r1 = this.jumper.offsetLeft + this.jumper.offsetWidth;
        var t1 = this.jumper.offsetTop;
        var b1 = this.jumper.offsetTop + this.jumper.offsetHeight;

        var l2= target.offsetLeft;
        var r2= target.offsetLeft + target.offsetWidth;
        var t2= target.offsetTop;
        var b2= target.offsetTop + target.offsetHeight;
        return !(r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2);
    };
    Jumper.prototype.isOverStage = function(target) {
        return this.jumper.offsetTop > screenHeight
            || this.jumper.offsetTop < 0
            || this.jumper.offsetLeft < 0
            || this.jumper.offsetLeft > screenWidth - 60;
    };
    Jumper.prototype.jump = function() {
        this.v = 25;
    };
    Jumper.prototype.onStart = function() {

    };
    Jumper.prototype.onOver = function() {

    };
    window.Jumper = Jumper
})(window);
