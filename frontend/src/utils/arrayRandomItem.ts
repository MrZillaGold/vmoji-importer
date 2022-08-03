import { randomNumber } from './randomNumber';

export function arrayRandomItem<I>(array: I[]): I {
    return array[randomNumber(0, array.length)];
}
