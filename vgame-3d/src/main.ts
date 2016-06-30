let c:any;
c = document.getElementById("renderCanvas");
var v3d = new V3D(c);

//    var d = 1000;
v3d.cameraPosition(0, 150, 0);
let gr = v3d.setGround(148, 96, 0, "bg.jpg")
//    sm = v3d.addMaterial("bg.jpg")
let box:V3DBox = v3d.addBox({
    x: 0, y: 40, z: 0
}, {
    height: 20, width: 15, depth: 0.1
}, "one.png");


box.babylon_mesh.rotation.x = -Math.PI / 3;
v3d.scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.CannonJSPlugin());

gr.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, {
    mass: 0,
    friction: 1,
    restitution: 0
});


box.babylon_mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {
    mass: 10,
    friction: 1,
    restitution: 0
});
setTimeout(function () {


    box.move(V3DBox.ORIENTATION.Y, 100, 800, function () {

    });
    box.rotation(V3DBox.ORIENTATION.X, box.babylon_mesh.rotation.x , 700);
}, 4000);


