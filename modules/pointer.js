function call(func, arg) {
    if (!func)
        return;
    func(arg);
}
function listen(node, callbacks) {
    var hasMoved = false;
    node.addEventListener('pointerdown', (e) => {
        hasMoved = false;
    });
    node.addEventListener('pointermove', (e) => {
        hasMoved = true;
        call(callbacks === null || callbacks === void 0 ? void 0 : callbacks.move, e);
        if (e.buttons === 1)
            call(callbacks === null || callbacks === void 0 ? void 0 : callbacks.drag, e);
    });
    node.addEventListener('pointerup', (e) => {
        if (!hasMoved)
            call(callbacks === null || callbacks === void 0 ? void 0 : callbacks.click, e);
    });
}
export { listen };
