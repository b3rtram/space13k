export default class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.justReleased = {};

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseClicked = false;
    this._canvas = null;

    this._onKeyDown = (e) => {
      if (e.code.startsWith('Arrow')) e.preventDefault();
      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;
    };

    this._onKeyUp = (e) => {
      this.keys[e.code] = false;
      this.justReleased[e.code] = true;
    };

    this._onMouseMove = (e) => {
      const rect = this._canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    };

    this._onMouseDown = (e) => {
      if (e.button === 0) this.mouseClicked = true;
    };

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
  }

  bindCanvas(canvas) {
    this._canvas = canvas;
    canvas.addEventListener('mousemove', this._onMouseMove);
    canvas.addEventListener('mousedown', this._onMouseDown);
  }

  isDown(code) {
    if (Array.isArray(code)) return code.some((c) => this.keys[c]);
    return !!this.keys[code];
  }

  wasPressed(code) {
    if (Array.isArray(code)) return code.some((c) => this.justPressed[c]);
    return !!this.justPressed[code];
  }

  wasReleased(code) {
    if (Array.isArray(code)) return code.some((c) => this.justReleased[c]);
    return !!this.justReleased[code];
  }

  wasClicked() {
    return this.mouseClicked;
  }

  endFrame() {
    this.justPressed = {};
    this.justReleased = {};
    this.mouseClicked = false;
  }

  destroy() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    if (this._canvas) {
      this._canvas.removeEventListener('mousemove', this._onMouseMove);
      this._canvas.removeEventListener('mousedown', this._onMouseDown);
    }
  }
}
