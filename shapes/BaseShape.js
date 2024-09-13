'use strict';
export class BaseShape {

    constructor(app) {
        this.app = app;
        this.gl = app.gl;
        this.camera = app.camera;

        this.vertexCount = 0;

        // Vertex info arrays:
        this.positions = [];
        this.colors = [];
        this.textureCoordinates = [];

        // Referance to buffers:
        this.buffers = {
            position: undefined,
            color: undefined,
            texture: undefined
        };

        this.numComponents = -1;
        this.type = this.gl.FLOAT;
        this.normalize = false;
        this.stride = 0;
        this.offset = 0;
    }

    initBuffers() {
        this.createVertices();

        // Positions:
        if (this.positions.length > 0) {
            this.buffers.position = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
        }

        // Color:
        if (this.colors.length > 0) {
            this.buffers.color = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }

        this.initTextures();

        this.vertexCount = this.positions.length/3;
    }

    initTextures() {
    }

    createVertices() {
        this.setPositions();
        this.setColors();
        this.setTextureCoordinates();
    }

    setPositions() {
        this.positions = [];
    }

    setColors() {
        this.colors = [];
    }

    setTextureCoordinates() {
        this.textureCoordinates = [];
    }

    connectPositionAttribute(shaderInfo) {
        if (this.buffers.position === undefined)
            return;

        this.numComponents = 3;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.vertexAttribPointer(
            shaderInfo.attribLocations.vertexPosition,
            this.numComponents,
            this.type,
            this.normalize,
            this.stride,
            this.offset);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);
    }

    connectColorAttribute(shaderInfo) {
        if (this.buffers.color === undefined || shaderInfo.attribLocations.vertexColor === undefined)
            return;

        this.numComponents = 4;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.vertexAttribPointer(
            shaderInfo.attribLocations.vertexColor,
            this.numComponents,
            this.type,
            this.normalize,
            this.stride,
            this.offset);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);
    }

    connectTextureAttribute(shaderInfo) {
        if (this.buffers.texture === undefined || shaderInfo.attribLocations.vertexTextureCoordinate === undefined)
            return;

        this.numComponents = 2;    //NB!
        //Bind til teksturkoordinatparameter i shader:
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texture);
        this.gl.vertexAttribPointer(
            shaderInfo.attribLocations.vertexTextureCoordinate,
            this.numComponents,
            this.type,
            this.normalize,
            this.stride,
            this.offset);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexTextureCoordinate);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rectangleTexture);
        let samplerLoc = this.gl.getUniformLocation(shaderInfo.program, shaderInfo.uniformLocations.sampler);
        this.gl.uniform1i(samplerLoc, 0);

    }

    setCameraMatrices(shaderInfo, modelMatrix) {
        this.camera.set();  //NB!
        let modelviewMatrix = this.camera.getModelViewMatrix(modelMatrix);
        if (shaderInfo.uniformLocations.modelViewMatrix)
            this.gl.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
        if (shaderInfo.uniformLocations.projectionMatrix)
            this.gl.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, this.camera.projectionMatrix.elements);
    }

    draw(shaderInfo, elapsed, modelMatrix) {
        if  (!shaderInfo)
            return;
        this.gl.useProgram(shaderInfo.program);

        this.connectPositionAttribute(shaderInfo);
        this.connectColorAttribute(shaderInfo);
        this.connectTextureAttribute(shaderInfo);

        this.setCameraMatrices(shaderInfo, modelMatrix);
    }
}