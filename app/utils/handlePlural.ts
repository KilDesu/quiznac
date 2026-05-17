export function handlePlural(word: string, count: number | undefined) {
  return count === 1 ? word : `${word}s`;
}
