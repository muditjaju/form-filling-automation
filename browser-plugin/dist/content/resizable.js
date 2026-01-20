export function makeResizable(el, handle) {
    handle.onmousedown = function (e) {
        e.preventDefault();
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    };
    function resize(e) {
        const width = e.clientX - el.offsetLeft;
        const height = e.clientY - el.offsetTop;
        if (width > 200)
            el.style.width = width + 'px';
        if (height > 100)
            el.style.height = height + 'px';
    }
    function stopResize() {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    }
}
