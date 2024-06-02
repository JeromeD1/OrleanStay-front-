import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TemplateEmailComponent } from './components/template-email/template-email.component';

export const routes: Routes = 
[
    {path:"", component: HomeComponent},
    {path: "templateEmail/:appartmentId", component: TemplateEmailComponent},
];
