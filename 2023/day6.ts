import * as fsPromise from 'fs/promises';

const getLineValues = (line: string, part: number) => {
    if (part === 1) {
        return line.split(':')[1].trim().split(/\s+/).map(value => parseInt(value));
    }
    
    const result = parseInt(line.split(':')[1].replace(/\s+/g, ''));
    return [result];
}
const processFile = async (part: number) => {
    const file = await fsPromise.open('./inputs/day6.txt', 'r');

    let times: number[] = [];
    let distances: number[] = [];
    for await (const line of file.readLines()) {
        if (!times.length) {
            times = getLineValues(line, part);
        } else {
            distances = getLineValues(line, part);
        }
    }

    let product = 1;

    for (let i = 0; i < times.length; i++) {
        let waysToWin = 0;
        for (let j = 0; j < times[i]; j++) {
            let total = j * (times[i] - j);
            if (total > distances[i]) {
                waysToWin++;
            }
        }

        product = product * waysToWin;
    }

    console.log(`Part ${part}: ${product}`);
}

processFile(1);
processFile(2);