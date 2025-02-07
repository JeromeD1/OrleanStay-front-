import { PersonalInformation } from "./PersonalInformation.model";

export interface Traveller {
    id?: number;
    utilisateurId?: number
    personalInformations: PersonalInformation
}
