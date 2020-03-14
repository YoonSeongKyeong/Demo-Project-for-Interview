export const isConformToInterface = (target: any, instance: any): boolean => {
  if (Array.isArray(instance)) {
    if (!Array.isArray(target)) {
      throw new Error(
        `type of ${target} is not Array : [target]:${target}, [instance]:${instance}`,
      );
      // return false;
    }
    if (target.length === 0 || instance.length === 0) {
      return true;
    }
    return isConformToInterface(target[0], instance[0]);
  }
  if (instance === null) {
    return target === null;
  }
  if (typeof instance === 'object') {
    if (typeof target !== 'object') {
      throw new Error(
        `type of ${target} is not Object : [target]:${target}, [instance]:${instance}`,
      );
      // return false;
    }
    let isMatch = true;
    for (const k in instance) {
      isMatch = isMatch && isConformToInterface(target[k], instance[k]);
    }
    return isMatch;
  } else {
    if (typeof target === typeof instance) {
      return true;
    }
    throw new Error(
      `type of ${target} is not ${typeof instance} : [target]:${target}, [instance]:${instance}`,
    );
    // return false;
  }
};
