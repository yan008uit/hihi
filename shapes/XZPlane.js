'use strict';

import {BaseShape} from './BaseShape.js';
// XZ-plane extends BaseShape.
export class XZPlane extends BaseShape {
    // Constructor that set height, width, gridsize.
    constructor(app, width= 200, height= 200, gridSize= 100) {
        super(app);
        this.gl = this.app.gl;

        this.width = width;
        this.height = height;
        this.gridSize = gridSize;
    }

    // Creating Vertices for the plane
    createVertices() {
        super.createVertices();

        let width = this.width;
        let height = this.height;
        let gridSize = this.gridSize;

        let xStep = width / gridSize;
        let zStep = height / gridSize;

        this.positions = [];
        this.colors = [];

        // Loop through and create the grid of smaller rectangles
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let x = -width / 2 + i * xStep;
                let z = -height / 2 + j * zStep;

                // Create a wireframe rectangle using line segments
                this.positions.push(
                    x, 0, z,           // Bottom-left
                    x + xStep, 0, z,   // Bottom-right
                    x + xStep, 0, z,   // Bottom-right
                    x + xStep, 0, z + zStep, // Top-right
                    x + xStep, 0, z + zStep, // Top-right
                    x, 0, z + zStep,   // Top-left
                    x, 0, z + zStep,   // Top-left
                    x, 0, z            // Bottom-left
                );

                for (let k = 0; k < 8; k++) {
                    this.colors.push(0.3, 0.5, 0.2, 1); // Greenish color
                }
            }
        }

        this.vertexCount = this.positions.length / 3;
    }

    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);
        this.gl.drawArrays(this.gl.LINES, 0, this.vertexCount);
    }
}

