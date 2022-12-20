export default async function sleep(
 t: number = 100,
 // eslint-disable-next-line
 fn: (t?: number) => void
): Promise<void> {
 await new Promise((resolve) => setTimeout(() => resolve(true), t)).then(() =>
  fn(t)
 );
}
