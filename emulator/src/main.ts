import {System} from "./System";
import {Cpu} from "./Cpu";


//System.print((0x22FC >>8).toString(16));
//
//let data = System.load("pong.c8");
//let data = System.load("invaders.c8");
let data = System.load("tetris.c8");
//
let cpu = new Cpu();
cpu.load(data);
cpu.work();