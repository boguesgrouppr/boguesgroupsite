export const ABOVE_FOLD_COUNT = 3;

export function isPriorityImage(index: number): boolean {
  return index < ABOVE_FOLD_COUNT;
}