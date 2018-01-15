import {Component, Input, OnInit, trigger, state, transition, style, animate} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="menu">
            <ul app-submenu [item]="model" root="true"></ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[];

    ngOnInit() {
        this.model = [
            {label: 'Dashboard', icon: 'fa-home', badge: '2', routerLink: ['/']},
            {
                // label: 'Persons', icon: 'fa-user-o',
                // items: [
                //     {label: 'New Person', icon: 'fa-id-card', routerLink: ['/PersonEntryForm']},
                //     {label: 'Person List', icon: 'fa-list', routerLink: ['/PersonTable']}
                // ]
                label: 'Person', icon: 'fa-list', routerLink: ['/PersonTable']
            },
            {
                label: 'Members', icon: 'fa-user-circle',
                items: [
                    {label: 'New Member', icon: 'fa-id-card', routerLink: ['/personentry']},
                    {label: 'Member List', icon: 'fa-list', routerLink: ['/forms']},
                    {label: 'Member Fee', icon: 'fa-money', routerLink: ['/forms']}
                ]
            },
            {
                label: 'Events', icon: 'fa-flash',
                items: [
                    {label: 'Create New Event', icon: 'fa-id-card', routerLink: ['/personentry']},
                    {label: 'Event List', icon: 'fa-list', routerLink: ['/forms']}
                ]
            },
            {
                label: 'Accounts', icon: 'fa-university',
                items: [
                    {label: 'Create New Account', icon: 'fa-id-card', routerLink: ['/personentry']},
                    {label: 'Account List', icon: 'fa-list', routerLink: ['/forms']},
                    {label: 'Account Transaction', icon: 'fa-list', routerLink: ['/forms']}
                ]
            },
            {label: 'Documentation', icon: 'fa-book', routerLink: ['/documentation']}
        ];
    }
}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template: `
        <ul>
            <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
                <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass">
                    <a *ngIf="!child.routerLink" [href]="child.url||'#'" (click)="itemClick($event,child,i)"
                       [attr.tabindex]="!visible ? '-1' : null"  [attr.target]="child.target">
                        <i class="fa fa-fw" [ngClass]="child.icon"></i>
                        <span>{{child.label}}</span>
                        <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                        <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    </a>
                    <a *ngIf="child.routerLink" (click)="itemClick($event,child,i)" [attr.target]="child.target"
                        [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                       [routerLinkActiveOptions]="{exact: true}">
                        <i class="fa fa-fw" [ngClass]="child.icon"></i>
                        <span>{{child.label}}</span>
                        <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                        <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    </a>
                    <ul app-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ? 'visible' : 'hidden'" ></ul>
                </li>
            </ng-template>
        </ul>
    `,
    animations: [
        trigger('children', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    activeIndex: number;

    constructor(public app: AppComponent) {}

    itemClick(event: Event, item: MenuItem, index: number) {
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        if (item.command) {
            item.command({originalEvent: event, item: item});
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        if (!item.items) {
            this.app.menuActiveMobile = false;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }
}
