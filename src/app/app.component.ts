import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from './core/services/image-upload.service';
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/of'
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  response: any = {};

  constructor(private imageUploadService: ImageUploadService, private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    // this.processImageWithAws();
    // this.processImage();
  }

  processImage(): void {
    this.imageUploadService.processImageWithAzure(this.azureSubscriptionKey, this.currentImageUrl).subscribe((res: any) => {
        console.log('success res', res);
        this.response = res;
      },
      (res: any) => {
        console.log('error res', res);
      })
  }

  awsStuff(): Observable<any> {
    const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27', region: this.awsRegion});
    rekognition.config.update({region: this.awsRegion});
    rekognition.config.credentials = new Credentials(this.awsAccessKey, this.awsSecretKey);
    return this.httpClient.get(this.currentImageUrl, {responseType: 'blob'})
      .switchMap((data: Blob) =>
        new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(data);
        })
      )
      .switchMap((data: ArrayBuffer) =>
        Observable.of(
          rekognition.detectLabels({
            Image: {Bytes: data}
          }).promise()
        ));
  }

  processImageWithAws(): void {
    this.awsStuff().subscribe(
      (res: any) => {
        console.log('res suc', res);
      },
      (res: any) => {
        console.log('res error', res);
      }
    )
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
}
