import { Appartment } from "./Appartment.model";

export interface Reservation {
    id?: number
    appartment_id?: number
    appartment?: Appartment
    checkinDate: Date | null
    checkoutDate: Date | null
    nbAdult: number
    nbChild: number
    nbBaby: number
    reservationPrice?: number
    isAccepted?: boolean
    isCancelled?: boolean
    isDepositAsked?: boolean
    isDepositReceived?: boolean
    travellerMessage?: string
}
