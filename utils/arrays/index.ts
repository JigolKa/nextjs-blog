export function addToArray<T>(arr: Array<T>, item: T) {
 return [...arr, item];
}

export function removeFromArray<T>(
 arr: Array<T>,
 // eslint-disable-next-line
 filter: (value: T, index: number, array: Array<T>) => boolean
) {
 return [...arr.filter((value, index, array) => filter(value, index, array))];
}
