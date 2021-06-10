function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', reject);
        image.src = url;
    });
}
async function loadImages(urls) {
    const images = urls.map(url => loadImage(url));
    return await Promise.all(images);
}
export { loadImage, loadImages };
