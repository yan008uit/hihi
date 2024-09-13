export class WebGLCanvas {
    constructor(id, parentElement, width, height) {
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!this.gl) {
            alert("WebGL not supported.");
            return;
        }
    }
}