///<reference path="System.ts"/>
class V3DMesh {


    public babylon_mesh:BABYLON.Mesh;
    public babylon_scene:BABYLON.Scene;
    public babylon_name:string;


    constructor(scene, name) {
        this.babylon_scene = scene;
        this.babylon_name = name;
    }

    public collisions(is_check:boolean) {
        this.babylon_mesh.checkCollisions = is_check;
    }

    public setPosition(position:{x:number,y:number,z:number}) {
        this.babylon_mesh.position.x = position.x;
        this.babylon_mesh.position.y = position.y;
        this.babylon_mesh.position.z = position.z;
    }

    public setImg(file) {
        let material = new BABYLON.StandardMaterial("texturePlane" + System.rand(0, 10000000).toString(), this.babylon_scene);
        material.diffuseTexture = new BABYLON.Texture(file, this.babylon_scene);
        material.diffuseTexture.hasAlpha = true;
        this.babylon_mesh.material = material;
    }


    public static ORIENTATION = {
        X: "x",
        Y: "y",
        Z: "z",
    };


    public move(orientation:string, value:number, framePerSecond?:number, callback?:() => void) {
        if (!framePerSecond) {
            this.babylon_mesh.position[orientation] = value;
            if (callback) {
                callback();
            }
            return;
        }


        this.animation("position." + orientation, this.babylon_mesh.position[orientation], value, framePerSecond);

        return this.babylon_scene.beginAnimation(this.babylon_mesh, 0, 100, false, 1, ()=> {
            console.log(this.babylon_scene.getMeshByName(this.babylon_name).animations);

            this.babylon_scene.getMeshByName(this.babylon_name).animations = [];
            this.move(orientation, value, null, callback);
        });


    }


    public rotation(orientation:string, value:number, framePerSecond?:number, callback?:() => void) {
        if (!framePerSecond) {
            this.babylon_mesh.rotation[orientation] = value;
            if (callback) {
                callback();
            }
            return;
        }

        this.animation("rotation." + orientation, this.babylon_mesh.rotation[orientation], value, framePerSecond);

        return this.babylon_scene.beginAnimation(this.babylon_mesh, 0, 100, false, 1, ()=> {
            console.log(this.babylon_scene.getMeshByName(this.babylon_name).animations);

            this.babylon_scene.getMeshByName(this.babylon_name).animations = [];
            this.rotation(orientation, value, null, callback);
        });

    }

    public animation(attr_name:string, start_val:number, end_val:number, framePerSecond?:number) {
        var animation = new V3DAnimation("animation" + System.rand(0, 10000000).toString(), attr_name, framePerSecond, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let keys = [];
        keys.push({
            frame: 0,
            value: start_val
        });
        keys.push({
            frame: 100,
            value: end_val
        });
        animation.setKeys(keys);
        this.babylon_mesh.animations.push(animation);
    }
}