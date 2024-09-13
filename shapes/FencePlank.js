'use strict';
import { BaseShape } from './BaseShape.js';
import { Matrix4 } from '../lib/cuon-matrix.js';

export class FencePlank extends BaseShape {
    constructor(app, color = {red: 0.6, green: 0.3, blue: 0.1, alpha: 1}, width = 1, height = 0.1, depth = 0.1) {
        super(app);
        this.color = color;
        this.width = width;
        this.height = height;
        this.depth = depth;

        // Initialize vertices, colors, and afterward buffers
        this.setPositions();
        this.setColors();
        this.initBuffers();
    }

    setPositions() {
        const w = this.width;
        const h = this.height;
        const d = this.depth;

        this.positions = [
            // Front
            -w,  h, d,
            -w, -h, d,
             w, -h, d,
             w, -h, d,
             w,  h, d,
            -w,  h, d,

            // Back
            -w,  h, -d,
            -w, -h, -d,
             w, -h, -d,
             w, -h, -d,
             w,  h, -d,
            -w,  h, -d,

            // Top
            -w, h, -d,
            -w, h,  d,
             w, h,  d,
             w, h,  d,
             w, h, -d,
            -w, h, -d,

            // Bottom
            -w, -h, -d,
            -w, -h,  d,
             w, -h,  d,
             w, -h,  d,
             w, -h, -d,
            -w, -h, -d,

            // Right
            w,  h, -d,
            w, -h, -d,
            w, -h,  d,
            w, -h,  d,
            w,  h,  d,
            w,  h, -d,

            // Left
            -w,  h, -d,
            -w, -h, -d,
            -w, -h,  d,
            -w, -h,  d,
            -w,  h,  d,
            -w,  h, -d,
        ];
        this.vertexCount = this.positions.length / 3;
    }

    setColors() {
        this.colors = [];
        for (let i = 0; i < this.vertexCount; i++) {
            this.colors.push(this.color.red, this.color.green, this.color.blue, this.color.alpha);
        }
    }

    initBuffers() {
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
    }

    draw(shaderInfo, elapsed, modelMatrix = new Matrix4()) {
        // Bind and enable position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

        // Bind and enable color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);

        // Draw the fence plank
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }
}