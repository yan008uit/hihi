'use strict';
import { WebGLCanvas } from "./helpers/WebGLCanvas.js";
import { WebGLShader } from "./helpers/WebGLShader.js";
import { Camera } from "./helpers/Camera.js";
import { Coord } from "./shapes/Coords.js";
import { Cube } from "./shapes/Cube.js";
import { Matrix4 } from './lib/cuon-matrix.js';
import { FlatRoof } from './shapes/FlatRoof.js';
import { ConicalRoof } from './shapes/ConicalRoof.js';
import { TriangularPrismRoof } from './shapes/TriangularPrismRoof.js';
import { Window } from './shapes/Window.js';
import { Door } from './shapes/Door.js';
import { XZPlane } from "./shapes/XZPlane.js";
import { Roads } from './shapes/Roads.js';
import { FencePost } from './shapes/FencePost.js';
import { FencePlank } from './shapes/FencePlank.js';
import { WindMill } from './shapes/WindMill.js';

export class MiniVillageApp {
    constructor(drawCoord = true) {
        // Creates a new WebGL canvas for our 3D Village and setting its dimensions
        this.canvas = new WebGLCanvas('canvas', document.body, 960, 640);
        this.gl = this.canvas.gl;
        this.drawCoord = drawCoord;

        // Initializes shaders, setting up keyboard handling and frame data to calculate FPS
        this.initShaders();
        this.initKeyPress();

        this.fpsData = {
            frameCount: 0,
            lastTimeStamp: 0
        };

        // Setting lastTime to zero to track rendering also setting up an arrray to keep track of keyboardkeys that are pressed
        this.lastTime = 0;
        this.currentlyPressedKeys = [];

        // Setting up the camera and its view
        this.camera = new Camera(this.gl, this.currentlyPressedKeys);
        this.camera.setPosition(-90, 30, 90);
        this.camera.setLookAt(9, 0, 0);
        this.camera.set();

        if (this.drawCoord) {
            this.coord = new Coord(this);
            this.coord.initBuffers();
        }

        // Initializes the wireframe XZ-plane.
        this.xzPlane = new XZPlane(this, 200,200,100);
        this.xzPlane.initBuffers()

        // Setting up roads connecting houses.
        this.roads = [
            new Roads(this, { x: 54, z:-35},{x: -147, z: -35}, 5,{ red: 0.3, green: 0.3, blue: 0.3, alpha: 1 } ), // Main road
            new Roads(this, { x: 0, z: 0 }, { x: 0, z: -35 }, 3, { red: 0.3, green: 0.3, blue: 0.3, alpha: 1 }),  // Roads 1 to main
            new Roads(this, { x: -50, z: -10 }, { x: -50, z: -35 }, 3, { red: 0.3, green: 0.3, blue: 0.3, alpha: 1 }),  // Roads 2 to main
            new Roads(this, { x: -76, z: -82 }, { x: -66, z: -35 }, 3, { red: 0.3, green: 0.3, blue: 0.3, alpha: 1 }),  // Roads 3 to main
            new Roads(this, { x: -10, z: -63 }, { x: -10, z: -35 }, 3, { red: 0.3, green: 0.3, blue: 0.3, alpha: 1 }),  // Roads 4 to main
        ];

        // Initialize houses/cubes and their fenceposts
        this.cubes = this.createHousesWithSpacing();

        // Initialize buffers for all cubes and roofs
        this.cubes.forEach((cubeObj) => {
            cubeObj.cube.initBuffers();
        });

        // Initializing fenceposts to the houses
        this.fencePosts = this.createFencePostsAndPlanksForHouses();

        // Initialize the windmill
        // Adjust the parameters to match the WindMill constructor
        this.windmill = new WindMill(this, { x: -45, y: 12.5, z: -40 }, 30, 3, 20, { red: 0.6, green: 0.4, blue: 0.9, alpha: 1 });
    }

    initShaders() {
        const vertexShaderSourceBase = `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            varying lowp vec4 vColor;
            void main(void) {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vColor = aVertexColor;
                gl_PointSize = 10.0;    // Note: Only used when drawing POINTS
            }`;

        const fragmentShaderSourceBase = `
            varying lowp vec4 vColor;
            void main(void) {
                gl_FragColor = vColor;
            }`;

        const glsBaseShader = new WebGLShader(this.gl, vertexShaderSourceBase, fragmentShaderSourceBase);
        this.baseShaderInfo = {
            program: glsBaseShader.shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(glsBaseShader.shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(glsBaseShader.shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                modelViewMatrix: this.gl.getUniformLocation(glsBaseShader.shaderProgram, 'uModelViewMatrix'),
                projectionMatrix: this.gl.getUniformLocation(glsBaseShader.shaderProgram, 'uProjectionMatrix'),
            }
        };
    }

    // Keyhandlers
    handleKeyUp(event) {
        this.currentlyPressedKeys[event.code] = false;
    }

    handleKeyDown(event) {
        this.currentlyPressedKeys[event.code] = true;
    }

    initKeyPress() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
        document.addEventListener('keyup',   this.handleKeyUp.bind(this),   false);
    }

    handleKeys(elapsed) {
        this.camera.handleKeys(elapsed);
    }

    clearCanvas() {
        this.gl.clearColor(0.9, 0.9, 0.9, 1);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    // This sections draws our MiniVillage onto the GLcanvas.
    draw(elapsed) {
        this.gl.useProgram(this.baseShaderInfo.program);

        if (this.drawCoord) {
            this.coord.draw(this.baseShaderInfo, elapsed);
        }

        const modelMatrixXZ = new Matrix4();
        modelMatrixXZ.setIdentity();
        modelMatrixXZ.translate(0, -3, 0);
        this.xzPlane.draw(this.baseShaderInfo, elapsed, modelMatrixXZ);

        // Draw cubes and roofs first
        this.cubes.forEach((cubeObj) => {
            const modelMatrix = new Matrix4();
            modelMatrix.setIdentity();
            modelMatrix.translate(cubeObj.position.x, cubeObj.position.y, cubeObj.position.z);
            cubeObj.cube.draw(this.baseShaderInfo, elapsed, modelMatrix);
        });

        // Draw roads
        this.roads.forEach((road) => {
            road.draw(this.baseShaderInfo, elapsed);
        });

        // Draw doors
        this.cubes.forEach((cubeObj) => {
            if (cubeObj.cube instanceof Door) {
                const modelMatrix = new Matrix4();
                modelMatrix.setIdentity();
                modelMatrix.translate(cubeObj.position.x, cubeObj.position.y, cubeObj.position.z);
                cubeObj.cube.draw(this.baseShaderInfo, elapsed, modelMatrix);
            }
        });

        // Draw fence posts
        this.fencePosts.forEach((fencePostObj) => {
            const modelMatrix = new Matrix4();
            modelMatrix.setIdentity();
            modelMatrix.translate(fencePostObj.position.x, fencePostObj.position.y, fencePostObj.position.z);
            fencePostObj.fencePost.draw(this.baseShaderInfo, elapsed, modelMatrix);
        });

        // Draw fence planks last
        this.fencePlanks.forEach((fencePlankObj) => {
            const modelMatrix = new Matrix4();
            modelMatrix.setIdentity();
            modelMatrix.translate(fencePlankObj.position.x, fencePlankObj.position.y, fencePlankObj.position.z);
            modelMatrix.rotate(fencePlankObj.angle * (180 / Math.PI), 0, 1, 0); // Rotate to the correct angle
            fencePlankObj.fencePlank.draw(this.baseShaderInfo, elapsed, modelMatrix);
        });

        // Draw the windmill
        this.windmill.draw(this.baseShaderInfo, elapsed);
    }

    setWindmillSpeed(newSpeed) {
        if (this.windmill) {
            this.windmill.speed = newSpeed;
        }
    }

    animate(currentTime) {
        window.requestAnimationFrame(this.animate.bind(this));
        let elapsed = this.calculateFps(currentTime);
        this.clearCanvas();
        this.handleKeys(elapsed);

        // Update windmill rotation based on speed
        if (this.windmill) {
            this.windmill.updateBladePositions(elapsed); // Implement updateRotation in WindMill class
        }

        this.draw(elapsed);
        this.fpsData.frameCount++;
    }

    setWindmillSpeed(speed) {
        this.windmill.setSpeed(speed);
    }

    calculateFps(currentTime) {
        if (currentTime == undefined) {
            currentTime = 0;
        }

        if (currentTime - this.fpsData.lastTimeStamp >= 1000) {
            document.getElementById("fps").innerHTML = this.fpsData.frameCount;
            this.fpsData.frameCount = 0;
            this.fpsData.lastTimeStamp = currentTime;
        }

        let elapsed = 0.0;
        if (this.lastTime !== 0.0) {
            elapsed = (currentTime - this.lastTime) / 1000;
        }
        this.lastTime = currentTime;

        return elapsed;
    }

    // Creating the cubes/houses
    createHouse(
        baseColor, roofColor, basePosition, heights, windowPositions = [],
        doorPositions = [],
        roofType = 'triangularPrism') {
        const house = [];
        const numCubes = heights.length;
        const cubeSize = 3; // Size of each cube

        // Create the base of the house using cubes
        for (let i = 0; i < numCubes; i++) {
            const height = heights[i];
            for (let j = 0; j < height; j++) {
                house.push({
                    cube: new Cube(this, { ...baseColor }),
                    position: {
                        x: basePosition.x + i * cubeSize,
                        y: basePosition.y + j * cubeSize,
                        z: basePosition.z
                    }
                });
            }
        }

        // Create windows for the house
        const windowSize = 0.7; // Adjust window size as needed
        windowPositions.forEach(windowPosition => {
            house.push({
                cube: new Window(this, { red: 0.83, green: 0.83, blue: 0.83, alpha: 0.8 }, windowSize, windowSize, 0.1),
                position: windowPosition
            });
        });

        // Create doors for the house
        const doorWidth = 1.0;
        const doorHeight = 1.7;
        const doorDepth = 0.1;
        doorPositions.forEach(doorPosition => {
            house.push({
                cube: new Door(this, { red: 0.6, green: 0.3, blue: 0.1, alpha: 1 }, doorWidth, doorHeight, doorDepth),
                position: doorPosition
            });
        });

        const maxHeight = Math.max(...heights) * cubeSize;

        let roof;
        switch (roofType) {
            case 'triangularPrism':
                roof = new TriangularPrismRoof(this, { ...roofColor }, 9);
                house.push({
                    cube: roof,
                    position: {
                        x: basePosition.x + (numCubes - 1) * cubeSize / 2, // Center the roof horizontally over the house base
                        y: basePosition.y + maxHeight,
                        z: basePosition.z
                    }
                });
                break;
            case 'conical':
                roof = new ConicalRoof(this, { ...roofColor }, 5, 36);
                house.push({
                    cube: roof,
                    position: {
                        x: basePosition.x + (numCubes + 1) * cubeSize / 2, // Center the roof horizontally over the house base
                        y: basePosition.y + maxHeight,
                        z: basePosition.z
                    }
                });
                break;
            case 'flat':
                roof = new FlatRoof(this, { ...roofColor }, numCubes * cubeSize);
                house.push({
                    cube: roof,
                    position: {
                        x: basePosition.x + (numCubes - 3) * cubeSize / 2, // Center the flat roof horizontally over the house base
                        y: basePosition.y + maxHeight + 0.2,
                        z: basePosition.z
                    }
                });
                break;
            default:
                throw new Error('Unknown roof type');
        }

        return house;
    }

    // Creating fenceposts for the houses
    createFencePostsAndPlanksForHouses() {
        const fencePosts = [];
        const fencePlanks = [];

        const houseFenceOffsets = [
            { x: -7,  z: 3.5 },
            { x: 33,  z: -50 },
            { x: -28, z: -70 },
            { x: 47,  z: 13 },
        ];

        const fencePostSpacing = 10;
        const postCount = 20;

        houseFenceOffsets.forEach((housePos) => {
            let previousPost = null;

            for (let i = 0; i < postCount; i++) {
                const angle = (i / postCount) * 2 * Math.PI;
                const xOffset = Math.cos(angle) * fencePostSpacing;
                const zOffset = Math.sin(angle) * fencePostSpacing;

                const postPosition = {
                    x: housePos.x + xOffset,
                    y: -1,
                    z: housePos.z + zOffset
                };

                const currentPost = {
                    fencePost: new FencePost(this),
                    position: postPosition
                };

                fencePosts.push(currentPost);

                // Draw fence plank only if there was a previous post
                if (previousPost) {
                    const dx = currentPost.position.x - previousPost.position.x;
                    const dz = currentPost.position.z - previousPost.position.z;
                    const distance = Math.sqrt(dx * dx + dz * dz);

                    const plankWidth = 0.2;
                    const plankHeight = 1;
                    const plankDepth = distance;

                    const wireMidpoint = {
                        x: (currentPost.position.x + previousPost.position.x) / 2,
                        y: (currentPost.position.y + previousPost.position.y) / 2,
                        z: (currentPost.position.z + previousPost.position.z) / 2,
                    };

                    const angle = Math.atan2(dz, dx);

                    fencePlanks.push({
                        fencePlank: new FencePlank(this, { red: 0.6, green: 0.3, blue: 0.1, alpha: 1 }, plankWidth, plankHeight, plankDepth),
                        position: wireMidpoint,
                        angle: angle
                    });
                }

                previousPost = currentPost;
            }
        });

        this.fencePlanks = fencePlanks;
        return fencePosts;
    }

    createHousesWithSpacing() {
        const houses = [];
        const baseColors = [
            { red: 0.98, green: 0.78, blue: 0.82, alpha: 1 },  // Baby Pink
            { red: 0.68, green: 0.85, blue: 0.44, alpha: 1 },  // Pastel Green
            { red: 0.96, green: 0.98, blue: 0.60, alpha: 1 },  // Pastel Yellow
            { red: 0.68, green: 0.85, blue: 0.90, alpha: 1 }   // Light Blue
        ];

        const roofColors = [
            { red: 0.50, green: 0.00, blue: 0.00, alpha: 1 },  // Burgundy
            { red: 1.00, green: 0.70, blue: 0.50, alpha: 1 },  // Pastel Orange
            { red: 0.60, green: 0.40, blue: 0.20, alpha: 1 },  // Brown
            { red: 1.00, green: 0.75, blue: 0.80, alpha: 1 }   // Pink
        ];

        // Positions, heights, window, and door positions for the houses
        const positions = [
            { x: -10, y: 0, z: 3 },   // House 1
            { x: 30, y: 0, z: -50 },  // House 2
            { x: -30, y: 0, z: -70 }, // House 3
            { x: 46, y: 0, z: 13 }    // House 4
        ];
        const heights = [
            [3, 2, 2], // Heights for House 1
            [1, 1, 2], // Heights for House 2
            [1, 1],    // Heights for House 3
            [2]        // Heights for House 4
        ];
        const windowPositions = [
            [   // Two window positions for House 1
                { x: -10, y: 5, z: 6 },
                { x: -4, y: 2, z: 6 }
            ],
            { x: 30, y: 0.5, z: -47 },  // Window position for House 2
            [   // Two window positions for House 3
                { x: -26, y: 0.5, z: -67 },
                { x: -31, y: 0.5, z: -67 }
            ],
            [   // Two window positions for House 4
                { x: 44.5, y: 3, z: 16 },
                { x: 47.5, y: 3, z: 16 }
            ]
        ];
        const doorPositions = [
            { x: -10, y: -1.2, z: 6.5 },    // Door positions for House 1
            { x: 36, y: -1.2, z: -47 },  // Door position for House 2
            { x: -28.5, y: -1.2, z: -67 }, // Door positions for House 3
            { x: 46, y: -1.2, z: 16 }   // Door position for House 4
        ];

        // Create houses with different roof colors, types, and window/door positions
        houses.push(...this.createHouse(baseColors[2], roofColors[0], positions[0], heights[0], windowPositions[0], [doorPositions[0]], 'flat')); // House 1 with Flat Roof
        houses.push(...this.createHouse(baseColors[1], roofColors[3], positions[1], heights[1],[windowPositions[1]], [doorPositions[1]], 'conical')); // House 2 with Conical Roof
        houses.push(...this.createHouse(baseColors[0], roofColors[2], positions[2], heights[2], windowPositions[2], [doorPositions[2]], 'triangularPrism')); // House 3 with Triangular Prism Roof
        houses.push(...this.createHouse(baseColors[3], roofColors[1], positions[3], heights[3], windowPositions[3], [doorPositions[3]], 'triangularPrism')); // House 4 with Triangular Prism Roof

        return houses;
    }

}
