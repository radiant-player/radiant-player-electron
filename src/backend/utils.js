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
