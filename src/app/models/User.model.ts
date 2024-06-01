export interface User {
    id: number
    role: "admin" | "owner" | "user"
    firstname: string
    lastname: string
    email: string
    phone: string
    address: string
    zipcode: string
    city: string
    country: string
    creationDate: Date
}