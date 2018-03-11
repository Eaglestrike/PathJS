var originLayer = new Konva.Layer();
var origin = new Konva.Circle({
    x: stageWidth / 2,
    y: stageHeight / 2,
    radius: PIXELS_PER_FOOT / 4,
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true
});
var yAxis = new Konva.Line({
    points: [origin.x(), 0, origin.x(), stageHeight],
    stroke: 'blue',
    strokeWidth: 10,
    lineCap: 'round',
    lineJoin: 'round'
});
var xAxis = new Konva.Line({
    points: [0, origin.y(), stageWidth, origin.y()],
    stroke: 'blue',
    strokeWidth: 10,
    lineCap: 'round',
    lineJoin: 'round'
});
originLayer.add(yAxis);
originLayer.add(xAxis);
originLayer.add(origin);
stage.add(originLayer);
originLayer.moveToTop();

var updateOriginAxis = function() {
    xAxis.points([0, origin.y(), stageWidth, origin.y()]);
    yAxis.points([origin.x(), 0, origin.x(), stageHeight]);
    pointsList.forEach(function (pathPoint) {
        pathPoint.updateCoordinatesFromCanvasSpace();
    });
}

origin.on('dragstart dragmove dragend', updateOriginAxis);

function canvasPixelsToOriginFeet(obj) {
    obj.x -= origin.getX();
    obj.y -= origin.getY();
    obj.x /= PIXELS_PER_FOOT;
    obj.y /= -PIXELS_PER_FOOT;
    return obj;
}

function originFeetToCanvasPixels(obj) {
    obj.x *= PIXELS_PER_FOOT;
    obj.y *= -PIXELS_PER_FOOT;
    obj.x += origin.x();
    obj.y += origin.y();
    return obj;
};

function resetOriginPosition() {
    origin.x(stageWidth / 2);
    origin.y(stageHeight / 2);
    updateOriginAxis();
    originLayer.draw();
}

document.getElementById('reset-origin').addEventListener('click', resetOriginPosition);