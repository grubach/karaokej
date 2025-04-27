import { useState } from "react";
import { Store } from "../store/store";
import useStore from "./useStore";

const useStoreState = <T>(store: Store<T>): T => {
  const [state, setState] = useState(store.getValue());
  useStore(
    store,
    "default",
    (storeState) => {
      setState(storeState);
    },
    [store, setState]
  );
  return state;
};

export default useStoreState;
