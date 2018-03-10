var pathLayer = new Konva.Layer();
stage.add(pathLayer);
pathLayer.moveToTop();

linePath = new Konva.Line({
    points: [],
    stroke: 'red',
    strokeWidth: 10,
    lineCap: 'round',
    lineJoin: 'round'
});

thiccPath = new Konva.Line({
    points: [],
    stroke: 'black',
    strokeWidth: ROBOT_WIDTH_FEET * PIXELS_PER_FOOT,
    lineCap: 'square',
    lineJoin: 'round',
    opacity: 0.25,
});

function drawPath(pts) {
    if (pts.length < 2) {
        linePath.points([]);
        thiccPath.points([]);
        pathLayer.draw();
        return;
    }
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

    linePath.points(interpArr);
    thiccPath.points(interpArr);
    pathLayer.draw();
}

function drawPathWrapper() {
    drawPath(pointsList.map(function(pathPoint) { return pathPoint.kPoint; }));
}