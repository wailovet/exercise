var System_1 = require("./System");
var Display_1 = require("./Display");
var Cpu = (function () {
    //清理显存
    //清理栈
    //清理从V0到VF的寄存器
    //清理内存
    function Cpu() {
        this.I = 0;
        this.memory = new ArrayBuffer(4096);
        var chip8_fontset = [
            0xF0, 0x90, 0x90, 0x90, 0xF0,
            0x20, 0x60, 0x20, 0x20, 0x70,
            0xF0, 0x10, 0xF0, 0x80, 0xF0,
            0xF0, 0x10, 0xF0, 0x10, 0xF0,
            0x90, 0x90, 0xF0, 0x10, 0x10,
            0xF0, 0x80, 0xF0, 0x10, 0xF0,
            0xF0, 0x80, 0xF0, 0x90, 0xF0,
            0xF0, 0x10, 0x20, 0x40, 0x40,
            0xF0, 0x90, 0xF0, 0x90, 0xF0,
            0xF0, 0x90, 0xF0, 0x10, 0xF0,
            0xF0, 0x90, 0xF0, 0x90, 0x90,
            0xE0, 0x90, 0xE0, 0x90, 0xE0,
            0xF0, 0x80, 0x80, 0x80, 0xF0,
            0xE0, 0x90, 0x90, 0x90, 0xE0,
            0xF0, 0x80, 0xF0, 0x80, 0xF0,
            0xF0, 0x80, 0xF0, 0x80, 0x80];
        for (var i = 0; i < chip8_fontset.length; i++) {
            this.memory[i] = chip8_fontset[i];
        }
        this.display = new Display_1.Display();
        this.V = [];
        this.stack = [];
        this.keyboard = [];
        this.pc = 0x200;
        this.delaytimer = 0;
    }
    Cpu.prototype.load = function (data) {
        for (var i = 0; i < data.byteLength; i++) {
            this.memory[i + 512] = data[i];
        }
        return this;
    };
    Cpu.prototype.work = function () {
        this.display.start();
        var _this = this;
        setInterval(function () {
            var opcode = _this.memory[_this.pc] << 8 | _this.memory[_this.pc + 1];
            var code = (opcode >>> 12);
            if (!Cpu.OP_CODE[code]) {
                System_1.System.print("Unknown opcod[0x0000]: 0x" + opcode.toString(16) + "\n" + code.toString(16));
            }
            //System.print("pc[" + code.toString(16) + "][" + opcode.toString(16) + ":" + _this.pc + "]");
            //System.print(_this.V);
            //System.print(_this.delaytimer);
            Cpu.OP_CODE[code](_this, opcode);
            if (_this.delaytimer > 0) {
                _this.delaytimer--;
            }
            System_1.System.run_num++;
            System_1.System.print(_this.V);
        }, 1000);
    };
    Cpu.prototype.next = function () {
        this.pc += 2;
    };
    Cpu.prototype.jump = function (pc) {
        this.pc = pc;
    };
    Cpu.prototype.call = function (pc) {
        this.stack.push(this.pc);
        this.jump(pc);
    };
    Cpu.prototype.returns = function () {
        var pc = this.stack.pop();
        this.jump(pc);
        this.next();
    };
    Cpu.rand = function () {
        //var timestamp = (new Date()).valueOf();
        var t;
        Cpu.x ^= Cpu.x << 16;
        Cpu.x ^= Cpu.x >> 5;
        Cpu.x ^= Cpu.x << 1;
        t = Cpu.x;
        Cpu.x = Cpu.y;
        Cpu.y = Cpu.z;
        Cpu.z = t ^ Cpu.x ^ Cpu.y;
        return Cpu.z & 0xFF;
    };
    Cpu.OP_CODE = {
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
                    System_1.System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
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
                case 0x0000:
                    cpu.V[(code & 0x0F00) >> 8] = cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;
                case 0x0001:
                    cpu.V[(code & 0x0F00) >> 8] |= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;
                case 0x0002:
                    cpu.V[(code & 0x0F00) >> 8] &= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;
                case 0x0003:
                    cpu.V[(code & 0x0F00) >> 8] ^= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;
                case 0x0004:
                    if (cpu.V[(code & 0x0F00) >> 8] + cpu.V[(code & 0x00F0) >> 4] > 255)
                        cpu.V[15] = 1;
                    else
                        cpu.V[15] = 0;
                    cpu.V[(code & 0x0F00) >> 8] += cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;
                case 0x0005:
                    if (cpu.V[(code & 0x00F0) >> 4] > cpu.V[(code & 0x0F00) >> 8])
                        cpu.V[15] = 0;
                    else
                        cpu.V[15] = 1;
                    cpu.V[(code & 0x0F00) >> 8] -= cpu.V[(code & 0x00F0) >> 4];
                    cpu.next();
                    break;
                case 0x0006:
                    cpu.V[15] = cpu.V[(code & 0x0F00) >> 8] & 0x0001;
                    cpu.V[(code & 0x0F00) >> 8] >>= 1;
                    cpu.next();
                    break;
                case 0x0007:
                    if (cpu.V[(code & 0x0F00) >> 8] > cpu.V[(code & 0x00F0) >> 4])
                        cpu.V[15] = 0;
                    else
                        cpu.V[15] = 1;
                    cpu.V[(code & 0x0F00) >> 8] = cpu.V[(code & 0x00F0) >> 4] - cpu.V[(code & 0x0F00) >> 8];
                    cpu.next();
                    break;
                case 0x000E:
                    cpu.V[15] = cpu.V[(code & 0x0F00) >> 8] >> 7;
                    cpu.V[(code & 0x0F00) >> 8] <<= 1;
                    cpu.next();
                    break;
                default:
                    System_1.System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
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
            var op_code = code & 0x0FFF;
            op_code += cpu.V[0];
            cpu.jump(op_code);
        },
        0xC: function (cpu, code) {
            cpu.V[code & 0x0F00 >> 8] = Cpu.rand() & (code & 0xFF);
            cpu.next();
        },
        0xD: function (cpu, code) {
            //CHIP8绘图是以Sprites来进行的，Sprites是8个像素点来表示。其存放地址已I地址开始进行索引。绘画主要通过异或运算进行，需要注意的是如果发现某个像素点由1变为0的画，则需要设置VF为1，这是用来进行碰撞检测的。
            var x = cpu.V[(code & 0x0F00) >> 8];
            var y = cpu.V[(code & 0x00F0) >> 4];
            var height = code & 0x000F;
            cpu.V[15] = 0;
            var map = cpu.display.get();
            for (var yline = 0; yline < height; yline++) {
                var pixel = cpu.memory[cpu.I + yline];
                for (var xline = 0; xline < 8; xline++) {
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
            var key = cpu.V[(code & 0x0F00) >> 8];
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
                    System_1.System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
            }
        },
        0xF: function (cpu, code) {
            switch (code & 0xFF) {
                case 0x07:
                    cpu.V[(code & 0x0F00) >> 8] = cpu.delaytimer;
                    cpu.next();
                    break;
                case 0x0A:
                    var key_press = 0;
                    for (var i = 0; i < 16; ++i) {
                        if (cpu.keyboard[i] != 0) {
                            cpu.V[(code & 0x0F00) >> 8] = i;
                            key_press = 1;
                        }
                    }
                    if (!key_press)
                        return;
                    cpu.next();
                    break;
                case 0x15:
                    cpu.delaytimer = cpu.V[(code & 0x0F00) >> 8];
                    cpu.next();
                    break;
                case 0x18:
                    //Soundtimer = V[(Opcode & 0x0F00) >> 8];
                    cpu.next();
                    break;
                case 0x1E:
                    if (cpu.I + cpu.V[(code & 0x0F00) >> 8] > 0xFFF)
                        cpu.V[15] = 1;
                    else
                        cpu.V[15] = 0;
                    cpu.I += cpu.V[(code & 0x0F00) >> 8];
                    cpu.next();
                    break;
                case 0x29:
                    cpu.I = cpu.V[(code & 0x0F00) >> 8] * 0x5;
                    cpu.next();
                    break;
                case 0x33:
                    cpu.memory[cpu.I] = cpu.V[(code & 0x0F00) >> 8] / 100;
                    cpu.memory[cpu.I + 1] = cpu.V[(code & 0x0F00) >> 8] / 10 % 10;
                    cpu.memory[cpu.I + 2] = (cpu.V[(code & 0x0F00) >> 8] % 100) % 10;
                    cpu.next();
                    break;
                case 0x55:
                    for (var i = 0; i < ((code & 0x0F00) >> 8); i++) {
                        cpu.memory[cpu.I + i] = cpu.V[i];
                    }
                    cpu.I += ((code & 0x0F00) >> 8) + 1;
                    cpu.next();
                    break;
                case 0x65:
                    for (var i = 0; i < ((code & 0x0F00) >> 8); i++) {
                        cpu.V[i] = cpu.memory[cpu.I + i];
                    }
                    cpu.I += ((code & 0x0F00) >> 8) + 1;
                    cpu.next();
                    break;
                default:
                    System_1.System.print("Unknown opcode [0x0000]: 0x" + code.toString(16) + "\n");
            }
        },
    };
    Cpu.x = 123456789;
    Cpu.y = 362436069;
    Cpu.z = 521288629;
    return Cpu;
})();
exports.Cpu = Cpu;
