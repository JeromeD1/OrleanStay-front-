export interface ChangePasswordSaveRequest {
    oldPassword: string,
    newPassword: string,
    confirmationPassword: string
}