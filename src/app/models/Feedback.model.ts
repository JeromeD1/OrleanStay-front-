import { FeedbackAnswer } from "./FeedbackAnswer.model"

export interface Feedback {
    id?: number,
    appartmentId: number,
    utilisateurId: number,
    comment: string,
    answer?: FeedbackAnswer
    creationDate?: Date,
    modificationDate?: Date
}