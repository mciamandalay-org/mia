export class Township{
    constructor(
        public townshipId?:string,
        public name?:string,
        public appUserId?:string,
        public entryDate?:Date,
        public modifiedDate?:Date,
        public remark?:string,
        public recordStatus?:number
    ){}
}