const canvas = document.querySelector("canvas"),
    toolsbtn = document.querySelectorAll(".tool"),
    fillcolor = document.querySelector("#fill-color"),
    sizeslider = document.querySelector("#size-slider"),
    colorbtns = document.querySelectorAll(".colors .option"),
    colorpicker = document.querySelector("#color-picker"),
    clearcanvas = document.querySelector(".clear-canvas"),
    saveimage = document.querySelector(".Save-image"),
    ctx = canvas.getContext("2d");

let prevmouseX, prevmouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushwidth = 5;
let selectedcolor = "#000";

// Set canvas background color
const setcanvasbackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedcolor;
};

// Set canvas size on page load
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setcanvasbackground();
});

// Draw rectangle
const drawrect = (e) => {
    const width = prevmouseX - e.offsetX;
    const height = prevmouseY - e.offsetY;
    if (!fillcolor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, width, height);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, width, height);
    }
};

// Draw circle
const drawcircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevmouseX - e.offsetX), 2) + Math.pow((prevmouseY - e.offsetY), 2));
    ctx.arc(prevmouseX, prevmouseY, radius, 0, 2 * Math.PI);
    if (fillcolor.checked) ctx.fill();
    else ctx.stroke();
};

// Draw triangle
const drawtriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevmouseX, prevmouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevmouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    if (fillcolor.checked) ctx.fill();
    else ctx.stroke();
};

// Start drawing
const startdraw = (e) => {
    isDrawing = true;
    prevmouseX = e.offsetX;
    prevmouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushwidth;
    ctx.strokeStyle = selectedcolor;
    ctx.fillStyle = selectedcolor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Drawing on canvas
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedcolor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawrect(e);
    } else if (selectedTool === "circle") {
        drawcircle(e);
    } else if (selectedTool === "triangle") {
        drawtriangle(e);
    }
};

// Tool selection event
toolsbtn.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// Brush size adjustment
sizeslider.addEventListener("change", () => brushwidth = sizeslider.value);

// Color button selection
colorbtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedcolor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Color picker change event
colorpicker.addEventListener("input", () => {
    colorpicker.parentElement.style.background = colorpicker.value;
    colorpicker.parentElement.click();
});

// Clear canvas event
clearcanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setcanvasbackground();
});

// Save canvas as image
saveimage.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

// Mouse events for drawing
canvas.addEventListener("mousedown", startdraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
