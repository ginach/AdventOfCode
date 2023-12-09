import * as fsPromise from 'fs/promises';

const board: string[] = [];

const neighbors: { h: number; v: number; }[] = [
    { h: -1, v: -1 }, { h: 0, v: -1 }, { h: 1, v: -1 },
    { h: -1, v: 0 }, /*{ h: 0, v: 0 },*/ { h: 1, v: 0 },
    { h: -1, v: 1 }, { h: 0, v: 1 }, { h: 1, v: 1 },
];

const isNextToSymbol = (x: number, y: number): boolean => {
    for (const neighbor of neighbors) {
        const neighborX = x + neighbor.h;
        const neighborY = y + neighbor.v;
        if (neighborX < 0 || neighborX >= board[0].length || neighborY < 0 || neighborY >= board.length) {
            continue;
        }

        const currentCharacter = board[neighborY][neighborX];

        if (currentCharacter !== '.' && isNaN(parseInt(currentCharacter))) {
            return true;
        }
    }

    return false;
}

const processBoard = (): number => {
    let sum = 0;
    for (let y = 0; y < board.length; y++) {
        let currentNumber = 0;
        let isPartNumber = false;
        for (let x = 0; x < board[y].length; x++) {
            const valueAtIndex = parseInt(board[y][x]);
            const isNumber = !isNaN(valueAtIndex);

            if (isNumber) {
                currentNumber = (currentNumber * 10) + valueAtIndex;
                isPartNumber = isPartNumber || isNextToSymbol(x, y);
            } else if (!isPartNumber) {
                currentNumber = 0;
            }

            if (isPartNumber && (!isNumber || x === board[y].length - 1)) {
                sum += currentNumber;
                currentNumber = 0;
                isPartNumber = false;
            }
        }
    }

    return sum;
}

const processFile = async () => {
    const file = await fsPromise.open('./inputs/day3.txt', 'r');
    for await (const line of file.readLines()) {
        board.push(line);
    }

    console.log(processBoard());
}

processFile();