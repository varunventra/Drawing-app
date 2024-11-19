const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let brushSize = 5;
let brushColor = "#000000";
let erasing = false;

// Set the initial canvas background color to white
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Brush size preview
const preview = document.createElement("div");
preview.style.position = "absolute";
preview.style.borderRadius = "50%";
preview.style.border = "1px solid black";
preview.style.pointerEvents = "none";
document.body.appendChild(preview);

// Update brush size preview
function updateBrushPreview(size, x, y) {
  preview.style.width = `${size}px`;
  preview.style.height = `${size}px`;
  preview.style.left = `${x - size / 2}px`;
  preview.style.top = `${y - size / 2}px`;
  preview.style.backgroundColor = erasing ? "#ffffff" : brushColor;
}

// Mouse events for drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = erasing ? "#ffffff" : brushColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
  updateBrushPreview(brushSize, e.pageX, e.pageY);
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.closePath();
});

// Adjust brush size
document.getElementById("brushSize").addEventListener("input", (e) => {
  brushSize = e.target.value;
});

// Change brush color
document.getElementById("colorPicker").addEventListener("input", (e) => {
  brushColor = e.target.value;
  erasing = false;
});

// Activate eraser
document.getElementById("eraserBtn").addEventListener("click", () => {
  erasing = true;
});

// Clear the canvas
document.getElementById("clearBtn").addEventListener("click", () => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Save the canvas drawing
document.getElementById("saveBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "drawing.png";
  link.click();
});

// Upload and display an image on the canvas
document.getElementById("uploadImage").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (event) => {
      img.onload = () => {
        // Clear the canvas before adding the image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});
