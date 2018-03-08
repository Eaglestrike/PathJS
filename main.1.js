function Point(x, y) {
    this.x = x;
    this.y = y;
}

function renderPointLines(canvas, point) {
    ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(point.x, point.y, CANVAS_PIXELS_PER_FOOT / 5, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(point.x, canvas.height);
    ctx.lineTo(point.x, 0);
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(0, point.y, canvas.height);
    ctx.lineTo(canvas.width, point.y);
    ctx.stroke();
}

const CANVAS_PIXELS_PER_FOOT = 100

function CanvasState(canvas, image, imageWidthFeet, origin) {
    this.imageWidthFeet = imageWidthFeet;
    this.image = image;
    this.origin = origin;
    this.pathPoints = [];

    canvas.width = CANVAS_PIXELS_PER_FOOT * imageWidthFeet;
    canvas.height = (this.image.height / this.image.width) * canvas.width;

    this.render = function(canvas) {
        ctx = canvas.getContext('2d');
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height)
        
        ctx.fillStyle = 'green';
        ctx.lineWidth = CANVAS_PIXELS_PER_FOOT / 20
        ctx.strokeStyle = 'green'
        renderPointLines(canvas, this.origin)    
    }
}

window.onload = function() {
    var canvas = document.getElementById("view");
    var canvasState;
    var image = new Image()
    image.src = "./field1.png"
    image.onload = function() {
        canvasState = new CanvasState(canvas, image, 24, new Point(100, 100));
        canvasState.render(canvas);
    }   
}