export default function membership(str: string) {
 return str.toLowerCase().endsWith("s") ? `${str}'` : `${str}'s`;
}
