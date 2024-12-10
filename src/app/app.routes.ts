import { Routes } from '@angular/router';
import { infoResaResolver } from './pages/user-interface/info-resa/info-resa.resolver';
import { AdminInterfaceComponent } from './pages/admin-interface/admin-interface.component';
import { AcceptReservationComponent } from './pages/admin-interface/accept-reservation/accept-reservation.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: "", loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
    { path: "templateEmail/:appartmentId", loadComponent: () => import('./components/template-email/template-email.component').then(m => m.TemplateEmailComponent) },
    { path: "admin", component: AdminInterfaceComponent, canActivate: [authGuard], data: {allowedRoles: ["OWNER", "ADMIN"]},
        children: [
        { path: "acceptReservation", component: AcceptReservationComponent },
        { path: "", redirectTo: "acceptReservation", pathMatch: 'full' },
        { path: "addReservation", loadComponent: () => import('./pages/admin-interface/add-reservation/add-reservation.component').then(m => m.AddReservationComponent) },
        { path: "editReservation", loadComponent: () => import('./pages/admin-interface/edit-reservation-admin/edit-reservation-admin.component').then(m => m.EditReservationAdminComponent) },
        { path: "syntheseReservation", loadComponent: () => import('./pages/admin-interface/synthese-resa/synthese-resa.component').then(m => m.SyntheseResaComponent) },
        { path: "appartGestion", loadComponent: () => import('./pages/admin-interface/appartment-gestion/appartment-gestion.component').then(m => m.AppartmentGestionComponent) },
        { path: "travelInfo/edit/:appartmentId", loadComponent: () => import('./pages/travel-info-edition/travel-info-edition.component').then(m => m.TravelInfoEditionComponent) },
        { path: "gestionUtilisateurs", loadComponent: () => import('./pages/admin-interface/gestion-utilisateurs/gestion-utilisateurs.component').then(m => m.GestionUtilisateursComponent) },
        { path: "reservationChat", loadComponent: () => import('./pages/admin-reservation-chat/admin-reservation-chat.component').then(m => m.AdminReservationChatComponent) },
        { path: "gestionCommentaires", loadComponent: () => import('./pages/admin-interface/gestion-avis/gestion-avis.component').then(m => m.GestionAvisComponent) }
    ]},
    { path: "userProfile", canActivate: [authGuard], data: {allowedRoles: ["OWNER", "ADMIN", "USER"]}, loadComponent: () => import('./pages/user-interface/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
    { path: "userReservation", canActivate: [authGuard], data: {allowedRoles: ["OWNER", "ADMIN", "USER"]}, loadComponent: () => import('./pages/user-interface/user-reservations/user-reservations.component').then(m => m.UserReservationsComponent) },
    { path: "infoReservation/:reservationId/:travellerId", loadComponent: () => import('./pages/user-interface/info-resa/info-resa.component').then(m => m.InfoResaComponent), resolve: { travelInfos: infoResaResolver } },
    { path: "passwordReinitialisation/:token", loadComponent: () => import('./pages/password-reinitialisation/password-reinitialisation.component').then(m => m.PasswordReinitialisationComponent) },
    { path: "notFound", loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
    { path: "**", redirectTo: "notFound", pathMatch: 'full' }
];
