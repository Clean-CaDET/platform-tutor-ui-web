function getRandom(min, max): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function shuffleArray<Type>(arr: Array<Type>): Array<Type>  {
  if (arr.length <= 1) {
    return arr;
  }
  for (let i = 0; i < arr.length; i++) {
    const randomChoiceIndex = getRandom(i, arr.length - 1);
    [arr[i], arr[randomChoiceIndex]] = [arr[randomChoiceIndex], arr[i]];
  }
  return arr;
}
