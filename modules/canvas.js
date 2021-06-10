const MARKER_RADIUS = 12;
/**
 * Register a [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
 * listening for canvas being resized and update it's display
 * dimensions to match it's actual size when it does so.
 * @param { HTMLCanvasElement } canvas
 */
function watchSize(canvas) {
    const observer = new ResizeObserver(() => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        // Redraw content.
        if (lastDraw)
            draw(...lastDraw);
    });
    observer.observe(canvas);
}
var lastDraw;
var markers = [];
function draw(ctx, layer, x, y, zoom, data) {
    lastDraw = [...arguments];
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    // ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(layer, x, y, width / zoom, height / zoom, 0, 0, width, height);
    // Debug crosshair.
    // ctx.fillStyle = 'red';
    // ctx.fillRect(width/2 - 4, height/2 - 4, 4, 4);
    ctx.fillStyle = 'green';
    const size = MARKER_RADIUS * zoom;
    markers = [];
    for (let bug of data) {
        const pos = projectPos(bug.x, bug.y, x, y, zoom);
        markers.push({
            x: pos[0],
            y: pos[1],
            r: size,
            data: bug,
        });
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], size, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'LimeGreen';
        ctx.fill();
        ctx.strokeStyle = 'SeaGreen';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
function projectPos(posX, posY, viewX, viewY, zoom) {
    return [
        (posX - viewX) * zoom,
        (posY - viewY) * zoom,
    ];
}
function getMarker(x, y) {
    for (let marker of markers) {
        if (Math.abs(marker.x - x) + Math.abs(marker.y - y) <= marker.r)
            return marker;
    }
    return null;
}
export { watchSize, draw, projectPos, getMarker };
