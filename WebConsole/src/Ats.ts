class _Ats {

    private fcs:Array<Function> = [];

    public then(fc:Function):_Ats {
        this.fcs.unshift(fc);
        return this;
    }

    public next(...args:any[]) {

        let fc = this.fcs.pop();
        if (fc)fc.apply(this, args);
    }

}

export function Ats(func:Function) {
    let ats = new _Ats();
    func(ats);
    ats.next();

}