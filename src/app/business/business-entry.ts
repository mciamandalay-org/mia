import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { HttpService } from '../httpservice';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BusinessModel } from './business';
import { Township } from '../township/township';
import { Message } from 'primeng/primeng';
import { City } from '../city/city';
import { CityEntry } from '../city/city-entry';
import { TownshipEntry } from '../township/township-entry';
import { BsModalComponent } from 'ng2-bs3-modal';
import { NgProgressService } from 'ng2-progressbar';
import {Observable} from 'rxjs';
import {BusinessType} from '../businesstype/businesstype';
import {IndustryType} from '../industrytype/industrytype';
import {Facility} from '../facility/facility';
import {BusinessBranch} from '../businessbranch/businessbranch';
import {businessFacility} from '../businessfacility/businessfacility';

@Component({
    selector: 'business-entry',
    templateUrl: 'business-entry.html',
})
export class BusinessEntry implements OnInit, OnDestroy {
    @Input() business;
    @Input() editMode;
    @Output() dialogEvent: EventEmitter<any>;
    @ViewChild('CityModal') CityModal: BsModalComponent;
    @ViewChild('TownshipModal') TownshipModal: BsModalComponent;
    @ViewChild('BusinessModal') BusinessModal: BsModalComponent;
    @ViewChild('IndustryModal') IndustryModal: BsModalComponent;

    @ViewChild('input') input;

    businesslist: any[];
    defaultBusiness: any;
    city: City;
    businessObj:BusinessType;
    industryObj:IndustryType;
    town: Township;
    Cities: any[] = [];
    businessArray:any[]=[];
   industryTypeArray:any[]=[];
    townships: any[] = [];
    msgs: Message[]=[];
    facilityData:Facility;
    selectedFacility:any[]=[];

    // tpacities: any[]=[];
    // tpaselectedCities:any = 1;

    facilitiesStringForViewMode: string = '';

    selectedFacilities: any[]=[];


    constructor(public httpservice: HttpService, public loca: Location, public acroute: ActivatedRoute, public route: Router, public pgService: NgProgressService) {
        this.defaultBusiness = new BusinessModel(
            UUID.UUID(),
            null,
            null,
            '',
            '',
            null,
            null,
            null,
            null,
            new Date(Date.now()),
            '',
            '',
            '',
            0,
            '',
            '',
            0,
            null,
            null,
            0,
            0,
            /*null*/[],
            /*null*/[],
            null,
            new Date(Date.now()),
            new Date(Date.now()),
            '',
            0
        );
        this.dialogEvent = new EventEmitter<any>();

        //this.tpacities = [{label:'MDY',value:1},{label:'YGN',value:2},{label:'TGG',value:3},{label:'SGG',value:4}]
        
                // this.tpaselectedCities.push(this.tpacities[0])
                // this.tpaselectedCities.push(this.tpacities[2])
                //this.tpaselectedCities=null;
    }


    ngOnInit() {
        // this.getForAutoCompleteData();
        this.getBusinessType().then(c => {
            this.businessArray=c;
        });
        this.getIndustryType().then(c => {
            this.industryTypeArray=c;
        })
        this.getCity().then(c => {
            this.Cities = c;
                    });
        this.getTownShip().then(t => {
            this.townships = t;
        });
        this.getFacility().then(f => {
            console.log('#In OnInit/after getFacility/ f is ',f)
            this.facilityData=f;
        })
        if (this.business.foundedDate !== null) {
            this.business.foundedDate = new Date(this.business.foundedDate);
        }
        if(this.editMode){
            let tmp = Observable.timer(1000).subscribe(
                t => {this.input.nativeElement.focus()},
                err => {},
                () => {tmp.unsubscribe();}
            )
        }

        // this.tpacities = [{label:'MDY',value:1},{label:'YGN',value:2},{label:'TGG',value:3},{label:'SGG',value:4}]

        // this.tpaselectedCities.push(this.tpacities[0])
        // this.tpaselectedCities.push(this.tpacities[2])

        //this.tpaselectedCities=1;
        //console.log('#In OnInit/ this.tpaselectedCities is ', this.tpaselectedCities)
        //console.log('#In OnInit/this.business.businessFacility is ',this.business.businessFacility)
        if(this.business.businessFacility.length > 0){
            for(let i=0; i < this.business.businessFacility.length; i++){
                this.facilitiesStringForViewMode+=this.business.businessFacility[i].facility.name;
                if(i+1 !== this.business.businessFacility.length) this.facilitiesStringForViewMode+=', ';

                this.selectedFacilities.push(this.business.businessFacility[i].facility);
            }
            //console.log('this.facilitiesStringForViewMode is ', this.facilitiesStringForViewMode)
            console.log('this.selectedFacilities is ', this.selectedFacilities)
        }
    }

    ngOnChanges(event) {
        //console.log('OnChanges')
        if (this.business.foundedDate !== null) {
            this.business.foundedDate = new Date(this.business.foundedDate);
        }
    }

    ngOnDestroy() {}

    SaveData() {
        if (this.business.name === '') {
            window.alert('There is no business !\nPlease, input data.')
            this.dialogEvent.emit('close only')
            return;
        }

        for(let obj of this.selectedFacilities){
            this.business.businessFacility.push(new businessFacility(UUID.UUID(), this.business.businessId, obj.facilityId, obj, this.business.appUserId, this.business.entryDate, this.business.modifiedDate, this.business.remark, this.business.recordStatus));
        }

        this.pgService.start();
        console.log('#In SaveData/ this.business.businessFacility is ', this.business.businessFacility)
        this.httpservice.postData('business', this.business).then(rps => {
            //console.log("######facility", this.business.businessFacility);
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Success Dialog', detail: 'Successfully Saved'});
            this.dialogEvent.emit('');
        }).catch(err => {
            this.msgs = [];
            this.msgs.push({severity:'error', summary:'Error Dialog', detail: 'Error occurs while saving business data: '+ err});
        });
    }

    closeBusinessForm() {
        this.dialogEvent.emit('close only');
    }

    getCity(): Promise<any> {
        return new Promise((resolve, reject) => {
            let cities = [];
            this.pgService.start();
            this.httpservice.getData('city').then(cdata => {
                this.pgService.done();
                cities.push({ label: '- Select a city -', value: null });
                cities.push({ label: 'Add New City', value: -1 });
                cdata.forEach(element => {
                    cities.push({ label: element.name, value: element.cityId });
                });
                resolve(cities);
            }).catch(err => reject([]));
        });
    }

    getTownShip(): Promise<any> {
        return new Promise((resolve, reject) => {
            let townships = [];
            this.pgService.start();
            this.httpservice.getData('township').then(cdata => {
                this.pgService.done();
                townships.push({ label: '- Select a township -', value: null });
                townships.push({ label: 'Add New Township', value: -1 });
                cdata.forEach(element => {
                    townships.push({ label: element.name, value: element.townshipId });
                });
                resolve(townships);
            }).catch(err => reject([]));
        });
    }

    getFacility(): Promise<any> {
        return new Promise((resolve, reject) => {
            let facilityTemp = [];
            this.pgService.start();
            this.httpservice.getData('facility').then(cdata => {
                this.pgService.done();
                cdata.forEach(element => {
                    //facilityTemp.push({ label: element.name, value: element.facilityId });
                    facilityTemp.push({ label: element.name, value: element });
                });
                resolve(facilityTemp);
            }).catch(err => reject([]));
        });
    }

    onChangeCity(event) {
        if (event.value === null) return;

        if (event.value === -1) {
            this.CityModal.open();
            this.city = null;
        }
        else {
            this.pgService.start();
            this.httpservice.getData('city/' + event.value).then(cdata => {
                this.pgService.done();
                this.business.homeCityId = event.value;
                this.business.homeCity = cdata;
            })
        }
    }


    onChangeTownship(event) {
        if (event.value === null) return;

        if (event.value === -1) {
            this.TownshipModal.open();
            this.town = null;
        }
        else {
            this.pgService.start();
            this.httpservice.getData('township/' + event.value).then(cdata => {
                this.pgService.done();
                this.business.homeTownshipId = event.value;
                this.business.homeTownship = cdata;
            })
        }
    }

    onChangeFacility(event) {
        console.log("#In onChangeFacility/ event is ", event);
        
        console.log('#In onChangeFacility/this.selectedFacilities is ',this.selectedFacilities)

        

        // if (event.value[0] === null) return;
        // else {
        //     this.httpservice.getData('facility/' + event.value[0]).then(cdata => {
        //         console.log("uuuuuuuuu  cdata", cdata);
        //         this.business.facilityId = event.value;
        //         this.business.businessFacility = cdata;
        //     })
        // }
        // this.business.businessFacility = event.value;

        // console.log('#In onChangeFacility/ after assign/ this.business.businessFacility is ', this.business.businessFacility)


    }

    showCityDialog(city) {

        this.CityModal.open();
        this.city = city.value;
    }

    showTownshipDialog(town) {
        this.TownshipModal.open();
        this.town = town.value;
    }

    //home city
    CityDialogResult(dialogAction) {
        this.CityModal.close();
        this.city = undefined;

        if (dialogAction != null) {
            let nativeCityId = this.business.nativeCityId;

            this.business.nativeCityId = null;
            this.business.homeCityId = null;

            this.getCity().then(c => {

                this.Cities = c;

                this.business.nativeCityId = nativeCityId;
                this.business.homeCityId = dialogAction;
            });
        }
    }



    //township
    townshipDialogResult(dialogAction) {
        this.TownshipModal.close();
        this.town = undefined;

        if (dialogAction != null) {

            this.business.homeTownshipId = null;
            this.getTownShip().then(t => {
                this.townships = t;
                this.business.homeTownshipId = dialogAction;
            })
        }
    }

    EditClick() {
        this.editMode = true;
        if(this.editMode){
            let tmp = Observable.timer(20).subscribe(
                t => {this.input.nativeElement.focus()},
                err => {},
                () => {tmp.unsubscribe();}
            )
        }
    }



    changeViewMode() {
        this.editMode = false;
    }
    onChangeBusiness(event){
        if (event.value === null) return;

                if (event.value === -1) {
                    this.BusinessModal.open();
                    this.businessObj = null;
                }
                else {
                    this.pgService.start();
                    this.httpservice.getData('businessType/' + event.value).then(cdata => {
                        this.pgService.done();
                        this.business.businessTypeId = event.value;
                        this.business.businessType = cdata;
                    })
                }

    }
    getBusinessType(): Promise<any> {
        return new Promise((resolve, reject) => {
            let businessTemp = [];
            this.pgService.start();
            this.httpservice.getData('businessType').then(cdata => {
                this.pgService.done();
                businessTemp.push({ label: '-Select a  Business-', value: null });
                businessTemp.push({ label: 'Add New Business', value: -1 });
                cdata.forEach(element => {
                    businessTemp.push({ label: element.name, value: element.businessTypeId });
                });
                resolve(businessTemp);
            }).catch(err => reject([]));
        });
    }
    showBusinessDialog(businessData){
        this.BusinessModal.open();
        this.businessObj=businessData.value;
    }
    businessDialogResult(dialogAction) {
        this.BusinessModal.close();
        this.businessObj = undefined;

        if (dialogAction != null) {

            this.business.businessTypeId = null;
            this.getBusinessType().then(t => {
                this.businessArray = t;
                this.business.businessTypeId = dialogAction;
            })
        }
    }

    industryDialogResult(dialogAction){
        this.IndustryModal.close();
        this.industryObj = undefined;

        if (dialogAction != null) {

            this.business.industryTypeId = null;
            this.getIndustryType().then(t => {
                this.industryTypeArray = t;
                this.business.industryTypeId = dialogAction;
            })
        }

    }
    onChangeIndustry(event){
        if (event.value === null) return;

                if (event.value === -1) {
                    this.IndustryModal.open();
                    this.industryObj = null;
                }
                else {
                    this.pgService.start();
                    this.httpservice.getData('industryType/' + event.value).then(cdata => {
                        this.pgService.done();
                        this.business.industryTypeId = event.value;
                        this.business.industryType = cdata;
                    })
                }
    }
    getIndustryType(): Promise<any> {
        return new Promise((resolve, reject) => {
            let industryTemp = [];
            this.pgService.start();
            this.httpservice.getData('industryType').then(cdata => {
                this.pgService.done();
                industryTemp.push({ label: '-Select a  Industry-', value: null });
                industryTemp.push({ label: 'Add New Industry', value: -1 });
                cdata.forEach(element => {
                    industryTemp.push({ label: element.name, value: element.industryTypeId });
                });
                resolve(industryTemp);
            }).catch(err => reject([]));
        });
    }
    showIndustryDialog(industry){
        this.IndustryModal.open();
        this.industryObj=industry.value;
    }

}