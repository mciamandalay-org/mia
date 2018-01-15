import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'primeng/primeng';
import { HttpService } from '../httpservice';
import { BusinessType } from '../businesstype/businesstype';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { NgProgressService } from 'ng2-progressbar';
@Component({

    selector: "businesstype-entry",
    templateUrl: "businesstype-entry.html"    
})
export class Business implements OnInit,OnDestroy{
    @Input() businessinput;
    @Input() businessInputDialog;
    @Output() businessOutput: EventEmitter<any>;
    @ViewChild('input') input;
    businesstype:any;
    sub:any;
    tempId: string = '';
    msgs: Message[]=[];

    constructor(public httpservice: HttpService,public acroute: ActivatedRoute,public pgService: NgProgressService,public location: Location,public route:Router){
        this.businesstype=new BusinessType(UUID.UUID(), '', null, new Date(Date.now()), new Date(Date.now()), '', 0);
        this.businessOutput=new EventEmitter<any>();

        this.sub=this.acroute.params.subscribe(param=>{
            if(param['businessFacilityId']!== undefined){
                this.tempId=param['businessFacilityId'];
                this.httpservice.getData('businesstype/' + this.tempId).then(responseData => {
                    this.businesstype = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
            
        });

    }

    ngOnInit(){
        if (this.businessinput !== null) {
            if (this.businessinput
                 !== undefined) {
                this.pgService.start();
                this.httpservice.getData('businesstype/' + this.businessinput).then(businessdata => {
                    this.pgService.done();
                    this.businesstype = businessdata;
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
        if(this.businessInputDialog){
            this.businessOutput.emit(null);
        }else{
            this.location.back();
        }
        
    }
    
    SaveData(){
        this.pgService.start();
        this.httpservice.postData('businesstype', this.businesstype).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.businessInputDialog? this.businessOutput.emit(this.businesstype.businessTypeId): this.route.navigate(['BusinessTable/']);
        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving business: ' + err }));
    }   
    
    DeleteData(){
        this.pgService.start();
        this.httpservice.deleteData('businesstype', this.businesstype.businessTypeId).then(rps => {
            this.pgService.done();
            this.businessInputDialog? this.businessOutput.emit('deleted'): this.route.navigate(['BusinessTable/']);

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting business data' });
        });
    }

}