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

const calculatePartNumberSum = (): number => {
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

const findNeighboringGears = (x: number, y: number): {x: number, y: number}[] => {
    const gears: {x: number, y: number}[] = [];
    for (const neighbor of neighbors) {
        const neighborX = x + neighbor.h;
        const neighborY = y + neighbor.v;
        if (neighborX < 0 || neighborX >= board[0].length || neighborY < 0 || neighborY >= board.length) {
            continue;
        }

        if (board[neighborY][neighborX] === "*") {
            gears.push({ x: neighborX, y: neighborY });
        }
    }

    return gears;
}

const calculateGearRatioSum = (): number => {
    const gears = new Map<string, number[]>();
    let sum = 0;
    for (let y = 0; y < board.length; y++) {
        let currentNumber = 0;
        let currentGears = new Set<string>();
        for (let x = 0; x < board[y].length; x++) {
            const valueAtIndex = parseInt(board[y][x]);
            const isNumber = !isNaN(valueAtIndex);

            if (isNumber) {
                currentNumber = (currentNumber * 10) + valueAtIndex;
                const neighboringGears = findNeighboringGears(x, y);
                for (const gear of neighboringGears) {
                    const gearKey = JSON.stringify(gear);
                    currentGears.add(gearKey);
                }
            }

            if (!isNumber || x === board[y].length - 1) {
                for (const gear of currentGears) {
                    if (!gears.has(gear)) {
                        gears.set(gear, []);
                    }

                    gears.get(gear)?.push(currentNumber);
                }

                currentGears.clear();
                currentNumber = 0;
            }
        }
    }

    for (const numbers of gears.values()) {
        if (numbers.length === 2) {
            sum += numbers[0] * numbers[1];
        }
    }

    return sum;
}

const processFile = async () => {
    const file = await fsPromise.open('./inputs/day3.txt', 'r');
    for await (const line of file.readLines()) {
        board.push(line);
    }

    console.log(`Part number sum: ${calculatePartNumberSum()}`);
    console.log(`Gear ratio sum: ${calculateGearRatioSum()}`);
}

processFile();