import {System} from "./System";
import {Cpu} from "./Cpu";


let data = System.load("pong.c8");

let cpu = new Cpu();
cpu.load(data);
cpu.work();