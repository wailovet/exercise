///<reference path="PaddlingUi.ts"/>
///<reference path="../d.ts/zepto.d.ts"/>
class VerticalPanView {
    private substitute:ZeptoCollection;
    private substitute_active:ZeptoCollection;
    private node:ZeptoCollection;
    private pui:PaddlingUi;

    constructor(pui:PaddlingUi) {
        this.node = $("select.paddling-vertical");
        this.substitute = $(".paddling-vertical-substitute");
        this.substitute_active = $(".paddling-vertical-substitute-active");
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
        let width_active = this.substitute_active.width();
        let height_active = this.substitute_active.height();
        let pui_width = window.screen.width;
        let pui_height = window.screen.height;
        this.substitute.css({
            left: (pui_width - width) / 2
        });
        this.substitute_active.css({
            left: (pui_width - width_active) / 2,
            top: (pui_height - height_active) / 2,
        });
    }

    public move(y) {
        let pui_height = window.screen.height;

        let height = this.substitute.height();
        let height_active = this.substitute_active.height();
        let top = pui_height / 2 + y;


        if (top > (pui_height - height_active) / 2) {
            top = (pui_height - height_active) / 2;
        }


        // console.log(top + height);
        // console.log(this.substitute_active.position().top + height_active);
        // console.log("-");
        if ((top + height) < this.substitute_active.position().top + height_active) {
            top = this.substitute_active.position().top + height_active - height;
        }


        this.substitute.css({
            top: top
        });


        let mid = this.substitute_active.position().top - height_active / 2;


        let substitute_active = this.substitute_active;
        $(".paddling-vertical-substitute p").each(function () {
            let e = $(this);
            if (e.attr('class') == 'paddling-vertical-substitute-active') {
                return true;
            }

            // console.log(top + e.position().top);

            if (mid < top + e.position().top && mid > top + e.position().top - e.height()) {
                substitute_active.text(e.text());
                return false;
            }
            return true;
        });

    }

}