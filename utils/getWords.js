import {allWords} from "./words.js";

export const getWords = (num) => {
    const array = [];
    while (array.length !== num) {
        const item = allWords[Math.floor(Math.random()*allWords.length)];
        if (!array.some(i => i === item)) {
            array.push(item);
        }
    }
    return array;
}