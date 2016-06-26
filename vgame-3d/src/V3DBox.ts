///<reference path="V3DMesh.ts"/>


class V3DBox extends V3DMesh {


    constructor(scene, size:{height:number,width:number,depth:number}) {
        super(scene, "box" + System.rand(0, 10000000).toString());
        this.babylon_mesh = BABYLON.MeshBuilder.CreateBox(this.babylon_name, size, this.babylon_scene);

    }


}