export type Store<T> = {
  setValue: (newValue: T) => void;
  updateValue: (updater: (value: T) => T) => void;
  resetValue: () => void;
  getValue: () => T;
  subscribe: (
    id: string | "default",
    callback: (store: T) => void
  ) => () => void;
  notifySubscriber: (id: string) => void;
};

export const createStore = <T>(initialValue: T): Store<T> => {
  let value: T = initialValue;
  const subscribtions: Record<string | "default", ((store: T) => void)[]> = {};

  const subscribe = (id: string | "default", callback: (story: T) => void) => {
    if (!subscribtions[id]) {
      subscribtions[id] = [];
    }
    subscribtions[id].push(callback);

    const unsubscribe = () => {
      if (subscribtions[id]) {
        subscribtions[id] = subscribtions[id].filter((cb) => cb !== callback);
      }
    };
    return unsubscribe;
  };

  const notifySubscriber = (id: string) => {
    if (subscribtions[id]) {
      subscribtions[id].forEach((callback) => {
        callback(value);
      });
    }
  };

  const setValue = (newValue: T) => {
    value = newValue;
    notifySubscriber("default");
  };

  const updateValue = (updater: (value: T) => T) => {
    value = updater(value);
    notifySubscriber("default");
  };

  const resetValue = () => {
    value = initialValue;
    notifySubscriber("default");
  };

  const getValue = () => {
    return value;
  };

  return {
    setValue,
    updateValue,
    resetValue,
    getValue,
    subscribe,
    notifySubscriber,
  };
};
