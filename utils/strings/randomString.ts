export default function randomString(length: number, chars?: string) {
 var result = "";
 var characters = chars
  ? chars
  : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

 var charactersLength = characters.length;
 for (var i = 0; i < length; i++) {
  result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}
