import { Component, input } from '@angular/core';
import { Feedback } from '../../models/Feedback.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avis-simple-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avis-simple-display.component.html',
  styleUrl: './avis-simple-display.component.scss'
})
export class AvisSimpleDisplayComponent {
  feedback = input.required<Feedback>()
}
