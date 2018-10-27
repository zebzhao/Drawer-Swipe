var DrawerSwipe = function (direction, element) {
  var $this = this;
  $this.percent = 0;
  $this.lastTouch = null;
  $this._buffer = [];
  $this._bufferLength = 5;
  $this._distanceX = 0;
  $this.closeInProgress = false;
  $this.positionThreshold = 60;
  $this.speedThreshold = 30;
  $this.minimumSpeed = 20;
  $this.minimumPercentageThreshold = 5;
  $this.direction = direction;
  $this.beganPan = false;
  $this.getWidth = function () { return 0 };
  $this.onPanStart = function () { return true };
  $this.onPan = function () { return true };
  $this.onSwipe = function () { return true };
  $this.onCompleteSwipe = function () {};
  $this.onIncompleteSwipe = function () {};
  $this.applyChanges = function () {};

  element.addEventListener("touchmove", function (e) {
    var firstTouch = e.touches[0];
    if ($this.onPanStart(e)) {
      if ($this.lastTouch) {
        var deltaX = firstTouch.screenX - $this.lastTouch.screenX;
        $this._distanceX += deltaX;
        $this.addBuffer(deltaX);
        $this.pan($this._distanceX);
        $this.beganPan = true;
      }
      $this.lastTouch = firstTouch;
    }
  });

  element.addEventListener("touchend", function (e) {
    $this.lastTouch = null;
    $this._distanceX = 0;

    var maxValue = Math.max.apply(null, $this._buffer);
    var minValue = Math.min.apply(null, $this._buffer);
    $this._buffer.length = 0;

    var leftToRight = $this.direction & DrawerSwipe.Direction.LTR;
    var rightToLeft = $this.direction & DrawerSwipe.Direction.RTL;
    var closeToRight = leftToRight && maxValue >= $this.speedThreshold;
    var closeToLeft = rightToLeft && minValue <= -$this.speedThreshold;

    if (Math.abs($this.percent) >= $this.positionThreshold || closeToRight || closeToLeft) {
      if ($this.onSwipe()) {
        $this.animate({
          maxValue: closeToRight && maxValue,
          minValue: closeToLeft && minValue
        });
      }
    }
    else if ($this.beganPan) {
      $this.animate(null, true);
    }
  });
};

!(function () {
  var raf = window.requestAnimationFrame || window.setImmediate || function(c) { return setTimeout(c, 0); };

  DrawerSwipe.prototype = {
    addBuffer: function (value) {
      var buffer = this._buffer;
      var bufferLength = this._bufferLength;
      if (buffer.unshift(value) > bufferLength) buffer.length = bufferLength;
    },

    pan: function (distanceX) {
      var $this = this;

      if ($this.closeInProgress) {
        return;
      }
      else if (!$this.onPan(distanceX)) {
        $this.reset();
        return;
      }

      var width = $this.getWidth();
      var leftToRight = $this.direction & DrawerSwipe.Direction.LTR;
      var rightToLeft = $this.direction & DrawerSwipe.Direction.RTL;
      var percent = Math.round(distanceX / width * 100);

      if (!(leftToRight && percent > 0 || rightToLeft && percent < 0)) {
        percent = 0;
      }

      if (percent != $this.percent && Math.abs(percent) >= $this.minimumPercentageThreshold) {
        if (Math.abs(percent) >= 100) {
          $this.animate();
        }
        else {
          $this.applyChanges(percent);
          $this.percent = percent;
        }
      }
    },

    animate: function (speed, reverse, restart) {
      var $this = this;
      var width = $this.getWidth();

      if (restart) {
        $this.closeInProgress = false;
        $this.percent = $this.direction == DrawerSwipe.Direction.LTR ? 100 : -100;
      }

      if (!$this.closeInProgress) {
        if (raf) {
          $this.closeInProgress = true;
          raf(update);
        }
        else {
          $this.onCompleteSwipe();
          $this.reset();
        }
      }

      function update() {
        var deltaPercent = 0;
        var leftToRight = $this.direction & DrawerSwipe.Direction.LTR;
        var rightToLeft = $this.direction & DrawerSwipe.Direction.RTL;

        if (speed && speed.maxValue) {
          deltaPercent = Math.max(speed.maxValue/3, $this.minimumSpeed)/width * 100;
        }
        else if (speed && speed.minValue) {
          deltaPercent = Math.min(speed.minValue/3, -$this.minimumSpeed)/width * 100;
        }
        else if (leftToRight) {
          deltaPercent = $this.minimumSpeed/width * (reverse ? -100 : 100);
        }
        else if (rightToLeft) {
          deltaPercent = -$this.minimumSpeed/width * (reverse ? -100 : 100);
        }
        $this.percent += deltaPercent;
        var percent = $this.percent;

        if (leftToRight && percent >= 100) {
          percent = 100;
        }
        else if (rightToLeft && percent <= -100) {
          percent = -100;
        }
        else if (reverse) {
          if (leftToRight && percent <= 0) {
            percent = 0;
          }
          else if (rightToLeft && percent >= 0) {
            percent = 0;
          }
        }

        $this.percent = percent;
        $this.applyChanges(percent);

        if (Math.abs(percent) == 100) {
          $this.reset();
          $this.onCompleteSwipe();
        }
        else if (percent == 0) {
          $this.reset();
          $this.onIncompleteSwipe();
        }
        else {
          raf(update);
        }
      }
    },

    reset: function () {
      this.beganPan = false;
      this.closeInProgress = false;
    }
  }

  DrawerSwipe.Direction = {
    LEFT_TO_RIGHT: 1,
    LTR: 1,
    RIGHT_TO_LEFT: 2,
    RTL: 2,
    BOTH: 3
  };  
}());
