import Engine = BABYLON.Engine;
import Scene = BABYLON.Scene;
import TargetCamera = BABYLON.TargetCamera;
import HemisphericLight = BABYLON.HemisphericLight;
import Mesh = BABYLON.Mesh;


class V3D {

    private engine:Engine;
    private scene:Scene;
    private camera:TargetCamera;
    private light:HemisphericLight;

    constructor(node:HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(node, true);
        this.scene = new BABYLON.Scene(this.engine);

        this.camera = new BABYLON.TargetCamera('camera1', new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());


        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(100, 100, 50), this.scene);
        this.light.diffuse = new BABYLON.Color3(100, 100, 100);
        this.light.specular = new BABYLON.Color3(1, 1, 1);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    public setGround(x, y, z, file) {

        let cg = BABYLON.Mesh.CreateGround(System.rand(0, 10000000).toString(), x, y, z, this.scene);

        let material = new BABYLON.StandardMaterial("texturePlane", this.scene);
        material.diffuseTexture = new BABYLON.Texture(file, this.scene);
        cg.material = material;

    }


    public addMaterial(file) {

        let sm = new BABYLON.StandardMaterial(System.rand(0, 10000000).toString(), this.scene);
        sm.diffuseTexture = new BABYLON.Texture(file, this.scene);
        sm.diffuseTexture.hasAlpha = true;//适用png的透明（游戏开发的朋友告诉我png比较消耗性能）
    }


    public cameraPosition(x, y, z) {
        this.scene.removeCamera(this.camera);
        this.camera = new BABYLON.TargetCamera('camera1', new BABYLON.Vector3(x, y, z), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.scene.render();

    }


}