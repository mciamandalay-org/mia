import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'primeng/primeng';
import { HttpService } from '../httpservice';
import { businessFacility  } from '../businessfacility/businessfacility';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { NgProgressService } from 'ng2-progressbar';
@Component({

    selector: "businessfacility-entry",
    templateUrl: "businessfacility-entry.html"    
})
export class businessFacilityCalss implements OnInit,OnDestroy{
    @Input() businessfacilityinput;
    @Output() businessfacilityOutput: EventEmitter<any>;
    @ViewChild('input') input;
    businessfacility:any;
    sub:any;
    tempId: string = '';
    msgs: Message[]=[];

    constructor(public httpservice: HttpService,public acroute: ActivatedRoute,public pgService: NgProgressService,public location: Location){
        this.businessfacility=new businessFacility(UUID.UUID(), null, null, null, null, new Date(Date.now()), new Date(Date.now()), '', 0);
        this.businessfacilityOutput=new EventEmitter<any>();

        this.sub=this.acroute.params.subscribe(param=>{
            if(param['businessFacilityId']!== undefined){
                this.tempId=param['businessFacilityId'];
                this.httpservice.getData('businessfacility/' + this.tempId).then(responseData => {
                    this.businessfacility = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
            
        });

    }

    ngOnInit(){
        if (this.businessfacilityinput !== null) {
            if (this.businessfacilityinput
                 !== undefined) {
                this.pgService.start();
                this.httpservice.getData('businessfacility/' + this.businessfacilityinput).then(businessfacilitydata => {
                    this.pgService.done();
                    this.businessfacility = businessfacilitydata;
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
        this.httpservice.postData('businessfacility', this.businessfacility).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.businessfacilityOutput.emit(this.businessfacility.businessTypeId);
        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving business facility: ' + err }));
    }   
    
    DeleteData(){
        this.pgService.start();
        this.httpservice.deleteData('businessfacility', this.businessfacility.businessTypeId).then(rps => {
            this.pgService.done();
            this.businessfacilityOutput.emit('deleted');

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting business  facility data' });
        });
    }

}