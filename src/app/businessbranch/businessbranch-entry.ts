import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'primeng/primeng';
import { HttpService } from '../httpservice';
import { BusinessBranch} from '../businessbranch/businessbranch';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { NgProgressService } from 'ng2-progressbar';
@Component({

    selector: "businessbranch-entry",
    templateUrl: "businessbranch-entry.html"    
})
export class BusinessBranchClass implements OnInit,OnDestroy{
    @Input() businessBranchInput;
    @Output() businessBranchOutput: EventEmitter<any>;
    @ViewChild('bussinessName') bussinessName;
    businessbranch:any;
    sub:any;
    tempId: string = '';
    msgs: Message[]=[];


    constructor(public httpservice: HttpService,public acroute: ActivatedRoute,public pgService: NgProgressService,public location: Location){
        this.businessbranch=new BusinessBranch(UUID.UUID(), null, '', '', null, null, null, null, '', null, null, null, new Date(Date.now()), new Date(Date.now()), '', 0 );
        this.businessBranchOutput=new EventEmitter<any>();

        this.sub=this.acroute.params.subscribe(param=>{
            if(param['businessFacilityId']!== undefined){
                this.tempId=param['businessFacilityId'];
                this.httpservice.getData('businessbranch/' + this.tempId).then(responseData => {
                    this.businessbranch = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
            
        });

    }

    ngOnInit(){
        if (this.businessBranchInput !== null) {
            if (this.businessBranchInput
                 !== undefined) {
                this.pgService.start();
                this.httpservice.getData('businessbranch/' + this.businessBranchInput).then(businessBranchdata => {
                    this.pgService.done();
                    this.businessbranch = businessBranchdata;
                }).catch(err => console.log('Err occurs:' + err))
            };
        }
        let tmp = Observable.timer(1000).subscribe(data => { 
            this.bussinessName.nativeElement.focus() }, 
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
        this.httpservice.postData('businessbranch', this.businessbranch).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.businessBranchOutput.emit(this.businessbranch.businessTypeId);
        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving business Branch: ' + err }));
    }   
    
    DeleteData(){
        this.pgService.start();
        this.httpservice.deleteData('businessbranch', this.businessbranch.businessTypeId).then(rps => {
            this.pgService.done();
            this.businessBranchOutput.emit('deleted');

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting business branch data' });
        });
    }

}