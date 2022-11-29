export function serializeJSON(obj: { [key: string]: any }) {
 let newObj: typeof obj = {};
 Object.keys(obj).forEach((key) => {
  let value = obj[key];
  if (value !== null) {
   // If array, loop...
   if (Array.isArray(value)) {
    value = value.map((item) => serializeJSON(item));
   }
   // ...if property is date/time, stringify/parse...
   else if (typeof value === "object" && typeof value.getMonth === "function") {
    value = JSON.parse(JSON.stringify(value));
   }
   // ...and if a deep object, loop.
   else if (typeof value === "object") {
    value = serializeJSON(value);
   }
  }
  newObj[key] = value;
 });
 return newObj;
}

export function serializeArray(arr: Array<Object>) {
 return arr.map((i) => serializeJSON(i));
}
