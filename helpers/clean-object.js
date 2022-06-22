// this function cleans the object
// removes all fields having values starting with https://api.github.com
const cleanObject = (orignalObj) => {
  if (!orignalObj) return orignalObj;
  // going through each key and checking
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
      // reducing the list of keys to an cleaned object

      // checking for nested objects and cleaning them recursively
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

  // the cleaned object is returned
  return filtered;
};

module.exports = cleanObject;
