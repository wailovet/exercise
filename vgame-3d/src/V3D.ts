import Engine = BABYLON.Engine;
import Scene = BABYLON.Scene;
import TargetCamera = BABYLON.TargetCamera;
import FreeCamera = BABYLON.FreeCamera;
import HemisphericLight = BABYLON.HemisphericLight;
import Mesh = BABYLON.Mesh;


class V3D {

    private engine:Engine;
    public scene:Scene;
    //private camera:TargetCamera;
    private camera:FreeCamera;
    private light:HemisphericLight;

    constructor(node:HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(node, true);
        this.scene = new V3DScene(this.engine);

        //this.camera = new BABYLON.TargetCamera('camera' + System.rand(0, 10000000).toString(), new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera = new BABYLON.FreeCamera('camera' + System.rand(0, 10000000).toString(), new BABYLON.Vector3(0, 500, 0), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());


        this.light = new BABYLON.HemisphericLight('light' + System.rand(0, 10000000).toString(), new BABYLON.Vector3(100, 100, 50), this.scene);
        this.light.diffuse = new BABYLON.Color3(100, 100, 100);
        this.light.specular = new BABYLON.Color3(1, 1, 1);


        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }


    public addBox(position:{x:number,y:number,z:number}, size:{height:number,width:number,depth:number}, file?) {
        var box = new V3DBox(this.scene, size);
        box.setPosition(position);
        if (file) {
            box.setImg(file);
        }
        return box;
    }


    public setGround(width:number, height:number, subdivisions:number, file?) {

        let cg = BABYLON.Mesh.CreateGround('ground' + System.rand(0, 10000000).toString(), width, height, subdivisions, this.scene);
        if (file) {
            let material = new BABYLON.StandardMaterial("texturePlane", this.scene);
            material.diffuseTexture = new BABYLON.Texture(file, this.scene);
            cg.material = material;
        }
        return cg;
    }


    public addMaterial(file?) {

        var sphere = BABYLON.Mesh.CreateSphere('sphere' + System.rand(0, 10000000).toString(), 500, 50, this.scene);
        sphere.position.y = 2;
        let sm = new BABYLON.StandardMaterial(System.rand(0, 10000000).toString(), this.scene);
        sm.diffuseTexture = new BABYLON.Texture(file, this.scene);
        //sm.diffuseTexture.hasAlpha = true;//适用png的透明（游戏开发的朋友告诉我png比较消耗性能）
        sphere.material = sm;

        return sphere;
    }

    public cameraPosition(x, y, z) {
        this.scene.removeCamera(this.camera);
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(x, y, z), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.scene.render();

    }


}