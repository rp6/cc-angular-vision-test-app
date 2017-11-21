import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk';

@Injectable()
export class ImageUploadService {

  constructor(private httpClient: HttpClient) {
  }

  analyseImageWithAzure(sourceImageUrl: string, subscriptionKey: string): Observable<any> {

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    const uriBase = 'https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze';

    // Request parameters.
    const params = {
        'visualFeatures': 'Categories,Description,Color',
        'details': '',
        'language': 'en',
      };

    return this.httpClient.post(uriBase, {'url': sourceImageUrl}, {
      params: new HttpParams().set('visualFeatures', 'Categories,Description,Color').set('details', '').set('language','en'),
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Ocp-Apim-Subscription-Key', subscriptionKey)
    });
  }

  analyseImageWithAWS(imageUrl, awsRegion, awsAccessKey, awsSecretKey): any {
    const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27', region: awsRegion, credentials: new Credentials(awsAccessKey, awsSecretKey)});

    return this.httpClient.get(imageUrl, {responseType: 'blob'})
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
            Image: {
              Bytes: data
            }
          }).promise()
        ));
  }

  analyseImageWithGoogle(currentImageUrl: any, googleApiKey: string): Observable<any> {
    const config = {
      "requests": [
        {
          "image": {
            "source": {
              "imageUri":
              currentImageUrl
            }
          },
          "features": [
            {
              "type": "LABEL_DETECTION",
              "maxResults": 10
            }
          ]
        }
      ]
    };

    const url = 'https://vision.googleapis.com/v1/images:annotate?key=' + googleApiKey;

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'application/json');

    return this.httpClient.post(url, config, {headers: httpHeaders})
  }
}

