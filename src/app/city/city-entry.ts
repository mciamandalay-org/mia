import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute } from '@angular/router';
import { City } from '../city/city';
import { HttpService } from '../httpservice';
import { NgProgressService } from 'ng2-progressbar';
import { Message } from 'primeng/primeng';
import { Observable } from 'rxjs';

@Component({
    selector: 'city-entry',
    templateUrl: 'city-entry.html'
})
export class CityEntry implements OnInit, OnDestroy {
    @Input() cityEmitDialog;
    @Input() cityInput;
    @Output() cityOutput: EventEmitter<any>;
    @ViewChild('input') input;

    city: any;
    sub: any;
    tempId: string = '';
    msgs: Message[] = [];

    constructor(public httpservice: HttpService, public location: Location, public acroute: ActivatedRoute, public route: Router, public pgService: NgProgressService) {
        this.city = new City(UUID.UUID(), '', null, new Date(Date.now()), new Date(Date.now()), '', 0);
        this.cityOutput = new EventEmitter<any>();

        this.sub = this.acroute.params.subscribe(param => {
            if (param['cityId'] !== undefined) {
                this.tempId = param['cityId'];
                this.httpservice.getData('city/' + this.tempId).then(responseData => {
                    this.city = responseData;
                }).catch(err => console.log('Error occurs:' + err))
            }
        });
    }
    ngOnInit() {
        //console.log('#In city entry/ this.cityInput is ', this.cityInput)
        if (this.cityInput !== null) {
            if (this.cityInput !== undefined) {
                this.pgService.start();
                this.httpservice.getData('city/' + this.cityInput).then(citydata => {
                    this.pgService.done();
                    this.city = citydata;
                }).catch(err => console.log('Err occurs:' + err))
            };
        }
        let tmp = Observable.timer(1000).subscribe(data => { this.input.nativeElement.focus() }, err => { }, () => { tmp.unsubscribe() });
    }

    ngOnDestroy() {
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    }
    goBack() {
        if (this.cityEmitDialog) {
            this.cityOutput.emit(null);
        } else {
            this.location.back();
        }
    }

    SaveData() {
        this.pgService.start();
        this.httpservice.postData('city', this.city).then(rps => {
            this.pgService.done();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success Dialog', detail: 'Successfully Saved' });
            this.cityEmitDialog ? this.cityOutput.emit(this.city.cityId) : this.route.navigate(['personTable/']);

        }).catch(err => this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while saving city: ' + err }));
    }

    DeleteData() {
        this.pgService.start();
        this.httpservice.deleteData('city', this.city.cityId).then(rps => {
            this.pgService.done();
            this.cityEmitDialog ? this.cityOutput.emit('deleted') : this.route.navigate(['personTable/']);

        }).catch(err => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while deleting city data' });
        });
    }
}