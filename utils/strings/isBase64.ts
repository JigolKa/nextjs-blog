const isBase64Regex =
 /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

export default function isBase64(str: string): boolean {
 return isBase64Regex.test(str);
}
