let c:any;
c = document.getElementById("renderCanvas");
var v3d = new V3D(c);

v3d.setGround(1281, 900, 5);

//    var d = 1000;
v3d.cameraPosition(0, 1500, 0);
v3d.setGround(1488, 968, 10, "bg.jpg")
//    sm = v3d.addMaterial("bg.jpg")
let box:V3DBox = v3d.addBox({
    x: 0, y: 300, z: 0
}, {
    height: 400, width: 350, depth: 10
}, "one.png");


box.rotation(V3DMesh.ORIENTATION.X, Math.PI / 2, 100, function () {

});


box.rotation(V3DMesh.ORIENTATION.Y, Math.PI / 2, 100, function () {
    //box.babylon_scene.getMeshByName(box.babylon_name).animations = [];
    box.rotation(V3DMesh.ORIENTATION.Y, Math.PI / 4, 100, function () {

    });
});