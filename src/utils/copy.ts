export const copyVal = <T, U extends { [propname: string]: any }>(origin: T, set: U) => {
  Object.keys(origin).forEach((item) => {
    if (set.hasOwnProperty(item)) {
      set[item] = origin[item];
    }
  });
};