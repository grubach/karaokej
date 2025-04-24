import { DependencyList, useEffect } from "react";
import { Store } from "../utils/store";

const useStore = <T>(
  store: Store<T>,
  id: string | null,
  listener: (store: T) => void,
  deps: DependencyList
) => {
  useEffect(() => {
    const unsubscribe = store.subscribe(id ?? "default", listener);
    return () => {
      unsubscribe();
    };
  }, [id, store, listener, ...deps]);
};

export default useStore;
