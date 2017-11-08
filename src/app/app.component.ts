import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from './core/services/image-upload.service';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  testUrl: string = 'https://i.ytimg.com/vi/UGNWvbfD534/maxresdefault.jpg';
  response: any = {};

  constructor(private imageUploadService: ImageUploadService) {

  }

  ngOnInit(): void {
    this.processImageWithAws();
  }

  processImage(): void {
    this.imageUploadService.processImageWithAzure(this.testUrl).subscribe((res: any) => {
        console.log('success res', res);
        this.response = res;
      },
      (res: any) => {
        console.log('error res', res);
      })
  }

  processImageWithAws(): void {
    const ses: AWS.SES = new AWS.SES();
    const rekognition = new AWS.Rekognition({
      region: 'ireland',
      accessKeyId: '',
      secretAccessKey: ''
    });
    console.log('rekognition', rekognition);

    const params = {
      Image: {
        Bytes: new Buffer(this.imageUploadService.getBase64String())
      },
      MaxLabels: 123,
      MinConfidence: 70,
    };

    rekognition.detectLabels(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
      /*
      data = {
       Labels: [
          {
         Confidence: 99.25072479248047,
         Name: "People"
        },
          {
         Confidence: 99.25074005126953,
         Name: "Person"
        }
       ]
      }
      */
    });
  }
}
