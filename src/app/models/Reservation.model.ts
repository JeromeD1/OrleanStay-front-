import { Traveller } from "./Traveller.model"

export interface Reservation {
    id?: number
    appartmentId?: number
    checkinDate: Date | null
    checkoutDate: Date | null
    nbAdult: number
    nbChild: number
    nbBaby: number
    reservationPrice?: number
    accepted?: boolean
    cancelled?: boolean
    depositAsked?: boolean
    depositReceived?: boolean
    depositValue?: number
    travellerMessage?: string
    traveller?: Traveller
}
