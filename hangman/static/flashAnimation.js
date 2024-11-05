const piece1 = [[-40, 120, -70, 260, -130, 230, -170, 200, -170, 100, -160, 40, -170, 10, -150, -10, -140, 10, -40, -20, 0, -20],[0, -20, 40, -20, 140, 10, 150, -10, 170, 10, 160, 40, 170, 100, 170, 200, 130, 230, 70, 260, 40, 120, 0, 120]];
const piece2 = [[-40, -30, -50, -40, -100, -46, -130, -40, -176, 0, -186, -30, -186, -40, -120, -170, -110, -210, -80, -230, -64, -210, 0, -210],[0, -210, 64, -210, 80, -230, 110, -210, 120, -170, 186, -40, 186, -30, 176, 0, 130, -40, 100, -46, 50, -40, 40, -30, 0, -30]];
const piece3 = [[-60, -220, -80, -240, -110, -220, -120, -250,-90, -280, -60, -260, -30, -260, -20, -250, 0, -250],[0, -250, 20, -250, 30, -260, 60, -260, 90, -280, 120, -250,110, -220, 80, -240, 60, -220, 0, -220]];

let flashCanvas, flashCtx;

document.addEventListener('DOMContentLoaded', (event) => {
    flashCanvas = document.getElementById('flashAnimation');
    if (flashCanvas) {
        flashCtx = flashCanvas.getContext('2d');
        flashCanvas.width = 400;  // Increase if necessary
        flashCanvas.height = 600; // Increase if necessary
    } else {
        console.error("Flash animation canvas not found");
    }
});

function fillVertices(piece, v) {
    for(let i = 0; i < piece[0].length; i += 2) {
        v.push({x: piece[0][i], y: 180 - piece[0][i+1]});
    }
    for(let i = 0; i < piece[1].length; i += 2) {
        v.push({x: piece[1][i], y: 180 - piece[1][i+1]});
    }
}

function calcWaypoints(vertices) {
    let waypoints = [];
    for(let i = 1; i < vertices.length; i++) {
        let pt0 = vertices[i-1];
        let pt1 = vertices[i];
        let dx = pt1.x - pt0.x;
        let dy = pt1.y - pt0.y;
        for(let j = 0; j < 100; j++) {
            let x = pt0.x + dx * j / 100;
            let y = pt0.y + dy * j / 100;
            waypoints.push({x: x, y: y});
        }
    }
    return waypoints;
}
/*
function startFlashAnimation() {
    if (!flashCtx) {
        console.error("Flash animation context not available");
        return;
    }

    flashCtx.clearRect(0, 0, flashCanvas.width, flashCanvas.height);
    flashCtx.setTransform(1, 0, 0, 1, flashCanvas.width / 2, flashCanvas.height / 2);

    let vertices1 = [], vertices2 = [], vertices3 = [];
    fillVertices(piece1, vertices1);
    fillVertices(piece2, vertices2);
    fillVertices(piece3, vertices3);

    let points1 = calcWaypoints(vertices1);
    let points2 = calcWaypoints(vertices2);
    let points3 = calcWaypoints(vertices3);

    let startTime = performance.now();
    let animationDuration = 6000; // 1 second for the animation
    let totalDuration = 10000; // 6 seconds total

    function animateFrame(currentTime) {
        let elapsedTime = currentTime - startTime;
        let progress = Math.min(elapsedTime / animationDuration, 1);

        flashCtx.clearRect(-flashCanvas.width / 2, -flashCanvas.height / 2, flashCanvas.width, flashCanvas.height);

        let frame = Math.floor(progress * points1.length);
        animate(points1, frame, 'red');
        animate(points2, frame, 'green');
        animate(points3, frame, 'blue');

        if (elapsedTime < totalDuration) {
            requestAnimationFrame(animateFrame);
        } else {
            flashCtx.clearRect(-flashCanvas.width / 2, -flashCanvas.height / 2, flashCanvas.width, flashCanvas.height);
        }
    }

    requestAnimationFrame(animateFrame);
}

function animate(points, frame, color) {
    flashCtx.beginPath();
    flashCtx.strokeStyle = color;
    flashCtx.lineWidth = 2;
    for (let i = 0; i < frame; i++) {
        flashCtx.lineTo(points[i].x, points[i].y);
    }
    flashCtx.stroke();
}*/
function startFlashAnimation() {
    if (!flashCtx) {
        console.error("Flash animation context not available");
        return;
    }


    flashCtx.clearRect(0, 0, flashCanvas.width, flashCanvas.height);
    flashCtx.setTransform(1, 0, 0, 1, flashCanvas.width / 2, flashCanvas.height / 2);

    let vertices1 = [], vertices2 = [], vertices3 = [];
    fillVertices(piece1, vertices1);
    fillVertices(piece2, vertices2);
    fillVertices(piece3, vertices3);

    let points1 = calcWaypoints(vertices1);
    let points2 = calcWaypoints(vertices2);
    let points3 = calcWaypoints(vertices3);
    console.log("Points1 length:", points1.length);
    console.log("Points2 length:", points2.length);
    console.log("Points3 length:", points3.length);

    let startTime = performance.now();
    let animationDuration = 1000; // 1 second for the animation
    let totalDuration = 6000; // 6 seconds total

    function animateFrame(currentTime) {
        let elapsedTime = currentTime - startTime;
        let progress = Math.min(elapsedTime / animationDuration, 1);

        flashCtx.clearRect(-flashCanvas.width / 2, -flashCanvas.height / 2, flashCanvas.width, flashCanvas.height);

        // Draw all lines, but only up to the current progress
        animate(points1, Math.floor(progress * points1.length), 'red');
        animate(points2, Math.floor(progress * points2.length), 'green');
        animate(points3, Math.floor(progress * points3.length), 'blue');

        if (elapsedTime < totalDuration) {
            requestAnimationFrame(animateFrame);
        } else {
            flashCtx.clearRect(-flashCanvas.width / 2, -flashCanvas.height / 2, flashCanvas.width, flashCanvas.height);
        }
    }

    requestAnimationFrame(animateFrame);
}

function animate(points, frame, color) {
    flashCtx.beginPath();
    flashCtx.strokeStyle = color;
    flashCtx.lineWidth = 2;
    for (let i = 0; i < frame; i++) {
        if (i === 0) {
            flashCtx.moveTo(points[i].x, points[i].y);
        } else {
            flashCtx.lineTo(points[i].x, points[i].y);
        }
    }
    flashCtx.stroke();
}

window.startFlashAnimation = startFlashAnimation;