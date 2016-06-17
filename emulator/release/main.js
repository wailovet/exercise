var System_1 = require("./System");
var Cpu_1 = require("./Cpu");
//System.print((0x22FC >>8).toString(16));
//
//let data = System.load("pong.c8");
//let data = System.load("invaders.c8");
var data = System_1.System.load("tetris.c8");
//
var cpu = new Cpu_1.Cpu();
cpu.load(data);
cpu.work();
