export default class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.justReleased = {};

    this._onKeyDown = (e) => {
      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;
    };

    this._onKeyUp = (e) => {
      this.keys[e.code] = false;
      this.justReleased[e.code] = true;
    };

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
  }

  isDown(code) {
    return !!this.keys[code];
  }

  wasPressed(code) {
    return !!this.justPressed[code];
  }

  wasReleased(code) {
    return !!this.justReleased[code];
  }

  endFrame() {
    this.justPressed = {};
    this.justReleased = {};
  }

  destroy() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
  }
}
