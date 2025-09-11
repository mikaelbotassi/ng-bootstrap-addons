import { Routes } from '@angular/router';
import { FormPageComponent } from './form-page.component';

export const form_routes: Routes = [
    {
        path: '',
        component: FormPageComponent,
        children: [
            {path: '', loadComponent: () => import('./components/customer-card-list/customer-card-list.component').then(c => c.CustomerCardListComponent)},
            {path: 'form', loadComponent: () => import('./components/form-customer/form-customer.component')},
        ]
    },
];
