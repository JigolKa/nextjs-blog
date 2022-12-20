export default function truncate(str: string, length: number) {
 return str.substring(0, Math.min(length, str.length));
}
