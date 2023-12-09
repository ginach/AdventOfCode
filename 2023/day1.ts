import * as fsPromise from 'fs/promises';

const numStrings = [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const parseDigit = (input: string, index: number, isReverse: boolean): number | undefined => {
    const temp = (input[index] as any) - ('0' as any);
    if (temp >= 1 && temp <= 9) {
        return temp;
    }

    for (let i = 0; i < numStrings.length; i++) {
        const numString = numStrings[i];
        const searchStart = isReverse ? index - numString.length + 1 : index;
        if (searchStart < 0) continue;
        if (input.startsWith(numString, searchStart)) return i + 1;
    }

    return undefined;
}

const calculateValueForLine = (line: string): number => {
    let value = 0;
    for (let i = 0; i < line.length; i++) {
        const idxValue = parseDigit(line, i, false);
        if (idxValue) {
            value += idxValue * 10;
            break;
        }
    }

    for (let i = line.length - 1; i >= 0; i--) {
        const idxValue = parseDigit(line, i, true);
        if (idxValue) {
            value += idxValue;
            break;
        }
    }

    return value;
}

const parseFile = async () => {
    let total = 0;
    const file = await fsPromise.open('./inputs/input-aoc-2023-1.txt', 'r');
    for await (const line of file.readLines()) {
       const lineValue = calculateValueForLine(line);
       console.log( line + ": " + lineValue);
       total += lineValue;
    }

    console.log(total);
}

parseFile();