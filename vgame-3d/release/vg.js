var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var System = (function () {
    function System() {
    }
    System.rand = function (min, max) {
        var t;
        System.x ^= System.x << 16;
        System.x ^= System.x >> 5;
        System.x ^= System.x << 1;
        t = System.x;
        System.x = System.y;
        System.y = System.z;
        System.z = t ^ System.x ^ System.y;
        var rand = Math.abs(System.z);
        return rand % (max + 1 - min) + min;
    };
    System.isNumber = function (obj) {
        return obj === +obj;
    };
    System.x = (new Date()).valueOf();
    System.y = 362436069;
    System.z = 521288629;
    return System;
}());
var Engine = BABYLON.Engine;
var Scene = BABYLON.Scene;
var TargetCamera = BABYLON.TargetCamera;
var FreeCamera = BABYLON.FreeCamera;
var HemisphericLight = BABYLON.HemisphericLight;
var Mesh = BABYLON.Mesh;
var V3D = (function () {
    function V3D(node) {
        var _this = this;
        this.is_physics_init = false;
        this.engine = new BABYLON.Engine(node, true);
        this.scene = new V3DScene(this.engine);
        //this.camera = new BABYLON.TargetCamera('camera' + System.rand(0, 10000000).toString(), new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera = new BABYLON.FreeCamera('camera' + System.rand(0, 10000000).toString(), new BABYLON.Vector3(0, 500, 0), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.light = new BABYLON.HemisphericLight('light' + System.rand(0, 10000000).toString(), new BABYLON.Vector3(100, 100, 50), this.scene);
        this.light.diffuse = new BABYLON.Color3(100, 100, 100);
        this.light.specular = new BABYLON.Color3(1, 1, 1);
        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        this.engine.runRenderLoop(function () {
            _this.scene.render();
        });
        window.addEventListener('resize', function () {
            _this.engine.resize();
        });
    }
    V3D.prototype.enablePhysics = function () {
        if (!this.is_physics_init) {
            this.scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
            this.ground.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {
                mass: 0,
                friction: 0,
                restitution: 0
            });
            V3D.physics_state_array.push({
                obj: this.ground,
                options: {
                    mass: 0,
                    friction: 0,
                    restitution: 0
                }
            });
            this.is_physics_init = true;
            return;
        }
        for (var i in V3D.physics_state_array) {
            if (V3D.physics_state_array[i].obj) {
                V3D.physics_state_array[i].obj.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, V3D.physics_state_array[i].options);
            }
        }
    };
    V3D.prototype.pausePhysics = function () {
        this.scene.disablePhysicsEngine();
    };
    V3D.prototype.addBox = function (position, size, file) {
        var box = new V3DBox(this.scene, size);
        box.setPosition(position);
        if (file) {
            box.setImg(file);
        }
        return box;
    };
    V3D.prototype.addPlane = function (position, size, file) {
        var box = new V3DPlane(this.scene, size);
        box.setPosition(position);
        if (file) {
            box.setImg(file);
        }
        return box;
    };
    V3D.prototype.setGround = function (width, height, subdivisions, file) {
        var cg = BABYLON.Mesh.CreateGround('ground' + System.rand(0, 10000000).toString(), width, height, subdivisions, this.scene);
        if (file) {
            var material = new BABYLON.StandardMaterial("texturePlane", this.scene);
            material.diffuseTexture = new BABYLON.Texture(file, this.scene);
            cg.material = material;
        }
        this.ground = cg;
        return cg;
    };
    V3D.prototype.addMaterial = function (file) {
        var sphere = BABYLON.Mesh.CreateSphere('sphere' + System.rand(0, 10000000).toString(), 500, 50, this.scene);
        sphere.position.y = 2;
        var sm = new BABYLON.StandardMaterial(System.rand(0, 10000000).toString(), this.scene);
        sm.diffuseTexture = new BABYLON.Texture(file, this.scene);
        //sm.diffuseTexture.hasAlpha = true;//适用png的透明（游戏开发的朋友告诉我png比较消耗性能）
        sphere.material = sm;
        return sphere;
    };
    V3D.prototype.cameraPosition = function (x, y, z) {
        this.scene.removeCamera(this.camera);
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(x, y, z), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.scene.render();
    };
    V3D.physics_state_array = [];
    return V3D;
}());
var V3DAnimation = (function (_super) {
    __extends(V3DAnimation, _super);
    function V3DAnimation() {
        _super.apply(this, arguments);
    }
    return V3DAnimation;
}(BABYLON.Animation));
///<reference path="System.ts"/>
var V3DMesh = (function () {
    function V3DMesh(scene, name) {
        this.babylon_scene = scene;
        this.babylon_name = name;
    }
    V3DMesh.prototype.enablePhysics = function (mass, friction, restitution) {
        if (mass === void 0) { mass = 1; }
        if (friction === void 0) { friction = 0.1; }
        if (restitution === void 0) { restitution = 0; }
        this.babylon_mesh.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {
            mass: mass,
            friction: friction,
            restitution: restitution
        });
        V3D.physics_state_array.push({
            obj: this.babylon_mesh,
            options: {
                mass: mass,
                friction: friction,
                restitution: restitution
            }
        });
    };
    V3DMesh.prototype.collisions = function (is_check) {
        this.babylon_mesh.checkCollisions = is_check;
    };
    V3DMesh.prototype.setPosition = function (position) {
        this.babylon_mesh.position.x = position.x;
        this.babylon_mesh.position.y = position.y;
        this.babylon_mesh.position.z = position.z;
    };
    V3DMesh.prototype.setImg = function (file) {
        var material = new BABYLON.StandardMaterial("texturePlane" + System.rand(0, 10000000).toString(), this.babylon_scene);
        material.diffuseTexture = new BABYLON.Texture(file, this.babylon_scene);
        material.diffuseTexture.hasAlpha = true;
        this.babylon_mesh.material = material;
    };
    V3DMesh.prototype.move = function (orientation, value, framePerSecond, callback) {
        var _this = this;
        if (!framePerSecond) {
            this.babylon_mesh.position[orientation] = value;
            if (callback) {
                callback();
            }
            return;
        }
        this.animation("position." + orientation, this.babylon_mesh.position[orientation], value, framePerSecond);
        return this.babylon_scene.beginAnimation(this.babylon_mesh, 0, 100, false, 1, function () {
            console.log(_this.babylon_scene.getMeshByName(_this.babylon_name).animations);
            _this.babylon_scene.getMeshByName(_this.babylon_name).animations = [];
            _this.move(orientation, value, null, callback);
        });
    };
    V3DMesh.prototype.rotation = function (orientation, value, framePerSecond, callback) {
        var _this = this;
        if (!framePerSecond) {
            this.babylon_mesh.rotation[orientation] = value;
            if (callback) {
                callback();
            }
            return;
        }
        this.animation("rotation." + orientation, this.babylon_mesh.rotation[orientation], value, framePerSecond);
        return this.babylon_scene.beginAnimation(this.babylon_mesh, 0, 100, false, 1, function () {
            console.log(_this.babylon_scene.getMeshByName(_this.babylon_name).animations);
            _this.babylon_scene.getMeshByName(_this.babylon_name).animations = [];
            _this.rotation(orientation, value, null, callback);
        });
    };
    V3DMesh.prototype.animation = function (attr_name, start_val, end_val, framePerSecond) {
        var animation = new V3DAnimation("animation" + System.rand(0, 10000000).toString(), attr_name, framePerSecond, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keys = [];
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
    };
    V3DMesh.ORIENTATION = {
        X: "x",
        Y: "y",
        Z: "z",
    };
    return V3DMesh;
}());
///<reference path="V3DMesh.ts"/>
var V3DBox = (function (_super) {
    __extends(V3DBox, _super);
    function V3DBox(scene, size) {
        _super.call(this, scene, "box" + System.rand(0, 10000000).toString());
        this.babylon_mesh = BABYLON.MeshBuilder.CreateBox(this.babylon_name, size, this.babylon_scene);
    }
    return V3DBox;
}(V3DMesh));
///<reference path="V3DMesh.ts"/>
var V3DPlane = (function (_super) {
    __extends(V3DPlane, _super);
    function V3DPlane(scene, size) {
        _super.call(this, scene, "box" + System.rand(0, 10000000).toString());
        this.babylon_mesh = BABYLON.MeshBuilder.CreatePlane(this.babylon_name, size, this.babylon_scene);
    }
    return V3DPlane;
}(V3DMesh));
var Animatable = BABYLON.Animatable;
var V3DScene = (function (_super) {
    __extends(V3DScene, _super);
    function V3DScene() {
        _super.apply(this, arguments);
    }
    V3DScene.prototype.beginAnimation = function (target, from, to, loop, speedRatio, onAnimationEnd, animatable) {
        //this.stopAnimation(target);
        if (speedRatio === void 0) { speedRatio = 1.0; }
        if (!animatable) {
            animatable = new Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd);
        }
        // Local animations
        if (target.animations) {
            animatable.appendAnimations(target, target.animations);
        }
        // Children animations
        if (target.getAnimatables) {
            var animatables = target.getAnimatables();
            for (var index = 0; index < animatables.length; index++) {
                this.beginAnimation(animatables[index], from, to, loop, speedRatio, onAnimationEnd, animatable);
            }
        }
        return animatable;
    };
    return V3DScene;
}(BABYLON.Scene));
var c;
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
var box = v3d.addPlane({
    x: 0, y: 150, z: 0
}, {
    height: 10, width: 8
}, "one.png");
box.enablePhysics(100, 1, 0);
box.rotation(V3DMesh.ORIENTATION.X, Math.PI / 2);
document.onmousedown = function () {
    box.babylon_mesh.position.y += 30;
    v3d.enablePhysics();
};
document.onmouseup = function () {
    box.enablePhysics(100, 1, 0);
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
