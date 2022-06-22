const cleanObject = (orignalObj) => {
  if (!orignalObj) return orignalObj;
  const filtered = Object.keys(orignalObj)
    .filter((key) => {
      if (
        typeof orignalObj[key] === "string" ||
        orignalObj[key] instanceof String
      ) {
        return !orignalObj[key].startsWith("https://api.github.com");
      }
      return true;
    })
    .reduce((obj, key) => {
      if (
        typeof orignalObj[key] === "object" ||
        orignalObj[key] instanceof Object
      ) {
        obj[key] = cleanObject(orignalObj[key]);
      } else {
        obj[key] = orignalObj[key];
      }

      return obj;
    }, {});

  return filtered;
};

module.exports = cleanObject;
