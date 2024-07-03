import { CommentAnswer } from "./CommentAnswer.model"

export interface Comment {
    id: number
    appartmentId: number
    utilisateurId: number
    comment: string
    answer: CommentAnswer
    creationDate: Date
    modificationDate: Date
}