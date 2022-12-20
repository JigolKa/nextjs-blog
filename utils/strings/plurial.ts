const plurial = (length: number, string: string) => {
 const endInY = string.toLowerCase().endsWith("y");
 if (length === 1 || length === 0) {
  return endInY ? string + "y" : string;
 }

 if (endInY) return string + "ies";

 return string + "s";
};

export default plurial;
