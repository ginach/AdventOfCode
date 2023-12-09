import * as fsPromise from 'fs/promises';

const red = 12;
const green = 13;
const blue = 14;

type Combo =  { red: number; green: number; blue: number; }
type ParsedLine = { gameNumber: number; combos: Combo[] }

const parseLine = (line: string): ParsedLine => {
    const parts = line.split(':');
    const gameNumber = parseInt(parts[0].split(' ')[1]);

    const returnValue: ParsedLine = {
        gameNumber,
        combos: [],
    };

    const valueSets = parts[1].split(';');
    for (const set of valueSets) {
        const counts = set.trim().split(',');

        const combo = {
            red: 0,
            green: 0,
            blue: 0,
        };

        for (const count of counts) {
            const parts = count.trim().split(' ');
            switch(parts[1]) {
                case 'red':
                    combo['red'] = parseInt(parts[0]);
                    break;
                case 'green':
                    combo['green'] = parseInt(parts[0]);
                    break;
                case 'blue':
                    combo['blue'] = parseInt(parts[0]);
                    break;
            }
        }

        returnValue.combos.push(combo);
    }

    return returnValue;
}

const isGamePossible = (parsedLine: ParsedLine): boolean => {
    for (const combo of parsedLine.combos) {
        if (combo.red > red || combo.green > green || combo.blue > blue) {
            return false;
        }
    }

    return true;
}

const powerForLine = (parsedLine: ParsedLine): number => {
    let minRed = 0;
    let minGreen = 0;
    let minBlue = 0;

    for (const combo of parsedLine.combos) {
        if (minRed < combo.red) {
            minRed = combo.red;
        }

        if (minGreen < combo.green) {
            minGreen = combo.green;
        }

        if (minBlue < combo.blue) {
            minBlue = combo.blue;
        }
    }

    console.log(JSON.stringify(parsedLine));
    console.log(`red: ${minRed}, green: ${minGreen}, blue: ${minBlue}`);
    return minRed * minGreen * minBlue;
}

const processFile = async () => {
    let total = 0;
    const file = await fsPromise.open('./inputs/day2.txt', 'r');
    for await (const line of file.readLines()) {
        const parsedLine = parseLine(line);
        // if (isGamePossible(parsedLine)) {
        //     total += parsedLine.gameNumber;
        // }

        total += powerForLine(parsedLine);
    }

    console.log(total);
}

processFile();