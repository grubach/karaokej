export const createStore = <T>(initialValue: T) => {
  let value: T = initialValue;
  const subscribtions: Record<string, ((story: T) => void)[]> = {};

  const setValue = (newValue: T) => {
    value = newValue;
  };

  const resetValue = () => {
    value = initialValue;
  };

  const getValue = () => {
    return value;
  };

  const subscribe = (id: string, callback: (story: T) => void) => {
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

  return {
    setValue,
    resetValue,
    getValue,
    subscribe,
    notifySubscriber,
  };
};
