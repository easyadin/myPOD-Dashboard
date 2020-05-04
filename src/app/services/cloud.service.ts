import { Injectable } from '@angular/core';
import { of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CloudService {

  audioFiles: any = [];

  constructor(private http: HttpClient) { }
  



  getFiles() {
    return this.http.get('https://us-central1-fir-pci-restapi.cloudfunctions.net/app/api/read');
  }
}
