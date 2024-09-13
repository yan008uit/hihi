'use strict';
import { BaseShape } from './BaseShape.js';
import { Matrix4 } from '../lib/cuon-matrix.js';

export class FlatRoof extends BaseShape {
    constructor(app, color = {red: 0.8, green: 0.8, blue: 0.8, alpha: 1}, size = 2) {
        super(app);
        this.color = { ...color }; // Create a copy of the color object to avoid shared references
        this.size = size;

        // Set positions, colors, and initialize buffers after
        this.setPositions();
        this.setColors();
        this.initBuffers();
    }

    setPositions() {
        const halfSize = this.size / 2;

        this.positions = [
            -halfSize, 0, -halfSize, // Bottom left
             halfSize, 0, -halfSize, // Bottom right
             halfSize, 0,  halfSize, // Top right

            -halfSize, 0, -halfSize, // Bottom left
             halfSize, 0,  halfSize, // Top right
            -halfSize, 0,  halfSize  // Top left
        ];

        this.vertexCount = this.positions.length / 3;
    }

    setColors() {
        // Setting color for each vertex
        this.colors = new Array(this.vertexCount * 4).fill(0);
        for (let i = 0; i < this.vertexCount; i++) {
            this.colors[i * 4] = this.color.red;
            this.colors[i * 4 + 1] = this.color.green;
            this.colors[i * 4 + 2] = this.color.blue;
            this.colors[i * 4 + 3] = this.color.alpha;
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