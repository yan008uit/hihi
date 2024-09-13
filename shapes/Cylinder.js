'use strict';
import { BaseShape } from './BaseShape.js';
import { Matrix4 } from '../lib/cuon-matrix.js';

export class Cylinder extends BaseShape {
    constructor(app, height = 5, radius = 1, segments = 36, color = { red: 0.5, green: 0.5, blue: 0.5, alpha: 1 }) {
        super(app);
        this.height = height;
        this.radius = radius;
        this.segments = segments;
        this.color = { ...color };
        this.positions = [];
        this.colors = [];

        // Initialize vertices, colors, and afterward buffers
        this.createVertices();
        this.initBuffers();
    }

    createVertices() {
        const angleStep = (2 * Math.PI) / this.segments;
        const halfHeight = this.height / 2;

        // Create vertices for the cylinder
        for (let i = 0; i <= this.segments; i++) {
            const angle = i * angleStep;

            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;

            this.positions.push(x, -halfHeight, z); // Bottom circle
            this.positions.push(x,  halfHeight, z);  // Top circle
        }

        for (let i = 0; i <= this.segments; i++) {
            const angle = i * angleStep;

            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;

            this.positions.push(x, -halfHeight, z);
            this.positions.push(x,  halfHeight, z);
        }

        // Center vertices for the top and bottom caps
        this.positions.push(0, -halfHeight, 0);
        this.positions.push(0,  halfHeight, 0);

        for (let i = 0; i <= this.segments; i++) {
            const angle = i * angleStep;

            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            this.positions.push(x, -halfHeight, z); // Bottom circle
        }

        for (let i = 0; i <= this.segments; i++) {
            const angle = i * angleStep;

            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            this.positions.push(x, halfHeight, z);  // Top circle
        }

        // Calculate the number of vertices
        this.vertexCount = this.positions.length / 3;

        // Set colors for each vertex
        this.setColors();
    }

    setColors() {
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
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, (this.segments + 1) * 2);  // Sides
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, (this.segments + 1) * 2, this.segments + 2);  // Bottom cap
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, (this.segments + 1) * 3 + 2, this.segments + 2);  // Top cap
    }
}

