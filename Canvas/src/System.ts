class System {

    public static x:number = (new Date()).valueOf();
    public static y:number = 362436069;
    public static z:number = 521288629;

    public static rand(min, max) {
        let t;
        System.x ^= System.x << 16;
        System.x ^= System.x >> 5;
        System.x ^= System.x << 1;
        t = System.x;
        System.x = System.y;
        System.y = System.z;
        System.z = t ^ System.x ^ System.y;
        let rand = Math.abs(System.z);
        return rand % (max + 1 - min) + min;
    }

    public static isNumber(obj) {
        return obj === +obj
    }


}