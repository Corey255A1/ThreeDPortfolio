export class Navigator {
    constructor(map) {
        this.map = map;
    }

    findRoute(start, finish) {
        let directions = this.map.getDirectionOptions(start.x, start.y);
        let mover = {};
        let commandList = [];
        if (start.x === finish.x && start.y === finish.y) {
            if (start.o !== finish.o) {
                commandList.push(this.makeCommandPoint('heading', finish.o));
            }
            return commandList;
        }
        let shortest = undefined;
        for (let idx = 0; idx < directions.length; idx++) {
            mover.x = start.x;
            mover.y = start.y;
            mover.o = start.o;
            let d = directions[idx];
            if (d === 5) continue;
            //If we aren't facing this way, first turn us
            if (d !== mover.o) {
                commandList.push(this.makeCommandPoint('heading', d));
                mover.o = d;
            }
            //add an initial move command
            commandList.push(this.makeCommandPoint('move', 0));
            if (this.nextPoint(mover, finish, commandList)) {
                commandList.push(this.makeCommandPoint('stop'));
                //Shortest by command length .. not necessarily distance
                if (shortest === undefined) {
                    shortest = commandList;
                }
                else if (shortest.length > commandList.length) {
                    shortest = commandList;
                }                
            }
            commandList = [];
        }
        return shortest;
    }

    //recursively traverse through map until finding destination
    nextPoint(mover, finish, commandList) {
        let next = this.map.getNextPoint(mover.x, mover.y, mover.o);
        //we have moved into the abyss, return false
        if (next === undefined) {
            return false;
        }
        //We can move further, so add it to our move.
        commandList[commandList.length - 1].value += this.map.WallWidth;
        //if this next point is our destination, then we are done!
        if (next.x === finish.x && next.y === finish.y) {
            if (mover.o !== finish.o) {
                commandList.push(this.makeCommandPoint('heading', finish.o));
            }
            return true;
        }
        mover.x = next.x;
        mover.y = next.y;
        //else keep looking
        let directions = this.map.getDirectionOptions(mover.x, mover.y);        
        for (let idx = 0; idx < directions.length; idx++) {
            next.o = mover.o;
            let d = directions[idx];
            if (d === ((mover.o + 2) % 4) || (d === 5)) continue;
            //If we aren't facing this way, first turn us
            let headingPop = false;
            if (d !== mover.o) {
                commandList.push(this.makeCommandPoint('heading', d));
                commandList.push(this.makeCommandPoint('move', 0));
                next.o = d;
                headingPop = true;
            }            
            if (this.nextPoint(next, finish, commandList) === false) {                
                if (headingPop) {
                    commandList.pop(); commandList.pop();
                }
                next.x = mover.x;
                next.y = mover.y;
            }
            else {
                return true;
            }
        }
        return false;

    }

    makeCommandPoint(command, value) {
        return { type: command, value: value };
    }
}
