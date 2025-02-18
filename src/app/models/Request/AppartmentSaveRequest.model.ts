export interface AppartmentSaveRequest {
    id?: number
    ownerId: number,
    discountId: number,
    name: string,
    description: string,
    address: string,
    zipcode: string,
    city: string,
    distanceCityCenter: string,
    distanceTrain: string,
    distanceTram: string,
    googleMapUrl: string,
    nightPrice: number,
    caution: number,
    prixPersonneSupplementaire: number,
    menageCourtSejour: number,
    menageLongSejour: number,
    menageLongueDuree: number,
    type: string,
    active: boolean,
}