/**
 * --- Day 3: Crossed Wires ---
 The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

 Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your puzzle input).

 The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

 For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

 ...........
 ...........
 ...........
 ....+----+.
 ....|....|.
 ....|....|.
 ....|....|.
 .........|.
 .o-------+.
 ...........
 Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

 ...........
 .+-----+...
 .|.....|...
 .|..+--X-+.
 .|..|..|.|.
 .|.-X--+.|.
 .|..|....|.
 .|.......|.
 .o-------+.
 ...........
 These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

 Here are a few more examples:

 R75,D30,R83,U83,L12,D49,R71,U7,L72
 U62,R66,U55,R34,D71,R55,D58,R83 
 = distance 159
 
 R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
 U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 
 = distance 135
 
 What is the Manhattan distance from the central port to the closest intersection?

 Your puzzle answer was 316.

 --- Part Two ---
 It turns out that this circuit is very timing-sensitive; you actually need to minimize the signal delay.

 To do this, calculate the number of steps each wire takes to reach each intersection; choose the intersection where the sum of both wires' steps is lowest. If a wire visits a position on the grid multiple times, use the steps value from the first time it visits that position when calculating the total value of a specific intersection.

 The number of steps a wire takes is the total number of grid squares the wire has entered to get to that location, including the intersection being considered. Again consider the example from above:

 ...........
 .+-----+...
 .|.....|...
 .|..+--X-+.
 .|..|..|.|.
 .|.-X--+.|.
 .|..|....|.
 .|.......|.
 .o-------+.
 ...........
 In the above example, the intersection closest to the central port is reached after 8+5+5+2 = 20 steps by the first wire and 7+6+4+3 = 20 steps by the second wire for a total of 20+20 = 40 steps.

 However, the top-right intersection is better: the first wire takes only 8+5+2 = 15 and the second wire takes only 7+6+2 = 15, a total of 15+15 = 30 steps.

 Here are the best steps for the extra examples from above:

 R75,D30,R83,U83,L12,D49,R71,U7,L72
 U62,R66,U55,R34,D71,R55,D58,R83 
 = 610 steps
 
 R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
 U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 
 = 410 steps
 
 What is the fewest combined steps the wires must take to reach an intersection?

 Your puzzle answer was 16368.
 */

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