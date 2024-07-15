import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly snackBar: MatSnackBar) { }



   /**
   * Presents a toast displaying the message with a green background
   * @param message Message to display
   * @example
   * this.notificationService.success("confirm oked");
   */
   success(message: string) {
    // this.openSnackBar(message, 'OK', 'success-snackbar');
    this.openSnackbarFromComponent(message, "success")

  }

  /**
   * Presents a toast displaying the message with a red background
   * @param message Message to display
   * @example
   * this.notificationService.error("confirm canceled");
   */
  error(message: string) {
    // this.openSnackBar(message, 'ERROR', 'error-snackbar');
    this.openSnackbarFromComponent(message, "error")
  }

  


  /**
   * Displays a toast with provided message
   * @param message Message to display
   * @param action Action text, e.g. Close, Done, etc
   * @param className Optional extra css class to apply
   * @param duration Optional number of SECONDS to display the notification for
   */
  openSnackBar(
    message: string,
    action: string,
    className: string,
    duration = 3500
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className]
    });
  }

  openSnackbarFromComponent(message: string, notificationType: "success" | "error") {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 3500,
      data: {message: message, notificationType: notificationType}
    })
  }
}

