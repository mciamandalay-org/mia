import {Component, OnInit, ViewChild} from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'mia-dashboard',
    templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit  {

    
    @ViewChild('languageModal') languageModal: BsModalComponent;
    @ViewChild('associationModal') associationModal: BsModalComponent;
    public cityDialog:boolean=false;
    public townshipDialog:boolean=false;





    constructor(){

    }
    ngOnInit(){

    }
    showCityEntry(){
        this.cityDialog=true;
    }
    showTownshipEntry(){
        this.townshipDialog=true;
    }
    
    onHideEvent(){}
    Open(){
        this.languageModal.open();
    }
    OpenAso(){
        this.associationModal.open();
    }

    //test only
 
}