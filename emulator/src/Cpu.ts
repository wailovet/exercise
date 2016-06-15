import {System} from "./System";
import {Display} from "./Display";
export class Cpu {
    private pc = 0x200;
    private opcode = 0;      //初始化“当前opcode”
    private I = 0;      //初始化索引寄存器
    private sp = 0;      //初始化栈顶指针
    private gfx:Array<number> = [];      //初始化栈顶指针
    private drawFlag:boolean = false;      //初始化栈顶指针
    private memory:ArrayBuffer;


    private display:Display;

    //清理显存
    //清理栈
    //清理从V0到VF的寄存器
    //清理内存

    constructor() {
        this.memory = new ArrayBuffer(4096);
        this.display = new Display();
    }


    public load(data:ArrayBuffer):Cpu {
        for (let i = 0; i < data.byteLength; i++) {
            this.memory[i + 512] = data[i];
        }
        return this;
    }

    public work():void {
        let i = 10000;


        while (i-- > 0) {
            let opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];

            switch (opcode & 0xF000) {
                case 0x0000:
                    switch (opcode & 0x000F) {
                        case 0x0000: // 0x00E0: Clears the screen
                            this.display.clean();
                            this.pc += 2;
                            break;

                        case 0x000E: // 0x00EE: Returns from subroutine
                            --this.sp;			// 16 levels of stack, decrease stack pointer to prevent overwrite
                            this.pc = stack[sp];	// Put the stored return address from the stack back into the program counter
                            this.pc += 2;		// Don't forget to increase the program counter!
                            break;

                        default:
                            printf("Unknown opcode [0x0000]: 0x%X\n", opcode);
                    }
                    break;
            }


            System.print(opcode);
            this.pc += 2;
        }

    }
}