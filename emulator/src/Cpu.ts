import {System} from "./System";
import {Display} from "./Display";
export class Cpu {
    public pc:number;

    public V:Array<number>;
    public I:number

    public memory:ArrayBuffer;

    public stack:Array<number>;

    public keyboard:Array<boolean>;
    public delaytimer:number;

    public display:Display;

    //清理显存
    //清理栈
    //清理从V0到VF的寄存器
    //清理内存

    constructor() {
        this.memory = new ArrayBuffer(4096);
        this.display = new Display();
        this.V = [];
        this.stack = [];
        this.keyboard = [];
        this.pc = 0x200;
        this.delaytimer = 0;
    }


    public load(data:ArrayBuffer):Cpu {
        for (let i = 0; i < data.byteLength; i++) {
            this.memory[i + 512] = data[i];
        }
        return this;
    }

    public work():void {
        this.display.start();
        var _this = this;

        setInterval(function () {

            let opcode = _this.memory[_this.pc] << 8 | _this.memory[_this.pc + 1];
            let code = (opcode >>> 12);
            if (!Cpu.OP_CODE[code]) {
                System.print("Unknown opcod[0x0000]: 0x" + opcode.toString(16) + "\n" + code.toString(16));
            }
            //System.print("pc[" + code.toString(16) + "][" + opcode.toString(16) + ":" + _this.pc + "]");
            //System.print(_this.V);
            //System.print(_this.delaytimer);
            Cpu.OP_CODE[code](_this, opcode);
            if (_this.delaytimer > 0) {
                _this.delaytimer--;
            }
            System.run_num++;
        }, 1000 / 60);


    }

    public next():void {
        this.pc += 2;
    }

    public jump(pc:number):void {
        this.pc = pc;
    }

    public call(pc:number):void {
        this.stack.push(this.pc);
        this.jump(pc);
    }

    public returns():void {
        let pc = this.stack.pop();
        this.jump(pc);
        this.next();
    }


    public static OP_CODE = {
        0x0: function (cpu, code) {
            switch (code) {
                case 0x00E0:
                    cpu.display.clean();
                    cpu.next();
                    break;
                case 0x00EE:
                    cpu.returns();
                    break;
                default:
                    System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
            }
        },
        0x1: function (cpu, code) {
            cpu.jump(code & 0x0FFF);
        },
        0x2: function (cpu, code) {
            cpu.call(code & 0x0FFF);
        },
        0x3: function (cpu, code) {
            cpu.next();
            if (cpu.V[(code & 0x0F00) >> 8] == (code & 0x00FF)) {
                cpu.next();
            }
        },
        0x4: function (cpu, code) {
            cpu.next();
            if (cpu.V[(code & 0x0F00) >> 8] != (code & 0x00FF)) {
                cpu.next();
            }
        },
        0x5: function (cpu, code) {
            cpu.next();
            if (cpu.V[(code & 0x0F00) >> 8] == cpu.V[(code & 0x00F0) >> 4]) {
                cpu.next();
            }
        },
        0x6: function (cpu, code) {
            cpu.V[(code & 0x0F00) >> 8] = code & 0x00FF;
            cpu.next();
        },
        0x7: function (cpu, code) {
            cpu.V[(code & 0x0F00) >> 8] += code & 0x00FF;
            cpu.next();
        },
        0x8: function (cpu, code) {
            switch (code & 0x000F) {
                case 0x0000:    //  Sets VX to the value of VY.
                    cpu.V[(code & 0x0F00) >> 8] = cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;

                case 0x0001:    //Sets VX to VX or VY.
                    cpu.V[(code & 0x0F00) >> 8] |= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;

                case 0x0002:    //Sets VX to VX and VY.
                    cpu.V[(code & 0x0F00) >> 8] &= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;

                case 0x0003:    //  Sets VX to VX xor VY.
                    cpu.V[(code & 0x0F00) >> 8] ^= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;

                case 0x0004:    //Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
                    if (cpu.V[(code & 0x0F00) >> 8] + cpu.V[(code & 0x00F0) >> 4] > 255)
                        cpu.V[15] = 1;
                    else
                        cpu.V[15] = 0;
                    cpu.V[(code & 0x0F00) >> 8] += cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;

                case 0x0005:    //  VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
                    if (cpu.V[(code & 0x00F0) >> 4] > cpu.V[(code & 0x0F00) >> 8])
                        cpu.V[15] = 0;
                    else
                        cpu.V[15] = 1;
                    cpu.V[(code & 0x0F00) >> 8] -= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;

                case 0x0006:    //  Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift
                    cpu.V[15] = cpu.V[(code & 0x0F00) >> 8] & 0x0001;
                    cpu.V[(code & 0x0F00) >> 8] >>= 1;
                    cpu.next();
                    break;

                case 0x0007:    //  Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
                    if (cpu.V[(code & 0x0F00) >> 8] > cpu.V[(code & 0x00F0) >> 4])
                        cpu.V[15] = 0;
                    else
                        cpu.V[15] = 1;
                    cpu.V[(code & 0x0F00) >> 8] = cpu.V[(code & 0x00F0) >> 4] - cpu.V[(code & 0x0F00) >> 8];
                    cpu.next();
                    break;

                case 0x000E:    //Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift.
                    cpu.V[15] = cpu.V[(code & 0x0F00) >> 8] >> 7;
                    cpu.V[(code & 0x0F00) >> 8] <<= 1;
                    cpu.next();
                    break;
                default:
                    System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
            }
        },
        0x9: function (cpu, code) {
            cpu.next();
            if (cpu.V[(code & 0x0F00) >> 8] != cpu.V[(code & 0x00F0) >> 4]) {
                cpu.next();
            }
        },
        0xA: function (cpu, code) {
            cpu.I = code & 0x0FFF;
            cpu.next();
        },
        0xB: function (cpu, code) {
            let op_code = code & 0x0FFF;
            op_code += cpu.V[0];
            cpu.jump(op_code);
        },
        0xC: function (cpu, code) {
            cpu.V[code & 0x0F00 >> 8] = Cpu.rand() & (code & 0xFF);
            cpu.next();
        },
        0xD: function (cpu, code) {
            //CHIP8绘图是以Sprites来进行的，Sprites是8个像素点来表示。其存放地址已I地址开始进行索引。绘画主要通过异或运算进行，需要注意的是如果发现某个像素点由1变为0的画，则需要设置VF为1，这是用来进行碰撞检测的。
            let x = cpu.V[(code & 0x0F00) >> 8];
            let y = cpu.V[(code & 0x00F0) >> 4];
            let height = code & 0x000F;
            cpu.V[15] = 0;

            let map = [];

            for (let yline = 0; yline < height; yline++) {
                var pixel = cpu.memory[cpu.I + yline];
                for (let xline = 0; xline < 8; xline++) {
                    if ((pixel & (0x80 >> xline)) != 0) {
                        if (map[(x + xline + ((y + yline) * 64))] == 1) {
                            cpu.V[0xF] = 1;
                        }
                        map[x + xline + ((y + yline) * 64)] ^= 1;
                    }
                }
            }


            cpu.display.data(map);

            cpu.next();
        },
        0xE: function (cpu, code) {

            let key = cpu.V[(code & 0x0F00) >> 8];
            cpu.next();
            switch (code & 0x00FF) {
                case 0x009E:
                    if (cpu.keyboard[key]) {
                        cpu.next();
                    }
                    break;
                case 0x00A1:
                    if (!cpu.keyboard[key]) {
                        cpu.next();
                    }
                    break;
                default:
                    System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
            }
        },
        0xF: function (cpu, code) {
            switch (code & 0xFF) {
                case 0x07:  //Sets VX to the value of the delay timer.
                    cpu.V[(code & 0x0F00) >> 8] = cpu.delaytimer;
                    cpu.next();
                    break;
                case 0x0A:  //A key press is awaited, and then stored in VX.
                    let key_press = 0;

                    for (let i = 0; i < 16; ++i) {
                        if (cpu.keyboard[i] != 0) {
                            cpu.V[(code & 0x0F00) >> 8] = i;
                            key_press = 1;
                        }
                    }
                    if (!key_press)
                        return;

                    cpu.next();
                    break;

                case 0x15:  //Sets the delay timer to VX.
                    cpu.delaytimer = cpu.V[(code & 0x0F00) >> 8];
                    cpu.next();
                    break;

                case 0x18:  //  Sets the sound timer to VX.
                    //Soundtimer = V[(Opcode & 0x0F00) >> 8];
                    cpu.next();
                    break;

                case 0x1E:  //Adds VX to I
                    if (cpu.I + cpu.V[(code & 0x0F00) >> 8] > 0xFFF)
                        cpu.V[15] = 1;
                    else
                        cpu.V[15] = 0;
                    cpu.I += cpu.V[(code & 0x0F00) >> 8];
                    cpu.next();
                    break;

                case 0x29:  //Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font
                    cpu.I = cpu.V[(code & 0x0F00) >> 8] * 0x5;
                    cpu.next();
                    break;

                case 0x33:  //  Stores the Binary-coded decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX, place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
                    cpu.memory[cpu.I] = cpu.V[(code & 0x0F00) >> 8] / 100;
                    cpu.memory[cpu.I + 1] = cpu.V[(code & 0x0F00) >> 8] / 10 % 10;
                    cpu.memory[cpu.I + 2] = (cpu.V[(code & 0x0F00) >> 8] % 100) % 10;
                    cpu.next();
                    break;

                case 0x55:  //  Stores V0 to VX in memory starting at address I

                    for (let i = 0; i < ((code & 0x0F00) >> 8); i++) {
                        cpu.memory[cpu.I + i] = cpu.V[i];
                    }
                    cpu.I += ((code & 0x0F00) >> 8) + 1;
                    cpu.next();
                    break;

                case 0x65:  //  Fills V0 to VX with values from memory starting at address I
                    for (let i = 0; i < ((code & 0x0F00) >> 8); i++) {
                        cpu.V[i] = cpu.memory[cpu.I + i];
                    }
                    cpu.I += ((code & 0x0F00) >> 8) + 1;
                    cpu.next();
                    break;
                default:
                    System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
            }
        },
    };


    public static x:number = 123456789;
    public static y:number = 362436069;
    public static z:number = 521288629;

    public static rand() {
        //var timestamp = (new Date()).valueOf();
        let t;
        Cpu.x ^= Cpu.x << 16;
        Cpu.x ^= Cpu.x >> 5;
        Cpu.x ^= Cpu.x << 1;
        t = Cpu.x;
        Cpu.x = Cpu.y;
        Cpu.y = Cpu.z;
        Cpu.z = t ^ Cpu.x ^ Cpu.y;

        return Cpu.z & 0xFF;
    }


}