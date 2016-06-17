abstract class Base {

    public style = {
        fillStyle: "#000000",
        strokeStyle: "#000000",
        shadowColor: "#000000",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        lineCap: "butt",
        lineJoin: "miter",
        lineWidth: 1,
        miterLimit: 10,
    };

    abstract update(ms:number);


}
