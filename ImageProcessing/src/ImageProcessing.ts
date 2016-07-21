///<reference path="../d.ts/zepto.d.ts"/>
class ImageProcessing {
    private canvas_node:ZeptoCollection;
    private effects:Array<PluginsInterface>;

    constructor(node:ZeptoCollection) {
        this.canvas_node = node;
        this.effects = [];
    }

    public plugins(obj:PluginsInterface) {
        this.effects.push(obj);
    }

    public init(select_image:ZeptoCollection) {
        select_image.change((evt)=> {
            var file = evt.target['files'][0];
            var reader = new FileReader();
            reader.onload = (res) => {
                let image = new Image();
                image.src = res.target['result'];
                image.onload = () => {
                    console.log(this.canvas_node);
                    let canvas:any = this.canvas_node.get(0);
                    let cxt = canvas.getContext("2d");
                    let width = image.width;
                    let height = image.height;
                    canvas.width = width;
                    canvas.height = height;
                    cxt.clearRect(0, 0, width, height);
                    cxt.drawImage(image, 0, 0);
                };
            };
            reader.readAsDataURL(file);
        });

        for (var i in this.effects) {
            // $("body").append('<button id="' + this.effects[i].id + '">' + this.effects[i].name + '</button>');
            // ((i)=> {
            //     $("#" + this.effects[i].id).click(()=> {
            //         let canvas:any = this.canvas_node.get(0);
            //         this.effects[i].run(canvas);
            //     });
            // })(i);
        }
    }

}