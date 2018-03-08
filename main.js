// init
const IMAGE_WIDTH_FEET = 24;
const PIXELS_PER_FOOT = 100;
const ROBOT_WIDTH_FEET = 4;
const PATH_SAMPLES_PER_SEGMENT = 10;
var stageWidth = IMAGE_WIDTH_FEET * PIXELS_PER_FOOT;
var stageHeight = IMAGE_WIDTH_FEET * PIXELS_PER_FOOT; // temporary value
var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: stageWidth, //temporary dimensions
    height: stageHeight
});

// background image
var imageLayer = new Konva.Layer();
var imageObj = new Image();
imageObj.onload = function() {
    //first resize the stage to fit the image
    stage.width(stageWidth)
    stageHeight = (this.height / this.width) * stage.getWidth();
    stage.height(stageHeight);

    var fieldImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: stageWidth,
        height: stageHeight
    });
    imageLayer.add(fieldImage);
    stage.add(imageLayer);
    imageLayer.moveToBottom();
};
imageObj.src = './field1.png';



//create some points:
var pointsLayer = new Konva.Layer();
var points = [];
for (var i = 0; i < 6; i++) {
    points.push(new Konva.Circle({
        x: stage.getWidth() / 2 + i * 60,
        y: stage.getHeight() / 2 + i * 60,
        radius: PIXELS_PER_FOOT / 4,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
    }))
}
points.forEach(function(point) {
    pointsLayer.add(point);
});
stage.add(pointsLayer);

var pathLayer = new Konva.Layer();
function drawPath(pts, renderLayer) {
    //create a vector array
    var vectors = [];
    pts.forEach(function(point) {
        vectors.push([point.x(), point.y()])
    });
    var path = Smooth(vectors, {
        method: Smooth.METHOD_CUBIC, 
        clip: Smooth.CLIP_NEAREST, 
        cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM,
        });
    // [x1, y1, x2, y2, x3, y3]
    var interpArr = [];
    var increment = 1 / PATH_SAMPLES_PER_SEGMENT;
    for (var t = 0; t <= vectors.length-1; t += increment) {
        var pt = path(t);
        interpArr.push(pt[0], pt[1])
    }
    var pathInterp = new Konva.Line({
        points: interpArr,
        stroke: 'red',
        strokeWidth: 10,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var robotInterp = new Konva.Line({
        points: interpArr,
        stroke: 'black',
        strokeWidth: ROBOT_WIDTH_FEET * PIXELS_PER_FOOT,
        lineCap: 'square',
        lineJoin: 'round',
        opacity: 0.25,
    });

    renderLayer.destroyChildren();
    renderLayer.add(pathInterp);
    renderLayer.add(robotInterp);
    console.log(interpArr);
}

stage.add(pathLayer);
pathLayer.moveToTop();
pointsLayer.moveToTop();
var renderCycle = function() {
    drawPath(points, pathLayer);
    stage.draw();
    requestAnimationFrame(renderCycle)
};
renderCycle();





















// adapt the stage on any window resize
function fitStageIntoParentContainer() {
    var container = document.getElementById('container');

    // now we need to fit stage into parent
    var containerWidth = container.offsetWidth;
    // to do this we need to scale the stage
    var scale = containerWidth / stageWidth;

    stage.width(stageWidth * scale);
    stage.height(stageHeight * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
}
fitStageIntoParentContainer();
window.addEventListener('resize', fitStageIntoParentContainer);