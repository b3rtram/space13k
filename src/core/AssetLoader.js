export default class AssetLoader {
  constructor() {
    this.images = {};
  }

  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  async loadAll(manifest) {
    const promises = Object.entries(manifest).map(([key, src]) =>
      this.loadImage(key, src)
    );
    await Promise.all(promises);
  }

  get(key) {
    return this.images[key];
  }
}
