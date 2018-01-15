import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute } from '@angular/router';
import { Language } from '../language/language';
import { HttpService } from '../httpservice';
import { NgProgressService } from 'ng2-progressbar';
import { Message } from 'primeng/primeng';
import { Observable } from 'rxjs';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'language-entry',
    templateUrl: 'language-entry.html'
})
export class LanguageEntry implements OnInit, OnDestroy {
    @Input() languageEmitDialog;
    @Input() languageInput;
    @Output() languageOutput: EventEmitter<any>;
    @ViewChild('input') input;
    @ViewChild('languageModal') languageModal: BsModalComponent;

    language: any;
    sub: any;
    tempId: string = '';
    msgs: Message[] = [];

    constructor(public httpservice: HttpService, public location: Location, public acroute: ActivatedRoute, public route: Router, public pgService: NgProgressService) {
        this.language = new Language(UUID.UUID(),"",null,new Date(Date.now()), new Date(Date.now()), '', 0);
        this.languageOutput = new EventEmitter<any>();

        this.sub = this.acroute.params.subscribe(param => {
            if (param['languageId'] !== undefined) {
                this.tempId = param['languageId'];
                this.httpservice.getData('language/' + this.tempId).then(responseData => {
                    this.language = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
        });
    }
    ngOnInit() {
        //console.log('#In city entry/ this.cityInput is ', this.cityInput)
        if (this.languageInput !== null) {
            if (this.languageInput !== undefined) {
                this.pgService.start();
                this.httpservice.getData('language/' + this.languageInput).then(languagedata => {
                    this.pgService.done();
                    this.language = languagedata;
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
        if (this.languageEmitDialog) {
            this.languageOutput.emit(null);
        }else {
            this.location.back();
         }
    }

    SaveData() {
        this.pgService.start();
        this.httpservice.postData('language', this.language).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.languageOutput.emit(this.language.languageId)
          // this.languageEmitDialog ? this.languageOutput.emit(this.language.languageId) : this.route.navigate([' ']);

        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving language: ' + err }));
    }

    DeleteData() {
        this.pgService.start();
        this.httpservice.deleteData('language', this.language.languageId).then(rps => {
            this.pgService.done();
           //ks this.languageEmitDialog ? this.languageOutput.emit('deleted') : this.route.navigate(['personTable/']);

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting language data' });
        });
    }
}