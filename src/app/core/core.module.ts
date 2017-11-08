import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from './services/image-upload.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ImageUploadService
  ]
})
export class CoreModule { }
