const isBase64Regex =
 /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

export function getUrlParams(search: string) {
 const hashes = search.slice(search.indexOf("?") + 1).split("&");
 const params: { [key: string]: string } = {};

 hashes.map((hash) => {
  const [key, val] = hash.split("=");
  params[key] = decodeURIComponent(val);
 });

 return params;
}

export function multiSplit(str: string, delimeters: string[] | string) {
 var result = [str];
 if (typeof delimeters === "string") delimeters = [delimeters];

 while (delimeters.length > 0) {
  for (var i = 0; i < result.length; i++) {
   var tempSplit = result[i].split(delimeters[0]);
   result = result
    .slice(0, i)
    .concat(tempSplit)
    .concat(result.slice(i + 1));
  }
  delimeters.shift();
 }

 return result;
}

export function isBase64(str: string): boolean {
 return isBase64Regex.test(str);
}

export function membership(str: string) {
 return str.toLowerCase().endsWith("s") ? `${str}'` : `${str}'s`;
}

export function plurial(length: number, string: string) {
 const endInY = string.toLowerCase().endsWith("y");
 if (length === 1 || length === 0) {
  return endInY ? string + "y" : string;
 }

 if (endInY) return string + "ies";

 return string + "s";
}

export function randomString(length: number, chars?: string) {
 var result = "";
 var characters = chars
  ? chars + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

 var charactersLength = characters.length;
 for (var i = 0; i < length; i++) {
  result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

export function toSlug(str: string) {
 str = str.replace(/^\s+|\s+$/g, ""); // trim
 str = str.toLowerCase();

 var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
 var to = "aaaaeeeeiiiioooouuuunc------";
 for (var i = 0, l = from.length; i < l; i++) {
  str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
 }

 str = str
  .replace(/[^a-z0-9 -]/g, "")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-");

 return str;
}

export function getUniqueSlug(str: string) {
 const slug = toSlug(
  `${truncate(str, 50)}-${Math.floor(Math.random() * 64 ** 4)}`
 );

 return slug;
}

export function truncate(str: string, length: number) {
 return str.substring(0, Math.min(length, str.length));
}

export function capitalize(str: string) {
 return str.charAt(0).toUpperCase() + str.slice(1);
}
