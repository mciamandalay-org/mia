import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {DashboardComponent} from './dashboard/dashboard.component';
import {PersonEntry} from './person/person-entry';
import { PersonTable} from './person/person-table';
import { FacilityType } from './facility/facility-entry';
import { Industry } from './industrytype/industrytype-entry';
import { Business } from './businesstype/businesstype-entry';
import { BusinessBranchClass } from './businessbranch/businessbranch-entry';
import {businessFacilityCalss } from './businessfacility/businessfacility-entry';
import {BusinessTable } from './business/business-table';
import {BusinessEntry } from './business/business-entry';

export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'PersonEntryForm', component: PersonEntry},
    {path: 'PersonEntryForm/:personId', component: PersonEntry},
    {path: 'PersonTable', component: PersonTable},
    {path: 'FacilityType', component: FacilityType},
    {path: 'IndustryType', component: Industry},
    {path: 'BusinessType', component: Business},
    {path: 'BusinessBranch', component: BusinessBranchClass},
    {path: 'BusinessFacility', component: businessFacilityCalss},
    {path: 'BusinessEntry', component: BusinessEntry},
    {path: 'BusinessTable', component: BusinessTable}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
