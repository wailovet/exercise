///<reference path="PaddlingUi.ts"/>
///<reference path="../d.ts/zepto.d.ts"/>
class VerticalPanView {
    private substitute:ZeptoCollection;
    private node:ZeptoCollection;
    private pui:PaddlingUi;
    private left:string;

    constructor(pui:PaddlingUi) {
        this.node = $("select.paddling-vertical");
        this.substitute = $(".paddling-vertical-substitute");
        this.pui = pui;
        if (this.node.length > 0) {
            if (this.substitute.length < 1) {
                this.pui.node.append('<div class="paddling-vertical-substitute"></div>');
                this.substitute = $(".paddling-vertical-substitute");
            }
            this.node.hide();
            this.substitute.hide();
        }


    }

    public hide() {
        this.substitute.hide();
    }

    public show() {
        this.substitute.show();
        let width = this.substitute.width();
        let pui_width = this.pui.node.width();
        this.substitute.css({
            left: (pui_width - width) / 2
        });
    }

    public move(y) {
        let pui_height = this.pui.node.height();
        this.substitute.css({
            top: pui_height / 2 + y
        });
        console.log(y);
    }

}