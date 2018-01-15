import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { HttpService } from '../httpservice';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Person } from './person';
import { Township } from '../township/township';
import { Message } from 'primeng/primeng';
import { City } from '../city/city';
import { CityEntry } from '../city/city-entry';
import { TownshipEntry } from '../township/township-entry';
import { BsModalComponent } from 'ng2-bs3-modal';
import { NgProgressService } from 'ng2-progressbar';
import {Observable} from 'rxjs';

@Component({
    selector: 'person-entry',
    templateUrl: 'person-entry.html',
})
export class PersonEntry implements OnInit, OnDestroy {
    @Input() person;
    @Input() editMode;
    @Output() dialogEvent: EventEmitter<any>;
    @ViewChild('homeCityModal') homeCityModal: BsModalComponent;
    @ViewChild('homeTownshipModal') homeTownshipModal: BsModalComponent;
    @ViewChild('NativeCityModal') NativeCityModal: BsModalComponent;
    @ViewChild('fileInput') fileInput;
    @ViewChild('input') input;

    personlist: any[];
    defaultPerson: any;
    city: City;
    native: City;
    town: Township;
    homeCities: any[] = [];
    nativeCities: any[] = [];
    townships: any[] = [];
    msgs: Message[]=[];

    religions:any[]=[];
    nationalities:any[]=[];
    races:any[]=[];

    filteredReligions: any[]=[];
    filteredNations: any[]=[];
    filteredRaces: any[]=[];

    constructor(public httpservice: HttpService, public loca: Location, public acroute: ActivatedRoute, public route: Router, public pgService: NgProgressService) {
        this.defaultPerson = new Person(UUID.UUID(), '', '', '', '', null, '', '',
            '', 1, '', null, null, null, null, '', '', '', '', '', '', null, null, '', null,
            new Date(Date.now()), new Date(Date.now()), '', 1);

        this.dialogEvent = new EventEmitter<any>();
    }

    getForAutoCompleteData(){
        this.pgService.start();
        this.httpservice.getData('person').then(persondata => {
            let tmp = persondata;
            let _relig = '';
            let _nation = '';
            let _race = '';

            tmp.forEach(element => {
                if(_relig !== element.religion){
                    if(element.religion !== ''){
                        if(element.religion !== null){
                            this.religions.push(element.religion);   
                        }
                    }
                }
                if(_nation !== element.nationality){
                    if(element.nationality !== ''){
                        if(element.nationality !== null){
                            this.nationalities.push(element.nationality);
                        }
                    }
                }
                if(_race !== element.race) {
                    if(element.race !== ''){
                        if(element.race !== null){
                        this.races.push(element.race);
                        }
                    }
                }

                _relig = element.religion;
                _nation = element.nationality;
                _race = element.race;
            });

            this.pgService.done();
        })
    }


    ngOnInit() {
        this.getForAutoCompleteData();
        this.getCity().then(c => {
            this.homeCities = c;
            this.nativeCities = c;
        });
        this.getTownShip().then(t => {
            this.townships = t;
        });
        if (this.person.dateOfBirth !== null) {
            this.person.dateOfBirth = new Date(this.person.dateOfBirth);
        }
        if(this.editMode){
            let tmp = Observable.timer(1000).subscribe(
                t => {this.input.nativeElement.focus()},
                err => {},
                () => {tmp.unsubscribe();}
            )
        }
    }

    ngOnChanges(event) {
        //console.log('OnChanges')
        if (this.person.dateOfBirth !== null) {
            this.person.dateOfBirth = new Date(this.person.dateOfBirth);
        }
    }

    ngOnDestroy() {}

    SaveData() {
        if (this.person.name === '') {
            window.alert('There is no person !\nPlease, input data.')
            this.dialogEvent.emit('close only')
            return;
        }

        this.pgService.start();
        this.httpservice.postData('person', this.person).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Success Dialog', detail: 'Successfully Saved'});
            this.dialogEvent.emit('');
        }).catch(err => {
            this.msgs = [];
            this.msgs.push({severity:'error', summary:'Error Dialog', detail: 'Error occurs while saving person data: '+ err});
        });
    }

    closePersonForm() {
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

    onChangeHomeCity(event) {
        if (event.value === null) return;

        if (event.value === -1) {
            this.homeCityModal.open();
            this.city = null;
        }
        else {
            this.pgService.start();
            this.httpservice.getData('city/' + event.value).then(cdata => {
                this.pgService.done();
                this.person.homeCityId = event.value;
                this.person.homeCity = cdata;
            })
        }
    }

    onChangeNativeCity(event) {
        if (event.value === null) return;

        if (event.value === -1) {
            this.NativeCityModal.open();
            this.native = null;
        }
        else {
            this.pgService.start();
            this.httpservice.getData('city/' + event.value).then(cdata => {
                this.pgService.done();
                this.person.nativeCityId = event.value;
                this.person.nativeCity = cdata;
            })
        }
    }

    onChangeTownship(event) {
        if (event.value === null) return;

        if (event.value === -1) {
            this.homeTownshipModal.open();
            this.town = null;
        }
        else {
            this.pgService.start();
            this.httpservice.getData('township/' + event.value).then(cdata => {
                this.pgService.done();
                this.person.homeTownshipId = event.value;
                this.person.homeTownship = cdata;
            })
        }
    }
    showHomeCityDialog(city) {
        // console.log('#In showHomeCityDialog/ city is ', city)
        this.homeCityModal.open();
        this.city = city.value;
    }

    showNativeCityDialog(data) {
        this.NativeCityModal.open();
        this.native = data.value;
    }

    showHomeTownshipDialog(town) {
        this.homeTownshipModal.open();
        this.town = town.value;
    }

    //home city 
    homeCityDialogResult(dialogAction) {
        this.homeCityModal.close();
        this.city = undefined;

        if (dialogAction != null) {
            let nativeCityId = this.person.nativeCityId;

            this.person.nativeCityId = null;
            this.person.homeCityId = null;

            this.getCity().then(c => {
                this.nativeCities = c;
                this.homeCities = c;

                this.person.nativeCityId = nativeCityId;
                this.person.homeCityId = dialogAction;
            });
        }
    }

    nativeCityDialogResult(dialogAction) {
        this.NativeCityModal.close();
        this.native = undefined;
        
        if (dialogAction != null) {
            let homeCityId = this.person.homeCityId;

            this.person.nativeCityId = null;
            this.person.homeCityId = null;

            this.getCity().then(c => {
                this.nativeCities = c;
                this.homeCities = c;

                this.person.nativeCityId = dialogAction;
                this.person.homeCityId = homeCityId;
            });
        }
    }

    //township
    townshipDialogResult(dialogAction) {
        this.homeTownshipModal.close();
        this.town = undefined;

        if (dialogAction != null) {

            this.person.homeTownshipId = null;
            this.getTownShip().then(t => {
                this.townships = t;
                this.person.homeTownshipId = dialogAction;
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

    uploadPhoto(event) {
        this.person.photo = event.target.files[0];
        let reader = new FileReader();
        reader.onload = (e: any) => {
            this.person.photo = e.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    removePhoto() {
        this.person.photo = '';
    }

    changeViewMode() {
        this.editMode = false;
    }

    filterRaces(event){
        this.filteredRaces = [];
        for(let i = 0; i < this.races.length; i++) {
            let tmprace = this.races[i];
            if(tmprace.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredRaces.push(tmprace);
            }
        }
    }

    filterNations(event){
        this.filteredNations = [];
        for(let i = 0; i < this.nationalities.length; i++) {
            let tmpnation = this.nationalities[i];
            if(tmpnation.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredNations.push(tmpnation);
            }
        }
    }

    filterReligions(event){
        this.filteredReligions = [];
        for(let i = 0; i < this.religions.length; i++) {
            let tmpreligion = this.religions[i];
            if(tmpreligion.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredReligions.push(tmpreligion);
            }
        }
    }
    
}