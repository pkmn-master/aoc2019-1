const fileUtils = require('../utils/file-utils');

const wirePaths = fileUtils
    .readInputLines('day3.txt')
    .map(wireInstruction => {
        return wireInstruction
            .split(',')
            .map(instructions => {
                return {
                    direction: instructions.slice(0, 1),
                    distance: parseInt(instructions.slice(1))
                }
            });
    });

const path1 = createPath(wirePaths[0]);
const path2 = createPath(wirePaths[1]);
const crossLocations = findCrossLocations(path1, path2);

partOne();
partTwo();

function partOne() {
    console.log('part1');
    const minDistance = getCrossPathsMinimumDistance();

    console.log('min distance', minDistance);
}

function partTwo() {
    console.log('part2');
    const minTravelDistance = getCrossPathsMinTravelDistance();

    console.log('min travel distance', minTravelDistance);
}

/**
 *
 * @param wirePath []
 *
 * @return []
 */
function createPath(wirePath) {
    console.log('walking paths');
    let location = {curX: 0, curY: 0};
    const locations = [
        location
    ];
    let distanceFromOrigin = 0;
    for (let i = 0; i < wirePath.length; i++) {
        const instruction = wirePath[i];
        const instructionLocations = getRelativeLocations(location.curX, location.curY, instruction.direction, instruction.distance, distanceFromOrigin);
        distanceFromOrigin += instruction.distance;
        location = instructionLocations[instructionLocations.length - 1];
        locations.push(...instructionLocations);
    }

    return locations;
}

function getPathLocationFromCrossLocation(pathInstance, location) {
    return pathInstance.find(pathLocation => {
        return isLocationMatch(pathLocation, location);
    });
}

function getRelativeLocations(curX, curY, direction, distance, totalTravelDistanceFromOrigin) {
    const locations = [];
    let travelDistanceFromOrigin = totalTravelDistanceFromOrigin;
    for (let i = 0; i < distance; i++) {
        switch (direction) {
            case 'U':
                curY += 1;
                break;
            case 'D':
                curY -= 1;
                break;
            case 'L':
                curX -= 1;
                break;
            case 'R':
                curX += 1;
                break;
        }
        locations.push({
            curX,
            curY,
            travelDistanceFromOrigin: ++travelDistanceFromOrigin
        });
    }

    return locations;
}

function findCrossLocations(path1, path2) {
    console.log('finding cross locations');
    const crossLocations = [];
    // start at 1 to ignore the 0,0 origin
    for (let i = 1; i < path1.length; i++) {
        const path1location = path1[i];
        for (let k = 1; k < path2.length; k++) {
            const path2location = path2[k];
            if (isLocationMatch(path1location, path2location)) {
                crossLocations.push(path1location);
            }
        }
    }
    return crossLocations;
}

function isLocationMatch(location1, location2) {
    return location1.curX === location2.curX &&
        location1.curY === location2.curY;
}

function getCrossPathsMinimumDistance() {
    console.log('getting cross path locations min distance');
    return crossLocations
        .reduce((min, location) => {
            const distance = getLocationDistance(location);
            return !min ? distance : Math.min(min, distance);
        }, null);
}

function getCrossPathsMinTravelDistance() {
    console.log('getting cross path fewest steps');

    let minTravelDistance = null;
    for(let i = 0; i < crossLocations.length; i++) {
        const crossPathLocation = crossLocations[i];
        const path1Location = getPathLocationFromCrossLocation(path1, crossPathLocation);
        const path2Location = getPathLocationFromCrossLocation(path2, crossPathLocation);
        
        const combinedTravelDistance = path1Location.travelDistanceFromOrigin + path2Location.travelDistanceFromOrigin;
        minTravelDistance = !minTravelDistance ? combinedTravelDistance : Math.min(minTravelDistance, combinedTravelDistance);
    }
    
    return minTravelDistance;
}

function getLocationDistance(location) {
    return Math.abs(location.curX) + Math.abs(location.curY);
}