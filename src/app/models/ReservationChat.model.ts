import { User } from "./User.model";

export interface ReservationChat {
    id?: number,
    reservationId: number,
    utilisateur: User,
    comment: string,
    creationDate: Date
}