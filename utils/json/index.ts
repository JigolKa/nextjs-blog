export function serializeJSON(obj: { [key: string]: any }) {
 if (typeof obj !== "object") return obj;

 let newObj: typeof obj = {};

 Object.keys(obj).forEach((key) => {
  let value = obj[key];

  if (value !== null) {
   if (Array.isArray(value)) {
    value = value.map((item) => serializeJSON(item));
   } else if (
    typeof value === "object" &&
    typeof value.getMonth === "function"
   ) {
    value = JSON.parse(JSON.stringify(value));
   } else if (typeof value === "object") {
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

export function exclude<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
 for (let key of keys) {
  delete obj[key];
 }
 return obj;
}

export function excludeArray<T, K extends keyof T>(arr: Array<T>, keys: K[]) {
 return arr.map((v) => exclude(v, keys));
}

export function removeKeys<T>(
 obj: T,
 keys: (keyof T)[]
): Omit<T, typeof keys[number]> {
 var out = { ...obj };

 for (let i = 0; i < keys.length; i++) {
  const key = keys[i];

  delete out[key];
 }

 return out as Omit<T, typeof keys[number]>;
}
