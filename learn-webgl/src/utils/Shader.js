export default class Shader {
    constructor (vshader, fshader) {
        this.vshaderSource = vshader;
        this.fshaderSource = fshader;
    }
    setGl (gl) {
        this.gl = gl;
    }
    loadShader (type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error('Failed to create shder');
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error('Failed to compile shader' + error);
        }
        return shader;
    }
    createProgram () {
        const gl = this.gl;
        const vShader = this.loadShader(gl.VERTEX_SHADER, this.vshaderSource);
        const fShader = this.loadShader(gl.FRAGMENT_SHADER, this.fshaderSource);
        
        const program = gl.createProgram();
        if (!program) {
            throw new Error('Failed to create program');
        }
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);

        gl.linkProgram(program);
        const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            const error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            gl.deleteShader(fShader);
            gl.deleteShader(vShader);
            throw new Error('Failed to link program' + error)
        }
        return program;
    }
    initShaders () {
        this.program = this.createProgram();
        if (!this.program) {
            throw new Error('Failed to create program');
        }
    }
    useProgram () {
        this.gl.useProgram(this.program);
    }
    setInt (name, value) {
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), value);
    }
    setVec3 (name, value) {
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), value)
    }
    setMat4 (name, mat) {
        const res = mat.reduce((acc, curr) => {
            return acc.concat(curr);
        }, [])
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, res);
    }
}