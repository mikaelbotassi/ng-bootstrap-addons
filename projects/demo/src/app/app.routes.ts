import { Routes } from '@angular/router';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { SamplesComponent } from './pages/samples/samples.component';

export const routes: Routes = [
    {
        path: '',
        component: SamplesComponent
    },
    {
        path: 'form-sample',
        component: FormPageComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
