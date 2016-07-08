let c:any;
c = document.getElementById("renderCanvas");
var v3d = new V3D(c);

v3d.cameraPosition(0, 150, 0);
v3d.setGround(148, 96, 1, "bg.jpg");
v3d.enablePhysics();
//let s = v3d.addBox({
//    x: 0, y: 102, z: 0
//}, {
//    height: 148, width: 96, depth: 100
//}, "one.png");
//s.enablePhysics();
let box:V3DBox = v3d.addPlane({
    x: 0, y: 150, z: 0
}, {
    height: 10, width: 8
}, "one.png");
box.enablePhysics(100,1,0);
box.rotation(V3DMesh.ORIENTATION.X, Math.PI / 2);

document.onmousedown = function(){
    box.babylon_mesh.position.y += 30;
};
document.onmouseup = function(){

};



//box.rotation(V3DMesh.ORIENTATION.X, Math.PI / 2, 100, function () {
//
//});
//
//
//box.rotation(V3DMesh.ORIENTATION.Y, Math.PI / 2, 100, function () {
//    //box.babylon_scene.getMeshByName(box.babylon_name).animations = [];
//    box.rotation(V3DMesh.ORIENTATION.Y, Math.PI / 4, 100, function () {
//
//    });
//});