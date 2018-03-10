// init + cfg
const IMAGE_WIDTH_FEET = 24;
const PIXELS_PER_FOOT = 100;
const ROBOT_WIDTH_FEET = 4;
const PATH_SAMPLES_PER_SEGMENT = 10;
const IMAGE_SRC = "./field1.png";
var stageWidth = IMAGE_WIDTH_FEET * PIXELS_PER_FOOT;
var stageHeight = IMAGE_WIDTH_FEET * PIXELS_PER_FOOT; // temporary value
var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: stageWidth, //temporary dimensions
    height: stageHeight
});

// ========================= RESIZING =========================
function fitStageIntoParentContainer() {
    var container = document.getElementById('container');
    var page = document.getElementById('page');
    var panel = document.getElementById('panel');
    

    // now we need to fit stage into parent
    
    // var containerWidth = container.offsetWidth;
    // this makes dynamic resizing account for the panel because flexbox can't
    var containerWidth = page.offsetWidth - panel.offsetWidth - 1.6; // extra - because somehow there's an extra pixel (rounding I think)
    // to do this we need to scale the stage
    var scale = containerWidth / stageWidth;

    stage.width(stageWidth * scale);
    stage.height(stageHeight * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
}
window.addEventListener('resize', fitStageIntoParentContainer);
document.onload = fitStageIntoParentContainer();


// =================== BACKGROUND IMAGE ===================
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
    // stage.add(imageLayer);
    imageLayer.moveToBottom();
    fitStageIntoParentContainer();
};
imageObj.src = IMAGE_SRC;




pointsLayer.moveToTop();
var renderCycle = function() {
    drawPath(points, pathLayer);
    stage.draw();
    requestAnimationFrame(renderCycle)
};
// renderCycle();




















