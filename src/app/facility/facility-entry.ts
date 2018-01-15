import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'primeng/primeng';
import { HttpService } from '../httpservice';
import { Facility } from '../facility/facility';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { NgProgressService } from 'ng2-progressbar';
@Component({

    selector: "facility-entry",
    templateUrl: "facility-entry.html"    
})
export class FacilityType implements OnInit,OnDestroy{
    @Input() facilityInput;
    @Output() facilityOuput: EventEmitter<any>;
    @ViewChild('input') input;
    facility:any;
    sub:any;
    tempId: string = '';
    msgs: Message[]=[];

    constructor(public httpservice: HttpService,public acroute: ActivatedRoute,public pgService: NgProgressService,public location: Location){
        this.facility=new Facility(UUID.UUID(), '', null, new Date(Date.now()), new Date(Date.now()), '', 0);
        this.facilityOuput=new EventEmitter<any>();

        this.sub=this.acroute.params.subscribe(param=>{
            if(param['facilityId']!== undefined){
                this.tempId=param['facilityId'];
                this.httpservice.getData('facility/' + this.tempId).then(responseData => {
                    this.facility = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
            
        });

    }

    ngOnInit(){
        if (this.facilityInput !== null) {
            if (this.facilityInput !== undefined) {
                this.pgService.start();
                this.httpservice.getData('facility/' + this.facilityInput).then(facilitydata => {
                    this.pgService.done();
                    this.facility = facilitydata;
                }).catch(err => console.log('Err occurs:' + err))
            };
        }
        let tmp = Observable.timer(1000).subscribe(data => { 
            this.input.nativeElement.focus() }, 
            err => { }, 
            () => { tmp.unsubscribe() }
        );
    }

    ngOnDestroy(){
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    }

    goBack(){
        this.location.back();
    }
    
    SaveData(){
        this.pgService.start();
        this.httpservice.postData('facility', this.facility).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.facilityOuput.emit(this.facility.facilityId);
        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving facility: ' + err }));
    }   
    
    DeleteData(){
        this.pgService.start();
        this.httpservice.deleteData('facility', this.facility.facilityId).then(rps => {
            this.pgService.done();
            this.facilityOuput.emit('deleted');

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting facility data' });
        });
    }

}