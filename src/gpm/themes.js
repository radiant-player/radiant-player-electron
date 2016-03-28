import baseCSS from 'text-loader!./base.css';

export class Themes {
  constructor() {
    this.currentTheme = null;
    this._container = false;
  }

  get container() {
    if (!this._container) {
      this._container = document.createElement('style');
      this._container.type = 'text/css';
      this._container.id = 'radiant-css';
      document.getElementsByTagName('head')[0].appendChild(this._container);
    }

    return this._container;
  }

  setTheme(name, css) {
    if (this.currentTheme === name) return;
    this.container.innerHTML = `${baseCSS}${css}`;
    this.currentTheme = name;
  }
}

export const setupThemes = (ipcInterface) => {
  const themes = new Themes();

  ipcInterface.exposeObject({
    key: 'themes',
    object: themes,
  });

  return themes;
};
