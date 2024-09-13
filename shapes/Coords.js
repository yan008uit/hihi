'use strict';
import {BaseShape} from './BaseShape.js';
import { Matrix4 } from '../lib/cuon-matrix.js';
export class Coord extends BaseShape {

    constructor(app) {
        super(app);
        this.COORD_BOUNDARY = 1000;
    }

    createVertices() {
        // Setting positions for the x-, y- and z-axis:
        this.positions = [

            -this.COORD_BOUNDARY, 0.0, 0.0,
             this.COORD_BOUNDARY, 0.0, 0.0,

            0.0, this.COORD_BOUNDARY, 0.0,
            0.0, -this.COORD_BOUNDARY, 0.0,

            0.0, 0.0, this.COORD_BOUNDARY,
            0.0, 0.0, -this.COORD_BOUNDARY
        ];

        // Setting colors
        this.colors = [

            1.0, 0.0, 0.0, 1,
            1.0, 0.0, 0.0, 1,

            0.0, 1.0, 0.0, 1,
            0.0, 1.0, 0.0, 1,

            0.0, 0.0, 1.0, 1,
            0.0, 0.0, 1.0, 1
        ];

        super.createVertices();
    }

    draw(shaderInfo, elapsed, modelMatrix = new Matrix4()) {
        modelMatrix.setIdentity();
        super.draw(shaderInfo, elapsed, modelMatrix);
        this.gl.drawArrays(this.gl.LINES, 0, this.vertexCount);
    }
}