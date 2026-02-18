export default class SceneManager {
  constructor() {
    this.stack = [];
    this.pendingOp = null;
  }

  get current() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  push(scene) {
    this.pendingOp = { type: 'push', scene };
  }

  pop() {
    this.pendingOp = { type: 'pop' };
  }

  replace(scene) {
    this.pendingOp = { type: 'replace', scene };
  }

  applyPending(game) {
    if (!this.pendingOp) return;

    const op = this.pendingOp;
    this.pendingOp = null;

    if (op.type === 'pop' || op.type === 'replace') {
      const old = this.stack.pop();
      if (old && old.exit) old.exit(game);
    }

    if (op.type === 'push' || op.type === 'replace') {
      this.stack.push(op.scene);
      if (op.scene.enter) op.scene.enter(game);
    }
  }

  update(game, dt) {
    this.applyPending(game);
    if (this.current && this.current.update) {
      this.current.update(game, dt);
    }
  }

  render(game, ctx) {
    if (this.current && this.current.render) {
      this.current.render(game, ctx);
    }
  }
}
