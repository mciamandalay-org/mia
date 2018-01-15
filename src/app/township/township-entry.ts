import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute } from '@angular/router';
import { Township } from '../township/township';
import { HttpService } from '../httpservice';
import { NgProgressService } from 'ng2-progressbar';
import { Message } from 'primeng/primeng';
import {Observable} from 'rxjs';

@Component({
    selector: 'township-entry',
    templateUrl: 'township-entry.html'
})

export class TownshipEntry implements OnInit, OnDestroy {
    @Input() townshipEmitDialog;
    @Input() townshipInput;
    @Output() townshipOutput: EventEmitter<any>;
    @ViewChild('input') input;
   
    township: any;
    sub: any;
    tempId: string = '';

    msgs: Message[]= [];

    constructor(public httpservice: HttpService, public location: Location, public acroute: ActivatedRoute, public route: Router, public pgService: NgProgressService) {
        this.township = new Township(UUID.UUID(), '', null, new Date(Date.now()), new Date(Date.now()), '', 0);
        this.townshipOutput = new EventEmitter<any>();

        this.sub = this.acroute.params.subscribe(param => {
            if (param['townshipId'] !== undefined) {
                this.tempId = param['townshipId'];
                this.httpservice.getData('township/' + this.tempId).then(responseData => {
                    this.township = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
        });
    }

    ngOnInit() {
        if(this.townshipInput !== null){
            if (this.townshipInput !== undefined) {
                this.pgService.start();
                this.httpservice.getData('township/' + this.townshipInput).then(townshipdata => {
                    this.pgService.done();
                    this.township = townshipdata;
                }).catch(err => console.log('Err occurs:' + err))
            };
        }

        let tmp = Observable.timer(1000).subscribe(data=>{this.input.nativeElement.focus()}, err=>{},()=>{tmp.unsubscribe()})
    }

    ngOnDestroy() {
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    }
    goBack() {
        if (this.townshipEmitDialog) {
            this.townshipOutput.emit(null);
        } else {
            this.location.back();
        }
    }

    SaveData() {
        this.pgService.start();
        this.httpservice.postData('township', this.township).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.townshipEmitDialog ? this.townshipOutput.emit(this.township.townshipId) : this.route.navigate(['personTable/']);
        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving township: ' + err })
        });
    }

    DeleteData() {
        this.pgService.start();
        this.httpservice.deleteData('township', this.township.townshipId).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Success Dialog', detail: 'Successfully deleted'});
            this.townshipEmitDialog ? this.townshipOutput.emit('deleted') : this.route.navigate(['personTable/']);

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({severity:'error', summary:'Error Dialog', detail: 'Error occurs while deletig township data.'})
        });
    }

}