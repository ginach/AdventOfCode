import * as fsPromise from 'fs/promises';

type Range = { start: number; length: number; }

const addDestinationsForRange = (destinations: Range[], range: Range, mapValues: number[][], mapValueIdx: number) => {
    if (mapValueIdx >= mapValues.length || range.start + range.length <= mapValues[mapValueIdx][1]) {
        destinations.push(range);
        return;
    }

    if (range.start >= mapValues[mapValueIdx][1] + mapValues[mapValueIdx][2]) {
        addDestinationsForRange(destinations, range, mapValues, mapValueIdx + 1);
        return;
    }

    const mapValue = mapValues[mapValueIdx];

    if (range.start < mapValue[1]) {
        const leftLength = mapValue[1] - range.start;
        addDestinationsForRange(destinations, { start: range.start, length: leftLength }, mapValues, mapValueIdx);
        addDestinationsForRange(destinations, { start: range.start + leftLength, length: range.length - leftLength }, mapValues, mapValueIdx);
        return;
    }

    const overlapLength = Math.min(range. start + range.length, mapValue[1] + mapValue[2]) - range.start;
    destinations.push({ start: range.start + (mapValue[0] - mapValue[1]), length: overlapLength });

    if (overlapLength < range.length) {
        addDestinationsForRange(destinations, { start: range.start + overlapLength, length: range.length - overlapLength }, mapValues, mapValueIdx + 1);
    }
}

const addValuesToSeeds = (destinations: Range[], sources: Range[], mapValues: number[][]) => {
    mapValues = mapValues.sort((a, b) => a[1] - b[1]);

    for (const source of sources) {
        addDestinationsForRange(destinations, source, mapValues, 0);
    }
}

const processFile = async (part: number) => {
    const file = await fsPromise.open('./inputs/day5.txt', 'r');
    
    let sources: Range[] = [];
    let destinations: Range[] = [];

    let mapValues: number[][] = [];
    for await (const line of file.readLines()) {
        if (line.startsWith('seeds:')) {
            const seedValues = line.substring(7).split(' ');

            if (part === 1) {
                for (let i = 0; i < seedValues.length; i++) {
                    sources.push({
                        start: parseInt(seedValues[i]),
                        length: 1
                    });
                }
            } else {
                for (let i = 0; i < seedValues.length; i += 2) {
                    sources.push({
                        start: parseInt(seedValues[i]),
                        length: parseInt(seedValues[i+1])
                    });
                }
            }

            continue;
        }

        if (!line && mapValues.length > 0) {
            sources = sources.sort((a, b) => a.start - b.start);
            addValuesToSeeds(destinations, sources, mapValues);

            mapValues = [];
            sources = [...destinations];
            destinations = [];
            continue;
        }

        if (line.endsWith('map:')) {
            continue;
        }
        else if (line) {
            mapValues.push(line.split(' ').map(value => parseInt(value)));
        }
    }

    addValuesToSeeds(destinations, sources, mapValues);

    let min: number | undefined = undefined;
    for (const destination of destinations) {
        if (min === undefined || destination.start < min) {
            min = destination.start;
        }
    }

    console.log(min);
}

processFile(1);
processFile(2);