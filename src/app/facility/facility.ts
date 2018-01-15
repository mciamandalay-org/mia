
export class Facility {
    constructor(
        public facilityId?: string,
        public name?: string,
        public appUserId?:string,
        public entryDate?:Date,
        public modifiedDate?:Date,
        public remark?:string,
        public recordStatus?:number
    ) { }

}