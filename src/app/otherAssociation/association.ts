export class Association{
    constructor(
        public otherAssociationId ?:string,
        public name?:string,
        public appUserId?:string,
        public entryDate?:Date,
        public modifiedDate?:Date,
        public remark?:string,
        public recordStatus?:number
       
    ){}
}