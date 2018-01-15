import { City } from '../city/city';
import { Township } from '../township/township';
export class BusinessBranch {
    constructor(
        public businessBranchId?: string,
        public businessId?: string,
        public name?: string,
        public address?: string,
        public cityId?: string,
        public city?: City,
        public townshipId?: string,
        public township?: Township,
        public phone?: string,
        public locLat?: number,
        public locLong?: number,
        public appUserId?:string,
        public entryDate?:Date,
        public modifiedDate?:Date,
        public remark?:string,
        public recordStatus?:number
    ) { }
}

