import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../httpservice';
import { BusinessModel } from './business';
import { UUID } from 'angular2-uuid';
import { BsModalComponent } from 'ng2-bs3-modal';
import { NgProgressService } from 'ng2-progressbar';
import { Message } from 'primeng/primeng';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'business-table',
    templateUrl: 'business-table.html'
})
export class BusinessTable implements OnDestroy {
    @ViewChild('businessModal') businessModal: BsModalComponent;
    @ViewChild('confirmModal') confirmModal: BsModalComponent;
    
    businessObj: BusinessModel;
    businesslist: any[] = [];
    dataItem: Date;

    selectedCity: string;
    selectedTownship: string;
 
    editMode: boolean;
    selectedBusiness: BusinessModel[] = [];

    editModeDialog: boolean = false;
    msgs: Message[] = [];

    constructor(public httpservice: HttpService, public route: Router, public pgService: NgProgressService) {
        this.getBusinessData();
        this.selectedCity = null;
    
        this.selectedTownship = null;
    }

    ngOnDestroy() {
        
    }

    getBusinessData() {
        
        this.pgService.start();
        this.httpservice.getData('business').then(p => {
            this.pgService.done();
            this.businesslist = p;

        }).catch(err => { this.msgs.push({ severity: 'error', summary: 'Error Dialog', detail: 'Error occurs while getting business data: ' + err }) });
    }

    NewBusiness() {
        this.businessModal.open();
        this.editMode = true;
        this.businessObj = new BusinessModel(UUID.UUID(), null, null, '', '', '', null, null, null, new Date(Date.now()), '', '', '', 0, '', '', 0, '', null, 0, 0 , [],[],null, new Date(Date.now()), new Date(Date.now()), '', 0 );

        this.selectedCity = null;
 
        this.selectedTownship = null;
    }

    onRowClick(event) {
 
        this.httpservice.getData('business/' + event.data.businessId).then(pdata => {
            this.businessObj = pdata;
            
            this.businessModal.open();
            this.editMode = false;
            
            this.selectedCity =this.businessObj.cityId;
            
            this.selectedTownship = this.businessObj.townshipId;
        });
    }

    returnDialogResult(event) {
        this.businessModal.close();
        if (event !== 'close only') {
            this.getBusinessData();
        }
        this.businessObj = undefined;

        this.selectedBusiness = [];
    }
    
    showConfirmDialog() {
        this.confirmModal.open();
    }

    onDismissModal(){
        this.businessObj=undefined;
    }

    deleteSelectedRows() {
        
        let count = 0;
        for (let i = 0; i < this.selectedBusiness.length; i++) {
            count++;
            this.httpservice.deleteData('business', this.selectedBusiness[i].businessId).then(rdata => {
                this.getBusinessData();
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Successfully deleted !' });
            }).catch(err => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Error occurs while deleting business data: ' + err });
            });
        }
        if (count === this.selectedBusiness.length) {
            this.confirmModal.close();
            this.selectedBusiness = [];
        }
    }
}