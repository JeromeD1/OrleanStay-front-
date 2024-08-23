export interface AddReservationForm {
    appartmentId: number;
    checkinDate: Date | null;
    checkoutDate: Date;
    nbAdult: number;
    nbChild: number;
    nbBaby: number;
    reservationPrice: number;
    platform: string;
    enterTravelerInfo: boolean;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    zipcode: string;
    city: string;
    country: string;
  }