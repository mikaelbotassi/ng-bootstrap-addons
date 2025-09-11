import { Routes } from '@angular/router';
import { SamplesComponent } from './pages/samples/samples.component';

export const routes: Routes = [
    {
        path: '',
        component: SamplesComponent
    },
    {
        path: 'form-sample',
        loadChildren: () => import('./pages/form-page/form.routes').then(m => m.form_routes)
    },
    // {
    //     path: '**',
    //     redirectTo: ''
    // }
];
