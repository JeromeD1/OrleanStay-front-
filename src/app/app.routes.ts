import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TemplateEmailComponent } from './components/template-email/template-email.component';
import { AdminInterfaceComponent } from './pages/admin-interface/admin-interface.component';
import { AcceptReservationComponent } from './components/accept-reservation/accept-reservation.component';
import { AddReservationComponent } from './components/add-reservation/add-reservation.component';
import { AppartmentGestionComponent } from './components/appartment-gestion/appartment-gestion.component';

export const routes: Routes = 
[
    {path:"", component: HomeComponent},
    {path: "templateEmail/:appartmentId", component: TemplateEmailComponent},
    {path: "admin", component: AdminInterfaceComponent, children:
        [
            {path:"acceptReservation", component: AcceptReservationComponent},
            {path:"", redirectTo:"acceptReservation", pathMatch: 'full'},
            {path: "addReservation", component: AddReservationComponent},
            {path: "appartGestion", component: AppartmentGestionComponent}
        ]
    },
];
