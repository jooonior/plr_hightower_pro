import { loadImages } from './modules/fetch-util.js';
import { init, changeLayer } from './modules/map.js';
var canvas;
fetch('./index.json')
    .then(response => response.json())
    .then(data => loadAssets(data));
async function loadAssets(data) {
    let layers, releases;
    const releaseUrls = data.releases.map((r) => r.changelog);
    [layers, releases] = await Promise.all([
        loadLayers(data.layers),
        loadReleases(releaseUrls)
    ]);
    init(canvas, layers, showChange, releases.flat());
    changeLayer(layers.length - 1);
}
async function showChange(url) {
    const response = await fetch(url);
    const data = await response.text();
    const desc = document.getElementById('description');
    try {
        desc.innerHTML = marked(data);
    }
    catch {
        desc.textContent = data;
    }
}
async function loadLayers(urls) {
    const layers = await loadImages(urls);
    registerLayers(layers);
    return layers;
}
async function loadReleases(urls) {
    const requests = urls.map(async (url) => {
        const response = await fetch(url);
        return await response.json();
    });
    const releases = await Promise.all(requests);
    return releases;
}
function registerLayers(imgs) {
    const layers = document.getElementById('layers');
    for (let i = 0, max = imgs.length; i < max; i++) {
        const node = document.createElement('div');
        node.addEventListener('click', (e) => {
            var _a;
            (_a = document.querySelector('#layers > div.active')) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
            e.target.classList.add('active');
            changeLayer(i);
        });
        layers.appendChild(node);
    }
    layers.children[imgs.length - 1].classList.add('active');
}
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
});
