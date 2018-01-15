import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute } from '@angular/router';
import { Association} from '../otherAssociation/association';
import { HttpService } from '../httpservice';
import { NgProgressService } from 'ng2-progressbar';
import { Message } from 'primeng/primeng';
import { Observable } from 'rxjs';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'association-entry',
    templateUrl: 'association-entry.html'
})
export class AssociationEntry implements OnInit, OnDestroy {
    @Input() associationEmitDialog;
    @Input() associationInput;
    @Output() associationOutput: EventEmitter<any>;
    @ViewChild('input') input;
    @ViewChild('associationModal') associationModal: BsModalComponent;

    association: any;
    sub: any;
    tempId: string = '';
    msgs: Message[] = [];

    constructor(public httpservice: HttpService, public location: Location, public acroute: ActivatedRoute, public route: Router, public pgService: NgProgressService) {
        this.association = new Association(UUID.UUID(),"",null,new Date(Date.now()), new Date(Date.now()), '', 0);
        this.associationOutput = new EventEmitter<any>();

        this.sub = this.acroute.params.subscribe(param => {
            if (param['otherAssociationId'] !== undefined) {
                this.tempId = param['otherAssociationId'];
                this.httpservice.getData('otherAssociation/' + this.tempId).then(responseData => {
                    this.association = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
        });
    }
    ngOnInit() {
        //console.log('#In city entry/ this.cityInput is ', this.cityInput)
        if (this.associationInput !== null) {
            if (this.associationInput !== undefined) {
                this.pgService.start();
                this.httpservice.getData('otherAssociation/' + this.associationInput).then(associationdata => {
                    this.pgService.done();
                    this.association = associationdata;
                }).catch(err => console.log('Err occurs:' + err))
            };
        }
        //let tmp = Observable.timer(1000).subscribe(data => { this.input.nativeElement.focus() }, err => { }, () => { tmp.unsubscribe() });
    }

    ngOnDestroy() {
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    }
    goBack() {
        if (this.associationEmitDialog) {
            this.associationOutput.emit(null);
        } else {
            this.location.back();
        }
    }

    SaveData() {
        this.pgService.start();
        this.httpservice.postData('otherAssociation', this.association).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.associationOutput.emit(this.association.otherAssociationId);
            // this.associationEmitDialog ? this.associationOutput.emit(this.association.associationId) : this.route.navigate([' /']);

        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving association: ' + err }));
    }

    DeleteData() {
        this.pgService.start();
        this.httpservice.deleteData('otherAssociation', this.association.othrerAssociationId).then(rps => {
            this.pgService.done();
            //this.associationEmitDialog ? this.associationOutput.emit('deleted') : this.route.navigate(['personTable/']);

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting association data' });
        });
    }
}