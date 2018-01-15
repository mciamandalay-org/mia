import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'primeng/primeng';
import { HttpService } from '../httpservice';
import { IndustryType } from '../industrytype/industrytype';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { NgProgressService } from 'ng2-progressbar';
@Component({

    selector: "industrytype-entry",
    templateUrl: "industrytype-entry.html"
})
export class Industry implements OnInit, OnDestroy {
    @Input() industryinput;
    @Input() industryInputDialog;
    @Output() industryOutput: EventEmitter<any>;
    @ViewChild('input') input;
    industrytype: any;
    sub: any;
    tempId: string = '';
    msgs: Message[] = [];

    constructor(public httpservice: HttpService, public acroute: ActivatedRoute, public pgService: NgProgressService, public location: Location,public route:Router) {
        this.industrytype = new IndustryType(UUID.UUID(), '', null, new Date(Date.now()), new Date(Date.now()), '', 0);
        this.industryOutput = new EventEmitter<any>();

        this.sub = this.acroute.params.subscribe(param => {
            if (param['businessFacilityId'] !== undefined) {
                this.tempId = param['businessFacilityId'];
                this.httpservice.getData('industrytype/' + this.tempId).then(responseData => {
                    this.industrytype = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }

        });

    }

    ngOnInit() {
        if (this.industryinput !== null) {
            if (this.industryinput
                !== undefined) {
                this.pgService.start();
                this.httpservice.getData('industrytype/' + this.industryinput).then(industrydata => {
                    this.pgService.done();
                    this.industrytype = industrydata;
                }).catch(err => console.log('Err occurs:' + err))
            };
        }
        let tmp = Observable.timer(1000).subscribe(data => {
            this.input.nativeElement.focus()
        },
            err => { },
            () => { tmp.unsubscribe() }
        );
    }

    ngOnDestroy() {
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    }

    goBack() {
        if(this.industryInputDialog){
            this.industryOutput.emit(null);
        }else{
        this.location.back();
        }
    }

    SaveData() {
        this.pgService.start();
        this.httpservice.postData('industrytype', this.industrytype).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.industryInputDialog ? this.industryOutput.emit(this.industrytype.industryTypeId):this.route.navigate(['BusinessTable/']);
        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving industry: ' + err }));
    }

    DeleteData() {
        this.pgService.start();
        this.httpservice.deleteData('industrytype', this.industrytype.industryTypeId).then(rps => {
            this.pgService.done();
            this.industryInputDialog ?  this.industryOutput.emit('deleted'):this.route.navigate(['BusinessTable/']);

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting industry data' });
        });
    }

}