export default function getUrlParams(search: string) {
 const hashes = search.slice(search.indexOf("?") + 1).split("&");
 const params: { [key: string]: string } = {};
 hashes.map((hash) => {
  const [key, val] = hash.split("=");
  params[key] = decodeURIComponent(val);
 });
 return params;
}
