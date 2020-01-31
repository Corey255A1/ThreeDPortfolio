export class CameraMover {
    constructor(camera, movespeed) {
        this.camera = camera;
        this.heading = 0;
        this.nextHeading = 0;
        this.state = 'stop';
        this.speed = movespeed;
        this.stepCount = 0;
        this.currentRoute = undefined;
        this.routePointIdx = 0;
        this.routePoint = undefined;
    }
    getNextPoint() {
        if (this.currentRoute !== undefined) {
            let nextIdx = 0;
            if ((this.routePointIdx + 1) < this.currentRoute.length) {
                nextIdx = this.routePointIdx + 1;
            }
            return { idx: nextIdx, point: this.currentRoute[nextIdx] };
        }
        return undefined;
    }
    nextState() {
        let next = this.getNextPoint();
        if (next !== undefined) {
            this.routePoint = next.point;
            this.routePointIdx = next.idx;
            this.state = this.routePoint.type;
            if (this.state === 'heading') {
                this.nextHeading = this.routePoint.value;
            }
        }
        else {
            this.state = 'stop';
        }

    }
    setRoute(route) {
        this.currentRoute = route;
        this.camera.rotation.x = 0;
        this.camera.rotation.y = 0;
        this.camera.rotation.z = 0;
        this.routePointIdx = -1;
        this.nextState();
    }
    setPosition(routepoint) {
        this.camera.position.set(routepoint.x, 0, routepoint.y);
        this.nextHeading = routepoint.o;
        this.heading = this.nextHeading;
        this.camera.rotation.y = this.heading * -(Math.PI / 2);
        //this.camera.rotation.y = this.heading * -(Math.PI/2);
    }
    doCommand(routepoint) {
        this.routePoint = routepoint;
        this.state = this.routePoint.type;
        if (this.state === 'heading') {
            this.nextHeading = this.routePoint.value;
        }
    }
    update() {
        switch (this.state) {
            case 'set': {
                this.setPosition(this.routePoint.value);
                this.nextState();
            } break;
            case 'heading': {
                if ((this.heading < this.nextHeading - 0.01) || (this.heading > this.nextHeading + 0.01)) {
                    if (this.heading === 3 && this.nextHeading === 0) { this.nextHeading = 4; }
                    if (this.nextHeading > this.heading) {
                        this.heading += 0.1;
                    } else if (this.nextHeading < this.heading) {
                        this.heading -= 0.1;
                    }
                    this.camera.rotation.y = this.heading * -(Math.PI / 2);
                    return;
                }
                this.heading = Math.round(this.heading) % 4;
                this.nextHeading = this.heading;
                this.nextState();
            } break;
            case 'move': {
                switch (this.heading) {
                    case 0: this.camera.position.z -= this.speed; break;
                    case 1: this.camera.position.x += this.speed; break;
                    case 2: this.camera.position.z += this.speed; break;
                    case 3: this.camera.position.x -= this.speed; break;
                }
                this.stepCount += this.speed;
                if (this.stepCount >= this.routePoint.value) {
                    this.stepCount = 0;
                    this.nextState();
                }
            } break;
            case 'stop': {
                break;
            }

        }
    }
}