import { Component, Inject, input } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {message: string, notificationType: "success" | "error" }) { }

}
