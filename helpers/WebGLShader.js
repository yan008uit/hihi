export class WebGLShader {
    constructor(gl, vsSource, fsSource) {
        this.gl = gl;
        this.shaderProgram = null;

        const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Only proceed if both shaders are successfully compiled
        if (vertexShader && fragmentShader) {
            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, vertexShader);
            gl.attachShader(this.shaderProgram, fragmentShader);
            gl.linkProgram(this.shaderProgram);

            // Check if the shader program linked correctly
            if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
                console.error("Unable to initialize the shader program:", gl.getProgramInfoLog(this.shaderProgram));
                gl.deleteProgram(this.shaderProgram);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                return null;
            }
        }
    }

    compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        // Check if shader compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`An error occurred when compiling the ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:`, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}