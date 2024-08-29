import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TemplateEmailComponent } from './components/template-email/template-email.component';
import { AdminInterfaceComponent } from './pages/admin-interface/admin-interface.component';
import { AcceptReservationComponent } from './pages/admin-interface/accept-reservation/accept-reservation.component';
import { AddReservationComponent } from './pages/admin-interface/add-reservation/add-reservation.component';
import { AppartmentGestionComponent } from './pages/admin-interface/appartment-gestion/appartment-gestion.component';
import { TravelInfoEditionComponent } from './pages/travel-info-edition/travel-info-edition.component';
import { GestionUtilisateursComponent } from './pages/admin-interface/gestion-utilisateurs/gestion-utilisateurs.component';
import { EditReservationAdminComponent } from './pages/admin-interface/edit-reservation-admin/edit-reservation-admin.component';

export const routes: Routes = 
[
    {path:"", component: HomeComponent},
    {path: "templateEmail/:appartmentId", component: TemplateEmailComponent},
    {path: "admin", component: AdminInterfaceComponent, children:
        [
            {path:"acceptReservation", component: AcceptReservationComponent},
            {path:"", redirectTo:"acceptReservation", pathMatch: 'full'},
            {path: "addReservation", component: AddReservationComponent},
            {path: "editReservation", component: EditReservationAdminComponent},
            {path: "appartGestion", component: AppartmentGestionComponent},
            {path: "travelInfo/edit/:appartmentId", component: TravelInfoEditionComponent},
            {path: "gestionUtilisateurs", component: GestionUtilisateursComponent},
        ]
    },
];
