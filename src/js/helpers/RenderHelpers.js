
export function drawRect(canvas, cellWidth, x, y, width, height) {
    const ctx = canvas.getContext("2d");
    const cw = cellWidth;
    ctx.beginPath();
    ctx.moveTo(x * cw, canvas.height - y * cw);
    ctx.lineTo(x * cw, canvas.height - (y + height) * cw);
    ctx.lineTo((x + width) * cw, canvas.height - (y + height) * cw);
    ctx.lineTo((x + width) * cw, canvas.height - y * cw);
    ctx.lineTo(x * cw, canvas.height - y * cw);
    ctx.stroke();
}

export function fillRect(canvas, cellWidth, x, y, width, height) {
    const ctx = canvas.getContext("2d");
    const cw = cellWidth;
    ctx.fillRect(x * cw, canvas.height - (y + height) * cw, width * cw, height * cw);
}

export function drawImage(canvas, cellWidth, image, x, y, width, height) {
    const ctx = canvas.getContext("2d");
    const cw = cellWidth;
    ctx.drawImage(image, x * cw, canvas.height - (y + height) * cw, width * cw, height * cw);
}
