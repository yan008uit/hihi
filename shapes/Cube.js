'use strict';
import { BaseShape } from './BaseShape.js';
import { Matrix4 } from '../lib/cuon-matrix.js';

export class Cube extends BaseShape {
    constructor(app, color =
        {red: 0.8, green: 0.0, blue: 0.6, alpha: 1 }, wireFrame = false, size = 3) {
        super(app);
        this.color = color;
        this.wireFrame = wireFrame;
        this.size = size;

        // Initialize buffers after setting positions and colors
        this.setPositions();
        this.setColors();
        this.initBuffers();
    }

    setPositions() {
        const s = this.size; // Use the provided size

        this.positions = [
            // Front
            -s,  s,  s,
            -s, -s,  s,
             s, -s,  s,
             s, -s,  s,
             s,  s,  s,
            -s,  s,  s,

            // Back
            -s,  s, -s,
            -s, -s, -s,
             s, -s, -s,
             s, -s, -s,
             s,  s, -s,
            -s,  s, -s,

            // Top
            -s,  s, -s,
            -s,  s,  s,
             s,  s,  s,
             s,  s,  s,
             s,  s, -s,
            -s,  s, -s,

            // Bottom
            -s, -s, -s,
            -s, -s,  s,
             s, -s,  s,
             s, -s,  s,
             s, -s, -s,
            -s, -s, -s,

            // Right
            s,  s, -s,
            s, -s, -s,
            s, -s,  s,
            s, -s,  s,
            s,  s,  s,
            s,  s, -s,

            // Left
            -s,  s, -s,
            -s, -s, -s,
            -s, -s,  s,
            -s, -s,  s,
            -s,  s,  s,
            -s,  s, -s,
        ];
        this.vertexCount = this.positions.length / 3;
    }

    setColors() {
        // Setting same color for all sides and initializing color-array
        this.colors = [];

        for (let i = 0; i < this.vertexCount; i++) {
            this.colors.push(this.color.red, this.color.green, this.color.blue, this.color.alpha);
        }
    }

    initBuffers() {
        // Vertex positions buffer
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

        // Vertex colors buffer
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
    }

    draw(shaderInfo, elapsed, modelMatrix = new Matrix4()) {
        super.draw(shaderInfo, elapsed, modelMatrix);

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

        // Bind color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);

        // Draw the shape
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }
}