var pathLayer = new Konva.Layer();
stage.add(pathLayer);
pathLayer.moveToBottom();
imageLayer.moveToBottom();

linePath = new Konva.Line({
    points: [25, 25, 50, 50],
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

endDerivative = new Konva.Line({
    points: [],
    stroke: '#00ff00',
    strokeWidth: 10,
    lineCap: 'square',
    lineJoin: 'round',
    opacity: 0.75,
});

pathLayer.add(linePath);
pathLayer.add(thiccPath);
pathLayer.add(endDerivative);

function drawPath(pts) {
    console.log("asd")
    if (pts.length < 2) {
        linePath.points([]);
        thiccPath.points([]);
        pathLayer.draw();
        return;
    }
    //create a vector array
    var vectors = pts.map(function (pt) {return [pt.x(), pt.y()];});
    
    var path = Smooth(vectors, {
        method: Smooth.METHOD_CUBIC, 
        clip: Smooth.CLIP_NEAREST, 
        cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM,
        });
    // [x1, y1, x2, y2, x3, y3] is the format Konva likes
    var interpArr = [];
    var increment = 1 / PATH_SAMPLES_PER_SEGMENT;
    for (var t = 0; t <= vectors.length-1; t += increment) {
        var pt = path(t);
        interpArr.push(pt[0], pt[1])
    }
    //make sure the line touches the last point
    t = vectors.length - 1;
    pt = path(t);
    interpArr.push(pt[0], pt[1])

    // end derivative + linear extension
    var limitPt = path(t - 0.000000001)
    var slope = (limitPt[1] - pt[1]) / (limitPt[0] - pt[0]);
    var deltaX = Math.sqrt(8 * PIXELS_PER_FOOT * PIXELS_PER_FOOT / (slope * slope + 1)) * -Math.sign(limitPt[0] - pt[0]);
    var linearExtension = [pt[0], pt[1], pt[0] + deltaX, pt[1] + slope * deltaX];

    endDerivative.points(linearExtension);
    linePath.points(interpArr);
    thiccPath.points(interpArr);

    

    pathLayer.draw();
}

function drawPathWrapper() {
    console.log(pointsList.map(function(pathPoint) { return pathPoint.kPoint; }))
    drawPath(pointsList.map(function(pathPoint) { return pathPoint.kPoint; }));
}