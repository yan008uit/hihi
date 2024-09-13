'use strict';
import { BaseShape } from './BaseShape.js';
import { Matrix4 } from '../lib/cuon-matrix.js';
// This roof type also extends the BaseShape-class.
export class TriangularPrismRoof extends BaseShape {
    constructor(app, color = { red: 0.8, green: 0.0, blue: 0.6, alpha: 1 }, size = 2) {
        super(app);

        // Initialize buffers after setting positions, size and colors
        this.color = { ...color };
        this.size = size;
        this.setPositions();
        this.initBuffers();
    }

    setPositions() {
        const halfSize = this.size / 2;
        const height = this.size - 3;

        // Define the vertices for a triangular prism roof
        this.positions = [
            // Front face (triangle)
            -halfSize, 0, halfSize,   // Bottom-left
             halfSize, 0, halfSize,    // Bottom-right
            0, height, 0,             // Top-center

            // Back face (triangle)
            -halfSize, 0, -halfSize,  // Bottom-left
             halfSize, 0, -halfSize,   // Bottom-right
            0, height, 0,             // Top-center

            // Left face (rectangle)
            -halfSize, 0, halfSize,   // Bottom-front
            -halfSize, 0, -halfSize,  // Bottom-back
            0, height, 0,             // Top-center

            // Right face (rectangle)
            halfSize, 0, halfSize,    // Bottom-front
            halfSize, 0, -halfSize,   // Bottom-back
            0, height, 0,             // Top-center

            // Bottom face (rectangle connecting base)
            -halfSize, 0, halfSize,   // Bottom-front-left
             halfSize, 0, halfSize,    // Bottom-front-right
            -halfSize, 0, -halfSize,  // Bottom-back-left
             halfSize, 0, halfSize,    // Bottom-front-right
             halfSize, 0, -halfSize,   // Bottom-back-right
            -halfSize, 0, -halfSize,  // Bottom-back-left
        ];

        this.vertexCount = this.positions.length / 3;

        // Apply colors for each vertex
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