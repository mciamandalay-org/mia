import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../httpservice';
import { Person } from './person';
import { UUID } from 'angular2-uuid';
import { BsModalComponent } from 'ng2-bs3-modal';
import { NgProgressService } from 'ng2-progressbar';
import { Message } from 'primeng/primeng';

@Component({
    selector: 'person-table',
    templateUrl: 'person-table.html'
})
export class PersonTable implements OnDestroy {
    @ViewChild('personModal') personModal: BsModalComponent;
    @ViewChild('confirmModal') confirmModal: BsModalComponent;
    // displayPersonDialog: boolean = false;
    personObj: Person;
    personlist: any[] = [];
    dataItem: Date;

    selectedCity: string;
    selectedTownship: string;
    selectedNativeCity: string;
    editMode: boolean;
    selectedPersons: Person[] = [];

    editModeDialog: boolean = false;
    msgs: Message[] = [];

    constructor(public httpservice: HttpService, public route: Router, public pgService: NgProgressService) {
        this.getPersonData();
        this.selectedCity = null;
        this.selectedNativeCity = null;
        this.selectedTownship = null;
    }

    ngOnDestroy() {
        //this.personObj = undefined;
    }

    getPersonData() {
        //console.log('#Enter getPersonData() function..')
        this.pgService.start();
        this.httpservice.getData('person').then(p => {
            this.pgService.done();
            this.personlist = p;

        }).catch(err => { this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while getting person data: ' + err }) });
    }

    NewPerson() {
        this.personModal.open();
        this.editMode = true;
        this.personObj = new Person(UUID.UUID(), '', '', '', '', null, '', '',
            '', 1, '', null, null, null, null, '', '', '', '', '', '', null, null, '', null,
            new Date(Date.now()), new Date(Date.now()), '', 1);

        this.selectedCity = null;
        this.selectedNativeCity = null;
        this.selectedTownship = null;
    }

    onRowClick(event) {
        //console.log(event);
        this.httpservice.getData('person/' + event.data.personId).then(pdata => {
            this.personObj = pdata;
            //console.log('## this.personObj is ', this.personObj)
            this.personModal.open();
            this.editMode = false;
            //this.personObj = Object.assign({}, event.data);
            this.selectedCity =this.personObj.homeCityId;
            this.selectedNativeCity = this.personObj.nativeCityId;
            this.selectedTownship = this.personObj.homeTownshipId;
        });
    }

    returnDialogResult(event) {
        this.personModal.close();
        if (event !== 'close only') {
            this.getPersonData();
        }
        this.personObj = undefined;

        this.selectedPersons = [];
    }
    
    showConfirmDialog() {
        this.confirmModal.open();
    }

    onDismissModal(){
        this.personObj=undefined;
    }

    deleteSelectedRows() {
        // this.confirmModal.close();
        //console.log('#In delSelRows()/ selectedPersons is ', this.selectedPersons);
        let count = 0;
        for (let i = 0; i < this.selectedPersons.length; i++) {
            count++;
            this.httpservice.deleteData('person', this.selectedPersons[i].personId).then(rdata => {
                this.getPersonData();
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Successfully deleted !' });
            }).catch(err => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Error occurs while deleting person data: ' + err });
            });
        }
        if (count === this.selectedPersons.length) {
            this.confirmModal.close();
            this.selectedPersons = [];
        }
    }
}