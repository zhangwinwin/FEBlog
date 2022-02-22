import { defineComponent, ref, onMounted, withModifiers } from 'vue';
import {vec3, mat4} from 'gl-matrix';
import Help from '../../utils/help';
import Camera from '../../utils/Camera';
import Shader from '../../utils/Shader';

import VSHADER from './light.vs';
import FSHADER from './light.fs';

import WoodImage from '../../assets/wood.png';

const getWebglContext = (root) => {
    const canvas = root.value;
    const ctx = canvas.getContext('webgl');
    return ctx;
}
const loadTexture = (gl, texture, image) => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
}
const initTextures = (gl, cb) => {
    const texture = gl.createTexture();
    const image = new Image();
    image.onload = () => {
        loadTexture(gl, texture, image);
        cb(texture);
    }
    image.src = WoodImage;
}

const initVertexBuffers = (gl, program) => {
    const planeVertices = new Float32Array([
        // positions            // normals         // texcoords
     10.0, -0.5,  10.0,  0.0, 1.0, 0.0,  10.0,  0.0,
     -10.0, -0.5,  10.0,  0.0, 1.0, 0.0,   0.0,  0.0,
     -10.0, -0.5, -10.0,  0.0, 1.0, 0.0,   0.0, 10.0,

      10.0, -0.5,  10.0,  0.0, 1.0, 0.0,  10.0,  0.0,
     -10.0, -0.5, -10.0,  0.0, 1.0, 0.0,   0.0, 10.0,
      10.0, -0.5, -10.0,  0.0, 1.0, 0.0,  10.0, 10.0
    ]);
    const fsize = planeVertices.BYTES_PER_ELEMENT;
    const planeVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planeVBO);
    gl.bufferData(gl.ARRAY_BUFFER, planeVertices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, gl.FALSE, fsize * 8, 0);
    gl.enableVertexAttribArray(aPos);

    const aNormal = gl.getAttribLocation(program, 'aNormal');
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, gl.FALSE, fsize * 8, fsize * 3);
    gl.enableVertexAttribArray(aNormal);

    const aTexCoords = gl.getAttribLocation(program, 'aTexCoords');
    gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, gl.FALSE, fsize * 8, fsize * 6);
    gl.enableVertexAttribArray(aTexCoords);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export default defineComponent({
    setup () {
        const canvas  = ref(null);
        const SCR_WIDTH = 800;
        const SCR_HEIGHT = 600;

        const blinn = ref(false);

        const changeLightMode = () => {
            blinn.value = !blinn.value;
        }

        const camera = new Camera(vec3.set(vec3.create(), 0.0, 0.0, 3.0));
        
        onMounted (() => {
            const lightPos = vec3.set(vec3.create(),0.0, 0.0, 0.0);

            const gl = getWebglContext(canvas);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            const shader = new Shader(VSHADER, FSHADER);
            shader.setGl(gl);
            shader.initShaders();
            shader.useProgram();
            initVertexBuffers(gl, shader.program);
            const draw = () => {
                gl.clearColor(0.1, 0.1, 0.1, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                const projection = mat4.perspective(mat4.create(), Help.radians(camera.Zoom), SCR_WIDTH / SCR_HEIGHT, 0.1, 100.0);

                const view = camera.GetViewMatrix();
                shader.setMat4('projection', projection);
                shader.setMat4('view', view);
                shader.setVec3('viewPos', camera.Position);
                shader.setVec3('lightPos', lightPos);
                shader.setInt('blinn', blinn.value);
                
                shader.setInt('floorTexture', 0);

                gl.drawArrays(gl.TRIANGLES, 0, 6);
                window.requestAnimationFrame(() => {
                    draw();
                })
            }
            initTextures(gl, () => {
                draw();
            })
        });
        return () => 
        <div>
            <canvas ref={canvas} width="800" height="600"></canvas>
            <button style="display:block; margin:auto;" onClick={withModifiers(changeLightMode, ['self'])}>{blinn.value ? 'blinn phong' : 'phong'}</button>
        </div>
    }
})