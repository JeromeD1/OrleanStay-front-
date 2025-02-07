import { PersonalInformation } from "./PersonalInformation.model"

export interface User {
    id: number
    role: "ADMIN" | "OWNER" | "USER"
    personalInformations: PersonalInformation
    creationDate: Date
}