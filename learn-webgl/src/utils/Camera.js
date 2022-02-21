import { vec3, mat4 } from 'gl-matrix';
import Help from './help';
// const Camera_Movement = {
//     FORWRRD: 1,
//     BACKWARD: 2,
//     LEFT: 3,
//     RIGHT: 4
// }

const YAW = -90.0;
const PITCH = 0.0;
const SPEED = 2.5;
const SENSITIVITY = 0.1;
const ZOOM = 45.0;

export default class Camera {
    constructor (
        position = vec3.set(vec3.create(), 0.0, 0.0, 0.0),
        up = vec3.set(vec3.create(), 0.0, 1.0, 0.0),
        yaw = YAW,
        pitch = PITCH
    ) {
        this.Front = vec3.set(vec3.create(), 0.0, 0.0, -1.0);
        this.MovementSpeed = SPEED;
        this.MouseSensitivity = SENSITIVITY;
        this.Zoom = ZOOM;
        this.Position = position;
        this.WorldUp = up;
        this.Yaw = yaw;
        this.Picth = pitch;
        this._updateCameraVectors();
    }
    _updateCameraVectors () {
        let x = Math.cos(Help.radians(this.Yaw)) * Math.cos(Help.radians(this.Picth));
        let y = Math.sin(Help.radians(this.Picth));
        let z = Math.sin(Help.radians(this.Yaw)) * Math.cos(Help.radians(this.Picth));
        let front = vec3.set(vec3.create(), x, y, z);
        this.Front = vec3.normalize(front, front);
        const Right = vec3.create()
        this.Right = vec3.normalize(vec3.cross(Right, this.Front, this.WorldUp), Right);
        const Up = vec3.create();
        this.Up = vec3.normalize(vec3.create(), vec3.cross(Up, this.Right, this.Front));
    }
    GetViewMatrix() {
        const lookat = mat4.create();
        const added = vec3.create();
        vec3.add(added, this.Position, this.Front)
        return mat4.lookAt(lookat, this.Position, added, this.Up)
    }
}