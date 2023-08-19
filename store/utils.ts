
import { Store } from "@reduxjs/toolkit";
import { RootState } from ".";
export function observeStoreChange(store: Store, select: (state: RootState) => any, onChange: (state: any) => void) {
  let currentState: any;

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
