import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppartmentPhotosService } from '../../shared/appartment-photos.service';
import { Photo } from '../../models/Photo.model';

@Component({
  selector: 'app-update-appartment-photos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-appartment-photos.component.html',
  styleUrl: './update-appartment-photos.component.scss'
})
export class UpdateAppartmentPhotosComponent implements OnInit{

  photos = input.required<Photo[]>()
  formPhoto = this.fb.group({
    photos: this.fb.array([])
  })

  get photoArray():FormArray {
    return this.formPhoto.controls['photos'] as FormArray
  }

  constructor(private readonly appartmentPhotosService: AppartmentPhotosService, private readonly fb: FormBuilder) {}

  ngOnInit(): void {
      this.initForm()
  }

  initForm(): void {

    this.photos().forEach((photo) => {
      const photoGroup = this.fb.group({
        id: [photo.id],
        appartmentId: [photo.appartmentId, Validators.required],
        positionOrder: [photo.positionOrder, Validators.required],
        imgUrl: [photo.imgUrl, Validators.required]
      });
  
      this.photoArray.push(photoGroup);
    });
  }


}
  
