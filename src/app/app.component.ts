import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from './core/services/image-upload.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/of'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  response: any = {};

  constructor(private imageUploadService: ImageUploadService) {

  }

  ngOnInit(): void {
  }

  analyseImageWithAzure(): void {
    this.response = 'Loading ...';
    this.imageUploadService.analyseImageWithAzure(this.currentImageUrl, this.azureSubscriptionKey).subscribe((res: any) => {
        this.response = res;
      },
      (res: any) => {
        this.response = res;
      }
    )
  }

  analyseImageWithAws(): void {
    this.response = 'Loading ...';
    this.imageUploadService.analyseImageWithAWS(this.currentImageUrl, this.awsRegion, this.awsAccessKey, this.awsSecretKey).subscribe(
      (res: any) => {
        this.response = res;
      },
      (res: any) => {
        this.response = res;
      }
    )
  }

  analyseImageWithGoogle(): void {
    this.response = 'Loading ...';
    this.imageUploadService.analyseImageWithGoogle(this.currentImageUrl, this.googleApiKey).subscribe(
      (res) => {
        this.response = res;
      },
      (res) => {
        this.response = res;
      }
    );
  }

  get awsAccessKey(): string {
    return localStorage.getItem('awsAccessKey');
  }

  set awsAccessKey(value) {
    localStorage.setItem('awsAccessKey', value);
  }

  get awsSecretKey(): string {
    return localStorage.getItem('awsSecretKey');
  }

  set awsSecretKey(value) {
    localStorage.setItem('awsSecretKey', value);
  }

  get azureSubscriptionKey(): string {
    return localStorage.getItem('azureSubscriptionKey');
  }

  set azureSubscriptionKey(value) {
    localStorage.setItem('azureSubscriptionKey', value);
  }

  get currentImageUrl(): string {
    return localStorage.getItem('currentImageUrl');
  }

  set currentImageUrl(value) {
    localStorage.setItem('currentImageUrl', value);
  }

  get awsRegion(): string {
    return localStorage.getItem('awsRegion');
  }

  set awsRegion(value) {
    localStorage.setItem('awsRegion', value);
  }

  get googleApiKey(): string {
    return localStorage.getItem('googleApiKey');
  }

  set googleApiKey(value) {
    localStorage.setItem('googleApiKey', value);
  }
}
