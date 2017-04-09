import { Menu } from 'electron';
import Diff from 'deep-diff';

export const bindMenuActions = (menu, actions) => {
  if (Array.isArray(menu)) return menu.map(item => bindMenuActions(item, actions));

  if (typeof menu !== 'object') throw new Error(`Invalid menu item: ${menu}`);

  const item = { ...menu };

  if (item.click) {
    const action = actions[item.click];
    if (!action) throw new Error(`Invalid click action name ${item.click}`);
    item.click = action;
  }

  // item.redux is used to find certain items but isn't necessary for Electron
  if (item.redux) delete item.redux;

  if (item.submenu) item.submenu = bindMenuActions(item.submenu, actions);

  return item;
};

const mutableFields = ['enabled', 'checked', 'visible'];

export default class MenuRenderer {
  constructor(actions = {}, setMenu = Menu.setApplicationMenu) {
    this.actions = actions;
    this.setMenu = setMenu;
    this.previousMenu = false;
    this.applicationMenu = false;
  }

  render(nextMenu) {
    if (nextMenu === this.previousMenu) return;

    if (this.previousMenu) {
      const diff = Diff.diff(this.previousMenu, nextMenu);
      this.previousMenu = nextMenu;

      // No items have changed, return
      if (diff === undefined) return;

      if (!this.needsFullRender(diff)) {
        this.applyDiff(diff);
        return;
      }
    } else {
      this.previousMenu = nextMenu;
    }

    const template = bindMenuActions(nextMenu, this.actions);
    this.applicationMenu = Menu.buildFromTemplate(template);
    this.setMenu(this.applicationMenu);
  }

  needsFullRender(diff) {
    if (!this.previousMenu || !this.applicationMenu) return true;

    // TODO: see if we can replace this for..of
    for (const action of diff) { // eslint-disable-line no-restricted-syntax
      if (action.kind !== 'E') return true;
      if (!mutableFields.includes(action.path[action.path.length - 1])) return true;
    }

    return false;
  }

  applyDiff(diff) {
    diff.forEach((action) => {
      let element = this.applicationMenu.items;

      action.path.slice(0, -1).forEach((key) => {
        element = element[key];
        if (key === 'submenu') element = element.items;
      });

      element[action.path[action.path.length - 1]] = action.rhs;
    });
  }
}
