const goldenRatio = 1.61803398875
const goldenAngle = 2.399963 //137.507764 gradi
let angleInRadians = goldenAngle;
let distancePower = 1;
let spiralMaxDistance = 200;

let canvasWidth = 700;
let canvasHeight = 700;

let highlightYN = true;
let strokeYN = true;
let highlightEvery = 2;
let highlightOffset = 0;
let highlightColor;
let neutralColor;

window.addEventListener('load', () => {
    //document.querySelector('#auto-draw').checked
    document.querySelector('#highlight-every').addEventListener('input', (e) => highlightEvery = int(e.target.value));
    document.querySelector('#highlight-offset').addEventListener('input', (e) => highlightOffset = int(e.target.value));
    document.querySelector('#number-of-points').addEventListener('input', (e) => numberOfPoints = int(e.target.value));
    document.querySelector('#distance-max').addEventListener('input', (e) => spiralMaxDistance = int(e.target.value));
    document.querySelector('#distance-power').addEventListener('input', (e) => distancePower = float(e.target.value));

    document.querySelector('#angle-in-radians').addEventListener('input', (e) => {
        let angle = float(e.target.value);
        if (angle == 0) {
            angleInRadians = goldenAngle;
        }
        else {
            angleInRadians = angle;
        }
    });

    document.querySelectorAll('input').forEach(input => {
        if (input.type == 'checkbox') {
            input.addEventListener('click', () => {
                if (document.querySelector('#auto-draw').checked) {
                    drawPoints();
                }
            })
        }
        else {
            input.addEventListener('input', () => {
                if (document.querySelector('#auto-draw').checked) {
                    drawPoints();
                }
            })
        }
    })

})

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('#p5-container'));

    highlightColor = color('yellow');
    neutralColor = color('white');

    drawPoints();
}

let numberOfPoints = 1000;
let showLines = false;

function drawPoints() {
    background('grey');
    highlightYN = document.querySelector('#highlight-YN').checked;
    strokeYN = document.querySelector('#stroke-YN').checked;
    showLines = document.querySelector('#line-YN').checked;

    if (strokeYN)
        stroke('black')
    else
        noStroke()

    for (let i = 0; i < numberOfPoints; i++) {
        let distance = Math.pow(i / (numberOfPoints - 1), distancePower) //goes from 0 to 1
        distance *= spiralMaxDistance;
        let angle = angleInRadians * i;
        let x = distance * Math.cos(angle) + canvasWidth / 2;
        let y = distance * Math.sin(angle) + canvasHeight / 2;
        if (highlightYN && (i + highlightOffset) % highlightEvery == 0)
            fill(highlightColor);
        else
            fill(neutralColor);

        ellipse(x, y, 5, 5);
        if (showLines)
            connectWithLine(x, y)
    }
}

let previousPoint = {
    x: canvasWidth / 2,
    y: canvasHeight / 2
}

function connectWithLine(x, y) {
    line(previousPoint.x, previousPoint.y, x, y);
    previousPoint.x = x;
    previousPoint.y = y;
}

let activeAnimation;
let clearAimationOptionalCall = null;

function makeAnimation(startAnimation, animation, endAnimation) {
    clearAnimation();
    clearAimationOptionalCall = endAnimation;
    startAnimation();
    activeAnimation = setInterval(animation, 10)
}

function clearAnimation() {
    if (clearAimationOptionalCall) {
        clearAimationOptionalCall();
        clearAimationOptionalCall = null;
    }
    if (activeAnimation) {
        clearInterval(activeAnimation);
    }
}

function animationIncreasePoints(from, to) {
    makeAnimation(() => numberOfPoints = from, () => {
        if (numberOfPoints < to) {
            numberOfPoints++;
            drawPoints();
        }
        else {
            clearAnimation();
        }
    }, () => {
        let event = new Event('input');
        document.querySelector('#number-of-points').dispatchEvent(event);
    })
}

function animationIncreaseAngle(from, to, step) {
    makeAnimation(() => angleInRadians = from, () => {
        if (angleInRadians < to) {
            angleInRadians += step
            drawPoints();
        }
        else {
            clearAnimation();
        }
    }, () => {
        let event = new Event('input');
        document.querySelector('#angle-in-radians').dispatchEvent(event);
    })
}

function animationHighlightIncreaseOffset(highlightEv, offsetFrom, offsetStep, offsetTo) {
    makeAnimation(() => {
        highlightEvery = highlightEv;
        highlightOffset = offsetFrom;
    }, () => {
        if (highlightOffset < offsetTo) {
            highlightOffset += offsetStep
            drawPoints();
        }
        else {
            clearAnimation();
        }
    }, () => {
        let event = new Event('input');
        document.querySelector('#highlight-every').dispatchEvent(event);
        document.querySelector('#highlight-offset').dispatchEvent(event);
    })
}

function animationDistancePower(distanceFrom, distanceTo, step) {
    makeAnimation(() => {
        distancePower = distanceFrom;
    }, () => {
        //nota: qui inserisco > per l'animazione
        if (distancePower > distanceTo) {
            distancePower += step;
            drawPoints();
        }
        else {
            clearAnimation();
        }
    }, () => {
        let event = new Event('input');
        document.querySelector('#distance-power').dispatchEvent(event);
    })
}