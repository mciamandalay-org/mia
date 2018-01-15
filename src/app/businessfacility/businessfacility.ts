import { Facility } from '../facility/facility';
export class businessFacility {
    constructor(
        public businessFacilityId?: string,
        public businessId?: string,
        public facilityId?: string,
        public facility?: Facility,
        public appUserId?:string,
        public entryDate?:Date,
        public modifiedDate?:Date,
        public remark?:string,
        public recordStatus?:number
    ) { }
}


