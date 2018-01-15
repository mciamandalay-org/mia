import { City } from '../city/city';
import { Township } from '../township/township';

export class Person {
    constructor(
        public personId?: string,
        public name?: string,
        public fatherName?: string,
        public motherName?: string,
        public nrc?: string,
        public dateOfBirth?: Date,
        public race?: string,
        public nationality?: string,
        public religion?: string,
        public gender?: number,
        public homeAddress?: string,
        public homeCityId?: string,

        public homeCity?: City,
        public homeTownshipId?: string,
        public homeTownship?: string,
        public mobilePhone?: string,
        public phone?: string,
        public email?: string,
        public education?: string,
        public professional?: string,
        public biography?: string,
        public nativeCityId?: string,
        public nativeCity?: City,
        public photo?: string,
        public appUserId?: string,
        public entryDate?: Date,
        public modifiedDate?: Date,
        public remark?: string,
        public recordStatus?: number,

    ) { }
}