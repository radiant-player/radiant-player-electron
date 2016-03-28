import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import invariant from 'invariant';
import ReactElement from 'react/lib/ReactElement';
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactUpdates from 'react/lib/ReactUpdates';
// import ReactElectronMenuIDOperations from './ReactElectronMenuIDOperations';

function render(element) {
  // Is the element valid
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  );

  // Create a root ID
  const id = ReactInstanceHandles.createReactRootID();

  // Mount the app
  const component = instantiateReactComponent(element);

  // Attach to menu
  // ReactElectronMenuIDOperations.setMenu(menu);

  ReactUpdates.batchedUpdates(() => {
    const transaction = ReactUpdates.ReactReconcileTransation.getPooled();
    transaction.perform(() => {
      component.mountComponent(id, transaction, {});
    });
    ReactUpdates.ReactReconcileTransation.release(transaction);
  });

  return component._instance;
}

export default { render };
