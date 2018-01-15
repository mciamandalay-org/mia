export class IndustryType {
    constructor(
        public industryTypeId?: string,
        public name?: string,
        public appUserId?:string,
        public entryDate?:Date,
        public modifiedDate?:Date,
        public remark?:string,
        public recordStatus?:number
    ) { }
}