const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const androidCheck = document.getElementById('android-check');

let drawing = false;
let brushSize = 5;
let brushColor = '#000000';

canvas.width = window.innerWidth - 80;
canvas.height = window.innerHeight;

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function endDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    let x, y;
    if (androidCheck.checked) {
        x = e.touches[0].clientX - 80;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX - 80;
        y = e.clientY;
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Function to add event listeners for touch or mouse
function updateEventListeners() {
    if (androidCheck.checked) {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mouseup', endDrawing);
        canvas.removeEventListener('mousemove', draw);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrawing(e);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            endDrawing();
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e);
        });
    } else {
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchend', endDrawing);
        canvas.removeEventListener('touchmove', draw);

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mousemove', draw);
    }
}

// Initialize with the current state of the checkbox
updateEventListeners();

// Update event listeners when the checkbox is toggled
androidCheck.addEventListener('change', updateEventListeners);

document.getElementById('eraser').addEventListener('click', () => {
    brushColor = '#FFFFFF';
});

document.getElementById('reset').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('brush-size').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('color-picker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});
