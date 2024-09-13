import {rotateVector} from "../utils/WebGLUtils.js";
import { Matrix4 } from '../lib/cuon-matrix.js';

export class Camera {
    constructor(
        gl,
        currentlyPressedKeys = [],
        camPosX = 5,
        camPosY = 20,
        camPosZ = 35,

        lookAtX = 0,
        lookAtY = 0,
        lookAtZ = 0,

        upX = 0,
        upY = 1,
        upZ = 0,
    ) {
       this.gl = gl;
       this.currentlyPressedKeys = currentlyPressedKeys;

       this.camPosX = camPosX;
       this.camPosY = camPosY;
       this.camPosZ = camPosZ;

       this.lookAtX = lookAtX;
       this.lookAtY = lookAtY;
       this.lookAtZ = lookAtZ;

       this.upX = upX;
       this.upY = upY;
       this.upZ = upZ;

       this.near = 0.1;
       this.far = 10000;

       this.viewMatrix = new Matrix4();
       this.projectionMatrix = new Matrix4();
    }
    set() {
        this.viewMatrix.setLookAt(
            this.camPosX, this.camPosY, this.camPosZ,
            this.lookAtX, this.lookAtY, this.lookAtZ,
            this.upX, this.upY, this.upZ
        );

        const fieldOfView = 45;
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

        this.projectionMatrix.setPerspective(fieldOfView, aspect, this.near, this.far);
    }

    getModelViewMatrix(modelMatrix) {
        return new Matrix4(this.viewMatrix.multiply(modelMatrix));
    }

    setPosition(posX, posY, posZ) {
        this.camPosX = posX;
        this.camPosY = posY;
        this.camPosZ = posZ;
    }

    setLookAt(lookX, lookY, lookZ) {
        this.lookX = lookX;
        this.lookY = lookY;
        this.lookZ = lookZ;
    }

    setUp(upX, upY, upZ) {
        this.upX = upX;
        this.upY = upY;
        this.upZ = upZ;
    }

    setNear(near) {
        this.near = near;
    }

    setFar(far) {
        this.far = far;
    }

    handleKeys(elapsed){
        let camPosVec = vec3.fromValues(this.camPosX, this.camPosY, this.camPosZ);

        if (this.currentlyPressedKeys['KeyA']) {
            rotateVector(2, camPosVec, 0, 1, 0);
        }

        if (this.currentlyPressedKeys['KeyW']) {
            rotateVector(2, camPosVec, 1, 0, 0);
        }

        if (this.currentlyPressedKeys['KeyD']) {
            rotateVector(-2, camPosVec, 0, 1, 0);
        }

        if (this.currentlyPressedKeys['KeyS']) {
            rotateVector(-2, camPosVec, 1, 0, 0);
        }

        if (this.currentlyPressedKeys['KeyV']) {
            vec3.scale(camPosVec, camPosVec, 1.05);
        }

        if (this.currentlyPressedKeys['KeyB']) {
            vec3.scale(camPosVec, camPosVec, 0.95);
        }

        this.camPosX = camPosVec[0];
        this.camPosY = camPosVec[1];
        this.camPosZ = camPosVec[2];
    }

    toString() {
        return 'x:' + String(this.camPosX.toFixed(1)) + ', y' + String(this.camPosY.toFixed(1)) + ', z:' + String(this.camPosZ.toFixed(1))
        //return "Position:" + String(this.camPosX.toFixed(1)) + ', ' + String(this.camPosY.toFixed(1)) + ', ' + String(this.camPosZ.toFixed(1)) +
        //    ", LookAt:" + String(this.lookAtX.toFixed(1)) + ', ' + String(this.lookAtY.toFixed(1)) + ', ' + String(this.lookAtZ.toFixed(1));
    }
}