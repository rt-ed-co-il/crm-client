import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',   title: 'Dashboard', icon:'nc-bank',          class: 'active-pro' },
    { path: '/leadsreport', title: 'Leads report', icon:'nc-book-bookmark', class: '' },
    { path: '/typography',  title: 'Flow',      icon:'nc-book-bookmark', class: '' },
    { path: '/fullcal',     title: 'Calendar',  icon:'nc-calendar-60',   class: '' },
    { path: '/personnew',   title: 'new person',icon:'nc-badge',         class: '' },
    { path: '/persons',     title: 'persons',   icon:'nc-badge',         class: '' },
    { path: '/jobmaster',   title: 'Job Master',icon:'nc-book-bookmark', class: '' },

];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.css']
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() { 
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
