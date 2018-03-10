var originLayer = new Konva.Layer();
var origin = new Konva.Circle({
    x: stage.getWidth(),
    y: stage.getHeight(),
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

origin.on('dragstart dragmove dragend', function() {
    xAxis.points([0, origin.y(), stageWidth, origin.y()]);
    yAxis.points([origin.x(), 0, origin.x(), stageHeight]);
    pointsList.forEach(function (pathPoint) {
        pathPoint.updateCoordinatesFromCanvasSpace();
    });
});

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