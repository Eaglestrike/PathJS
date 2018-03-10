var LENGTH_LINEAR_EXTRAPOLATION_FT = 10;

document.getElementById('export-to-robot').addEventListener('click', function() {
    var numPoints = parseInt(document.getElementById('export-to-robot-num-points').value);
    if (numPoints < 10) {
        return;
    }
    if (pointsList.length < 2) {
        return;
    }

    //create a vector array
    var vectors = pointsList.map(function (pt) {return [pt.x, pt.y];});
    
    var path = Smooth(vectors, {
        method: Smooth.METHOD_CUBIC, 
        clip: Smooth.CLIP_NEAREST, 
        cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM,
        scaleTo: [0, numPoints]
        });
    /*
    the robot takes a csv like:
    x,y,distanceSoFar,isEndPointInterpolation
    (data)
    (data)
    ...
    finishLineVectorX,finishLineVectorY
    */
    var pointsCsv = "x,y,distanceSoFar,isEndPointInterpolation\n";
    
    var pt = path(0);
    var distanceSoFar = 0;
    pointsCsv += `${pt[0]},${pt[1]},${distanceSoFar},False\n`
    var lastPt = pt;
    for (var t = 1; t <= numPoints; t++) {
        pt = path(t);
        distanceSoFar += Math.sqrt(
            ((pt[0] - lastPt[0]) * (pt[0] - lastPt[0])) + ((pt[1] - lastPt[1]) * (pt[1] - lastPt[1]))
        );
        pointsCsv += `${pt[0]},${pt[1]},${distanceSoFar},False\n`
        lastPt = pt;
    }

    // end derivative + linear extension using parametric lines
    var stopPt = pt; // capture last path point
    var limitPt = path(numPoints - 0.0001);
    var deltaX = stopPt[0] - limitPt[0]; // final - initial gives a vector
    var deltaY = stopPt[1] - limitPt[1];
    // convert to unit vector
    var magnitude = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    deltaX /= magnitude;
    deltaY /= magnitude;

    var increment = distanceSoFar / numPoints; // estimate user-specified resolution
    for (var t = increment; t <= LENGTH_LINEAR_EXTRAPOLATION_FT; t += increment) {
        pt = [stopPt[0] + deltaX*t, stopPt[1] + deltaY*t];
        distanceSoFar += Math.sqrt(
            ((pt[0] - lastPt[0]) * (pt[0] - lastPt[0])) + ((pt[1] - lastPt[1]) * (pt[1] - lastPt[1]))
        );
        pointsCsv += `${pt[0]},${pt[1]},${distanceSoFar},True\n`
        lastPt = pt;
    }
    pointsCsv += `${deltaX},${deltaY}\n`

    var filename = document.getElementById('path-name-input').value || 'path';

    var blob = new Blob([pointsCsv], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename+".114path");
});

  