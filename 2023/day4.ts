import * as fsPromise from 'fs/promises';

type Game = {
    winningNumbers: string[];
    myNumbers: string[];
    instances: number;
}

const games: Game[] = [];

const calculateScore = (): number => {
    let score = 0;
    for (let i = 0; i < games.length; i++) {
        const { winningNumbers, myNumbers } = games[i];
        let matches = 0;
        let addToScore = 0;
        for (const number of myNumbers) {
            if (winningNumbers.includes(number)) {
                matches++;
                if (addToScore === 0) {
                    addToScore = 1;
                } else {
                    addToScore *= 2;
                }
            }
        }

        score += addToScore;

        for (let j = 1; j < matches + 1; j++) {
            games[i+j].instances += games[i].instances;
        }
    }

    return score;
}

const calculateNumberOfCards = (): number => {
    let count = 0;
    games.forEach(game => {
        count += game.instances;
    });
    return count;
}

const processFile = async () => {
    const file = await fsPromise.open('./inputs/day4.txt', 'r');
    for await (const line of file.readLines()) {
       const currentLine = line.split(':');
       const parts = currentLine[1].split('|');
       games.push({ winningNumbers: parts[0].trim().split(/\s+/), myNumbers: parts[1].trim().split(/\s+/), instances: 1 });
    }

    console.log(`Part 1 score: ${calculateScore()}`);
    console.log(`Number of cards: ${calculateNumberOfCards()}`);
}

processFile();