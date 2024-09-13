'use strict';

import {Matrix4} from "../lib/cuon-matrix.js";

export class Rectangle {
    constructor(app, color, width, height) {
        this.app = app;
        this.color = color;
        this.width = width;
        this.height = height;
        this.vertexBuffer = null;
        this.colorBuffer = null;

        // Initializes buffers
        this.initBuffers();
    }

    initBuffers() {
        const gl = this.app.gl;

        const vertices = new Float32Array([
            -this.width / 2, 0, -this.height / 2, // Bottom left
             this.width / 2, 0, -this.height / 2, // Bottom right
             this.width / 2, 0,  this.height / 2, // Top right
            -this.width / 2, 0,  this.height / 2  // Top left
        ]);


        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const colors = new Float32Array([
            this.color.red, this.color.green, this.color.blue, this.color.alpha,
            this.color.red, this.color.green, this.color.blue, this.color.alpha,
            this.color.red, this.color.green, this.color.blue, this.color.alpha,
            this.color.red, this.color.green, this.color.blue, this.color.alpha
        ]);

        // Creating colorbuffer
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }

    // Binding vertexbuffer, buffer and drawing the rectangle
    draw(shaderInfo, elapsed, modelMatrix = new Matrix4()) {
        const gl = this.app.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}