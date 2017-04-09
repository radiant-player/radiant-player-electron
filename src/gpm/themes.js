import baseCSS from './base.theme.css';

export class Themes {
  constructor() {
    this.currentTheme = null;
    this.containerElement = false;
  }

  get container() {
    if (!this.containerElement) {
      this.containerElement = document.createElement('style');
      this.containerElement.type = 'text/css';
      this.containerElement.id = 'radiant-css';
      document.getElementsByTagName('head')[0].appendChild(this.containerElement);
    }

    return this.containerElement;
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
