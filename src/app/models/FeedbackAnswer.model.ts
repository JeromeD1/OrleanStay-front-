export interface FeedbackAnswer {
    id?: number,
    commentId: number,
    utilisateurId: number,
    commentAnswer: string,
    creationDate?: Date,
    modificationDate?: Date
}