import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from './core/services/image-upload.service';
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk';
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  file: any;
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

  onChange(event) {
    const files = event.srcElement.files;
    this.file = event.srcElement.files[0];
    console.log(files);
  }

  getBase64(file): void {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      console.log(reader.result);
      this.awsStuff(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }


  // test(): void {
  //   const file = $('#load-file')[0].files[0];
  //   const fileReader = new FileReader();
  //   fileReader.onloadend = function (e) {
  //     const arrayBuffer = e.target.result;
  //     blobUtil.arrayBufferToBlob(arrayBuffer, 'image/png').then(function (blob) {
  //       console.log('here is a blob', blob);
  //       console.log('its size is', blob.size);
  //       console.log('its type is', blob.type);
  //     }).catch(console.log.bind(console));
  //   };
  //   fileReader.readAsArrayBuffer(file);
  // }

  awsStuff(imageBlob): any {
    const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27', region: this.awsRegion});
    rekognition.config.credentials = new Credentials(this.awsAccessKey, this.awsSecretKey);
    rekognition.detectLabels({
        Image: {
          Bytes: imageBlob
        },
      },
      (error, data) => {
        this.response = data;
        console.log('test', error);
      },

    );
    // return this.httpClient.get(this.currentImageUrl, {responseType: 'blob'})
    //   .switchMap((data: Blob) =>
    //     new Promise((resolve, reject) => {
    //       const fileReader = new FileReader();
    //       fileReader.onload = () => resolve(fileReader.result);
    //       fileReader.onerror = reject;
    //       fileReader.readAsArrayBuffer(data);
    //     })
    //   )
    //   .switchMap((data: ArrayBuffer) =>
    //     Observable.of(
    //       rekognition.detectLabels({
    //         Image: {Bytes: data}
    //       }).promise()
    //     ));
  }

  processImageWithAws(): void {
    this.getBase64(this.file);

    // this.awsStuff().subscribe(
    //   (res: any) => {
    //     console.log('res suc', res);
    //   },
    //   (res: any) => {
    //     console.log('res error', res);
    //   }
    // )
  }

  processImageWithGoogle(): void {
    const config = {
      "requests": [
        {
          "image": {
            "source": {
              "imageUri":
              this.currentImageUrl
            }
          },
          "features": [
            {
              "type": "LABEL_DETECTION",
              "maxResults": 1
            }
          ]
        }
      ]
    };


    const url = 'https://vision.googleapis.com/v1/images:annotate?key=' + this.googleApiKey;

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'application/json');

    this.httpClient.post(url, config, {headers: httpHeaders}).subscribe(
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
