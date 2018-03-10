/*
Two ways of doing it:

Pixel values or feet
Relative to the origin or absolute

feet for imports
relative to the origin for ease of use
*/

const pointsList = [];

function rerenderControlPanel() {
    var containerDiv = document.getElementById('points-list');
    while (containerDiv.firstChild) { //faster
        containerDiv.removeChild(containerDiv.firstChild);
    }

    //re-sort and re-build the panel
    pointsList.sort(function(a, b) {return a.index - b.index;});
    pointsList.forEach(function(pathPoint) {
        containerDiv.appendChild(pathPoint.controlElement);
    });
    window.dispatchEvent(new Event('resize'));
}

function PathPoint(initialX, initialY, initialIndex, updateFunction) {
    // these are in feet
    this.x = initialX;
    this.y = initialY;
    this.index = initialIndex;
    this.updateFunction = updateFunction;
    this.controlElement = document.createElement('div');
    this.controlElement.className = "point-control";
    this.controlElement.innerHTML = `
    <div class="point-number-display">${this.index}</div>
    <input class="coordinate-input x-input" type="text" value="${this.x}">
    <input class="coordinate-input y-input" type="text" value="${this.y}">
    <button class="button-up">U</button>
    <button class="button-down">D</button>
    <button class="button-remove">Rm</button>`;
    
    
    this.swapWith = function(otherIndex) {
        // assume list is sorted by index
        pointsList[otherIndex].index = this.index;
        this.index = otherIndex;
        
        pointsList[otherIndex].updateDisplayedIndex();
        this.updateDisplayedIndex();
        rerenderControlPanel();
        this.updateFunction();
    }

    this.moveUp = function() {
        if (this.index <= 0) {
            return;
        }
        this.swapWith(this.index - 1);
    }

    this.moveDown = function() {
        var that = this;
        if (this.index >= pointsList.length - 1) {
            return;
        }
        that.swapWith(this.index + 1);
    }

    this.updateDisplayedIndex = function() {
        this.controlElement.getElementsByClassName('point-number-display')[0].innerHTML = this.index;
    }


    this.kPoint = new Konva.Circle({
        x: initialX,
        y: initialY,
        radius: PIXELS_PER_FOOT / 4,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
    });
    
    this.setCoordinatesFromUserSpace = function() {
        console.log("daksldasd")
        var xtemp = parseFloat(this.xCoordInput.value);
        var ytemp = parseFloat(this.yCoordInput.value);
        if (isNaN(xtemp) || isNaN(ytemp)) {
            return;
        }
        this.x =  xtemp;
        this.y =  ytemp;
        this.kPoint.position(originFeetToCanvasPixels(this));
        pointsLayer.draw();
        this.updateFunction();
    }
    this.updateCoordinatesFromCanvasSpace = function() {
        var coords = canvasPixelsToOriginFeet(this.kPoint.position());
        this.x = coords.x;
        this.y = coords.y;
        this.xCoordInput.value = this.x;
        this.yCoordInput.value = this.y;
    }

    this.kPoint.on('dragstart dragmove dragend', (function() {this.updateCoordinatesFromCanvasSpace(); this.updateFunction();}).bind(this));

    this.xCoordInput = this.controlElement.getElementsByClassName('x-input')[0];
    this.yCoordInput = this.controlElement.getElementsByClassName('y-input')[0];
    this.xCoordInput.value = this.x;
    this.yCoordInput.value = this.y;
    this.xCoordInput.addEventListener('input', this.setCoordinatesFromUserSpace.bind(this));
    this.yCoordInput.addEventListener('input', this.setCoordinatesFromUserSpace.bind(this));
    // bind listerners to controls
    // the this._____.bind(this) is binding the function 'this.____' to this instnace of PathPoint, so that inside
    // this.______() the `this` keyword refers to this instance, and not the DOM element that triggered the event
    this.controlElement.getElementsByClassName('button-up')[0].addEventListener("click", this.moveUp.bind(this));
    this.controlElement.getElementsByClassName('button-down')[0].addEventListener("click", this.moveDown.bind(this));
}

var pointsLayer = new Konva.Layer();
pointsLayer.moveToTop();

document.getElementById("add-point").addEventListener("click", function() {
    //TODO use linear interpolation to add new point ahead of the last
    pointsList.push(new PathPoint(5, 5, pointsList.length, drawPathWrapper));
    pointsList[pointsList.length-1].setCoordinatesFromUserSpace;
    pointsLayer.add(pointsList[pointsList.length - 1].kPoint);
    rerenderControlPanel();
});

