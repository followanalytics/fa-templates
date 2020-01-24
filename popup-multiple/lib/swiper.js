import $ from 'jquery';
import _ from 'lodash';

export default class SwipeManager {
  constructor(element) {
    this.xDown = null;
    this.yDown = null;
    this.element = typeof(element) === 'string' ? $(element) : element;

    this.element && this.element[0].addEventListener('touchstart', (e) => {
      this.xDown = e.touches[0].clientX;
      this.yDown = e.touches[0].clientY;
    }, false);
  }

  onLeft(callback) {
    this.onLeft = callback;
    return this;
  }

  onRight(callback) {
    this.onRight = callback;
    return this;
  }

  onUp(callback) {
    this.onUp = callback;
    return this;
  }

  onDown(callback) {
    this.onDown = callback;
    return this;
  }

  handleTouchMove(e) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        this.onLeft();
      } else {
        this.onRight();
      }
    } else {
      if (this.yDiff > 0) {
        this.onUp();
      } else {
        this.onDown();
      }
    }
    // Reset values.
    this.xDown = null;
    this.yDown = null;
  }

  run() {
    this.element[0].addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, false);
  }
}
