export const setupMouse = (ipcInterface) => {
  const appBar = document.querySelector('#material-app-bar');
  const searchBox = document.querySelector('#material-one-middle input.sj-search-box');
  const excludes = [
    ...[].slice.call(document.querySelectorAll('.gm-nav-button')),
    ...[].slice.call(
      document.querySelectorAll(
        '#material-one-right > div:first-child > div:first-child > div:first-child > *',
      ),
    ),
    ...(searchBox ? [searchBox.parentNode] : []),
  ];

  const isExcluded = (el) => {
    for (const exclude of excludes) {
      window.el = el;
      window.exclude = exclude;
      if (exclude && exclude.contains(el)) return true;
    }
    return false;
  };

  const remoteMouse = ipcInterface.remoteObject('mouse');
  const mouseDown = (e) => {
    // Only allow left button
    if (e.button !== 0) return;

    // Get the element on the page
    const el = document.elementFromPoint(e.pageX, e.pageY);

    // Ignore excluded elements
    if (isExcluded(el)) return;

    remoteMouse('onMouseDown', e.clientX, e.clientY);
  };

  appBar.addEventListener('mousedown', mouseDown);
};
