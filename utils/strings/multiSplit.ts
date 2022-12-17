export default function multiSplit(str: string, delimeters: string[] | string) {
 var result = [str];
 if (typeof delimeters == "string") delimeters = [delimeters];

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
