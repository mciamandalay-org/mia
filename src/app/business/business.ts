import { BusinessType } from '../businesstype/businesstype';
import { City } from '../city/city';
import { Township } from '../township/township';
import { BusinessBranch } from '../businessbranch/businessbranch';
import { IndustryType } from '../industrytype/industrytype';
import { businessFacility } from '../businessfacility/businessfacility';
export class BusinessModel {
    constructor(
        public businessId?: string,

        public businessTypeId?: string,
        public businessType?: BusinessType,

        public name?: string,
        public address?: string,

        public cityId?: string,
        public city?: City,

        public townshipId?: string,
        public township?: Township,

        public foundedDate?: Date,
        public licenseNumber?: string,
        public otherLicense?: string,
        public typeOfOwnership?: string,
        public numberOfEmployee?: number,
        public website?: string,
        public email?: string,
        public fax?: number,

        public industryTypeId?: string,
        public industryType?: IndustryType,

        public capital?: number,// decimal????
        public annualIncome?: number, //decimal???

        public businessBranch?: BusinessBranch[],
        public businessFacility?: businessFacility[],
        public appUserId?:string,
        public entryDate?:Date,
        public modifiedDate?:Date,
        public remark?:string,
        public recordStatus?:number



    ) { }
}





