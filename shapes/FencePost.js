'use strict';
import { Cylinder } from './Cylinder.js';

// Fencepost extends the cylinder class used for windmill base.
export class FencePost extends Cylinder {
    constructor(app, color = { red: 0.6, green: 0.3, blue: 0.1, alpha: 1 }, height = 3, radius = 0.3, segments = 32) {
        super(app, height, radius, segments, color);
    }

    initBuffers() {
        // Use the initBuffers method from the Cylinder class to set up the buffers
        super.initBuffers();
    }

    draw(shaderInfo, elapsed, modelMatrix = new Matrix4()) {
        // Call the base draw method from Cylinder class
        super.draw(shaderInfo, elapsed, modelMatrix);
    }
}