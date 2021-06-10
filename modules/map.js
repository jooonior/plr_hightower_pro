import { watchSize, draw, getMarker } from './canvas.js';
import { listen } from './pointer.js';
const view = {
    x: 0,
    y: 0,
    _zoom: 1,
    get zoom() {
        return this._zoom;
    },
    set zoom(value) {
        const factor = 1 / this._zoom - 1 / value;
        this.x += ctx.canvas.width * factor / 2;
        this.y += ctx.canvas.height * factor / 2;
        this._zoom = value;
    }
};
var active = 0;
var ctx;
var layers;
var callback;
var bugs;
function render() {
    const visibleBugs = bugs.filter(bug => (bug.layers & 2 ** active) != 0);
    draw(ctx, layers[active], view.x, view.y, view.zoom, visibleBugs);
}
function pan(e) {
    view.x -= e.movementX / view.zoom;
    view.y -= e.movementY / view.zoom;
    render();
}
function zoom(e) {
    if (e.deltaY > 0) {
        view.zoom /= 1.05;
    }
    else if (e.deltaY < 0) {
        view.zoom *= 1.05;
    }
    render();
}
function click(e) {
    const marker = getMarker(e.offsetX, e.offsetY);
    if (!marker)
        return;
    callback(marker.data.desc);
}
function init(canvas, mapLayers, callbackFunc, buglist) {
    watchSize(canvas);
    ctx = canvas.getContext('2d');
    layers = mapLayers;
    callback = callbackFunc;
    bugs = buglist;
    listen(canvas, {
        drag: pan,
        click: click,
    });
    view.x = (layers[0].naturalWidth - canvas.clientWidth) / 2;
    view.y = (layers[0].naturalHeight - canvas.clientHeight) / 2;
    canvas.addEventListener('wheel', zoom);
    render();
}
function changeLayer(i) {
    active = i;
    render();
}
export { init, changeLayer };
