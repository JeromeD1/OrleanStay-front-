import { FeedbackAnswer } from "./FeedbackAnswer.model"

export interface Feedback {
    id?: number,
    appartmentId: number,
    utilisateurId: number,
    reservationId: number,
    comment: string,
    answer?: FeedbackAnswer
    creationDate?: Date,
    modificationDate?: Date
}