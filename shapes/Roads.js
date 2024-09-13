export class Roads {
    // Constructor for the Roads class, which initializes the road's start and end points, width, and color
    constructor(app, start, end, width, color) {
        this.app = app;
        this.vertices = calculateRoadVertices(start, end, width);
        this.color = color;
        this.initBuffers();
    }
    // Initializes the vertex buffer for the road
    initBuffers() {
        const { gl } = this.app;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        const vertexData = [];
        this.vertices.forEach(vertex => {
            vertexData.push(vertex.x, vertex.y, vertex.z);
        });

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    }

    // Draws the road onto the canvas. Also includes color setup and binding.
    draw(shaderInfo, elapsed) {
        const { gl } = this.app;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

        const roadColor = [this.color.red, this.color.green, this.color.blue, this.color.alpha];
        const colors = new Float32Array(roadColor.concat(roadColor, roadColor, roadColor));

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

        gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length);
    }
}

// Adding a helper function to calculate the road vertices:
function calculateRoadVertices (start, end, width) {
    const dx = end.x - start.x;
    const dz = end.z - start.z;

    const length  =  Math.sqrt(dx * dx + dz * dz);
    const offsetX =  (dz / length) * (width / 2);
    const offsetZ = -(dx / length) * (width / 2);

    // The y-coordinate is fixed, so the road lies on top of the XZ-plane.
    const vertices = [
        {
            x: start.x - offsetX,
            y: -9,
            z: start.z - offsetZ,
        },
        {
            x: start.x + offsetX,
            y: -9,
            z: start.z + offsetZ,
        },
        {
            x: end.x - offsetX,
            y: -9,
            z: end.z - offsetZ,
        },
        {
            x: end.x + offsetX,
            y: -9,
            z: end.z + offsetZ,
        }
    ];

    return vertices;
}