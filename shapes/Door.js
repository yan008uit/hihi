'use strict';
import { Cube } from './Cube.js';

/**
 * Set positions and colors for a thin rectangular prism.
 * Suitable for representing doors.
 */
export class Door extends Cube {
    constructor(app, color = { red: 0.6, green: 0.4, blue: 0.2, alpha: 1.0 }, width = 0.6, height = 1.0, depth = 0.05) {
        super(app, color, false, width); // Use width for the base size
        this.width = width;
        this.height = height;
        this.depth = depth;

        // Initialize buffers after setting positions and colors
        this.setPositions();
        this.setColors();
        this.initBuffers();
    }

    setPositions() {
        const w = this.width;
        const h = this.height;
        const d = this.depth;

        // Define positions for a thin rectangular prism, that is the most similar to a door
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