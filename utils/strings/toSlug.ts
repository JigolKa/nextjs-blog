export default function toSlug(str: string) {
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

export async function getUniqueSlug(str: string) {
 const slug = toSlug(`${str}-${Math.floor(Math.random() * 64 ** 4)}`);

 return slug;
}
