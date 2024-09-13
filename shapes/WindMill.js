'use strict';
import { Cylinder } from './Cylinder.js';
import { Matrix4 } from '../lib/cuon-matrix.js';

export class WindMill {
    constructor(app, position = { x: 0, y: 0, z: 0 }, height = 32, radius = 2, bladeLength = 20, color = { red: 0.6, green: 0.4, blue: 0.2, alpha: 1 }, speed = 90) {
        this.app = app;
        this.gl = app.gl;
        this.position = position;
        this.height = height;
        this.radius = radius;
        this.bladeLength = bladeLength;
        this.color = color;
        this.speed = speed; // Initialize the speed property

        // Create a cylindrical tower
        this.tower = new Cylinder(app, this.height, this.radius, 36, this.color);

        // Initialize the blades
        this.blades = this.createBlades();

        // Initial rotation angle for the windmill blades
        this.bladeRotationAngle = 0;
    }


    // Function to create the blades of the windmill
    createBlades() {
        const blades = [];
        const motorBladeWidth = 1.7;
        const motorBladeHeight = 3;
        const normalBladeWidth = 1;  // Standard width for other blades
        const normalBladeHeight = this.bladeLength;

        // Define positions for 3 blades
        const bladePositions = [
            { x: 0, y: -2, z: 4.3 },  // Blade 0 (motor)
            { x: 0, y: -2, z: 6.7 },  // Blade 1
            { x: 0, y: -2, z: 7 }   // Blade 2
        ];

        // Create 3 blades with different sizes
        blades.push({
            blade: new Cylinder(this.app, motorBladeHeight, motorBladeWidth, 4, { red: 0.3, green: 0.4, blue: 0.3, alpha: 1 }),
            position: bladePositions[0]  // Assign position for Blade 0
        });
        for (let i = 1; i < 3; i++) {
            blades.push({
                blade: new Cylinder(this.app, normalBladeHeight, normalBladeWidth, 4, { red: 0.3, green: 0.4, blue: 0.3, alpha: 1 }),
                position: bladePositions[i]  // Assign position for each of the other blades
            });
        }

        return blades;
    }

    // Function to update the position of the blades based on rotation angle
    updateBladePositions(elapsed) {
        this.bladeRotationAngle += this.speed * elapsed;
        if (this.bladeRotationAngle >= 360) {
            this.bladeRotationAngle -= 360;
        }
    }
  
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    // Function to draw the windmill
    draw(shaderInfo, elapsed) {
        const modelMatrix = new Matrix4();
        modelMatrix.setIdentity();
        modelMatrix.translate(this.position.x, this.position.y, this.position.z);

        // Draw the tower
        this.tower.draw(shaderInfo, elapsed, modelMatrix);

        // Update blade positions
        this.updateBladePositions(elapsed);

        // Create a new matrix to apply to the blades
        const bladeMatrix = new Matrix4();

        // Draw each blade
        for (let i = 0; i < this.blades.length; i++) {
            // Start with the identity matrix for each blade
            bladeMatrix.setIdentity();

            // Move the blade to the correct position
            bladeMatrix.translate(
                this.position.x + this.blades[i].position.x,
                this.position.y + this.height / 2 + this.blades[i].position.y,
                this.position.z + this.blades[i].position.z
            );

            // Apply rotation to the blades
            if (i === 0) {
                // Blade 0 stays stationary
                bladeMatrix.rotate(90, 1, 0, 0); // Rotate Blade 0 to be horizontal
            } else {
                // For other blades, apply spinning rotation
                bladeMatrix.rotate(this.bladeRotationAngle, 0, 0, 1); // Spin around the z-axis
                if (i === 2) {
                    bladeMatrix.rotate(90, 0, 0, 1); // Rotate Blade 2 to be horizontal
                }
            }

            // Draw the current blade
            this.blades[i].blade.draw(shaderInfo, elapsed, bladeMatrix);
        }
    }
}
