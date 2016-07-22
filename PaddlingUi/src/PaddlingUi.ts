///<reference path="../d.ts/hammerjs.d.ts"/>
///<reference path="../d.ts/zepto.d.ts"/>
class PaddlingUi {

    private hammer:any;
    public node:ZeptoCollection;

    public static init(node) {
        var pui = new PaddlingUi(node);
        pui.pan();
        return pui;
    }

    constructor(node:ZeptoCollection) {
        this.node = node;
        this.hammer = new Hammer(node.get(0));
    }

    public pan() {
        var vertical_pan_view = new VerticalPanView(this);
        var is_start = false;

        this.hammer.on("panstart", function (ev) {
            is_start = true;

        });

        this.hammer.on("panend pancancel", function (ev) {
            is_start = false;
            vertical_pan_view.hide();
        });

        this.hammer.on("panup", function (ev) {
            if (!is_start) {
                return;
            }
            vertical_pan_view.show();
            vertical_pan_view.move(ev.deltaY);

        });
        this.hammer.on("pandown", function (ev) {
            if (!is_start) {
                return;
            }
            vertical_pan_view.show();
            vertical_pan_view.move(ev.deltaY);
        });
    }
}