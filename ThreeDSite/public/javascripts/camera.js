export class CameraMover {
    constructor(camera, movespeed) {
        this.camera = camera;
        this.heading = 0;
        this.nextHeading = 0;
        this.state = 'stop';
        this.speed = movespeed;
        this.stepCount = 0;
        this.commandList = undefined;
        this.currentCommandIdx = 0;
        this.currentCommand = undefined;
        this.currentRouteName = "";
        this.routeStopped = undefined;
    }

    getPosition() {
        return { x: this.camera.position.x, y: this.camera.position.z, o: this.heading };
    }
    nextState() {
        if (this.commandList !== undefined && this.commandList.length>0) {
            this.currentCommandIdx = (this.currentCommandIdx + 1) % this.commandList.length;
            this.currentCommand = this.commandList[this.currentCommandIdx];
            this.state = this.currentCommand.type;
            if (this.state === 'heading') {
                this.nextHeading = this.currentCommand.value;
            }
        }
        else {
            this.state = 'stop';
        }

    }
    setRoute(route, routeName) {
        if (this.state !== 'stop') { return; }
        this.commandList = route;
        this.currentRouteName = routeName;
        this.currentCommandIdx = -1;
        this.nextState();
    }
    setPosition(routepoint) {
        this.camera.position.set(routepoint.x, 0, routepoint.y);
        this.nextHeading = routepoint.o;
        this.heading = this.nextHeading;
        this.camera.rotation.y = this.heading * -(Math.PI / 2);
    }
    doCommand(routepoint) {
        this.currentCommand = routepoint;
        this.state = this.currentCommand.type;
        if (this.state === 'heading') {
            this.nextHeading = this.currentCommand.value;
        }
    }
    update() {
        switch (this.state) {
            case 'set': {
                this.setPosition(this.currentCommand.value);
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
                if (this.stepCount >= this.currentCommand.value) {
                    this.stepCount = 0;
                    this.nextState();
                }
            } break;
            case 'stop': {
                if (this.currentRouteName !== "") {
                    if (this.routeStopped !== undefined) {
                        this.routeStopped(this.currentRouteName);
                    }
                    this.currentRouteName = "";
                }
                break;
            }

        }
    }
}