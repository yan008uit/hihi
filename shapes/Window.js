'use strict';
import { Cube } from './Cube.js';


export class Window extends Cube {
    constructor(app, color = { red: 0.6, green: 0.8, blue: 1.0, alpha: 0.5 }, width = 0.5, height = 0.5, depth = 0.1) {
        super(app, color, false, width); // Use width for the base size

        // Initializes buffers after setting width, height, depth, positions and colors
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.setPositions();
        this.setColors();
        this.initBuffers();
    }

    setPositions() {
        const w = this.width;
        const h = this.height;
        const d = this.depth;

        // Setting positions the windows
        this.positions = [
            // Front
            -w,  h,  d,
            -w, -h,  d,
             w, -h,  d,
             w, -h,  d,
             w,  h,  d,
            -w,  h,  d,

            // Back
            -w,  h, -d,
            -w, -h, -d,
             w, -h, -d,
             w, -h, -d,
             w,  h, -d,
            -w,  h, -d,

            // Top
            -w,  h, -d,
            -w,  h,  d,
             w,  h,  d,
             w,  h,  d,
             w,  h, -d,
            -w,  h, -d,

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
}