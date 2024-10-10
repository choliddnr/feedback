export const isEmptyObject = (obj: Object) => {
  let isEmpty = true;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      isEmpty = false;
      break;
    }
  }
  return isEmpty;
};

export const countObjectAttribute = (
  obj: { [key: string]: any } | undefined,
  withEmptyValue: boolean = false
) => {
  let count = 0;
  if (!obj) return 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (withEmptyValue) {
        count++;
      } else {
        if (obj[key] !== "" && obj[key] !== undefined) count++;
      }
    }
  }
  return count;
};

// export const testObj = ()=
