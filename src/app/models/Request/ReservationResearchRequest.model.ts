export interface ReservationResearchRequest {
    ownerId: number | null,
    appartmentId: number | null,
    year: number | null,
    month: number | null,
    state: "accepted" | "notAccepted" | null,
    notClosed: boolean,
    plateformId?: number | null //pour plus tard
}