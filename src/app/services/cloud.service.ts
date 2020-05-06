import { AudioModel } from './../interfaces/audio.model';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CloudService {
  apiURL = 'https://us-central1-fir-pci-restapi.cloudfunctions.net/app/api';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization' :'my-auth-token'
    })
  }
  constructor(private http: HttpClient) {}

  // get audio
  getAudioFiles() {
    return this.http
      .get<AudioModel[]>(this.apiURL + '/read')
      .pipe(retry(3), catchError(this.handleError));
  }

  // post audio
  addAudio(audio: AudioModel): Observable<AudioModel> {
    return this.http
      .post<AudioModel>(this.apiURL + '/create', audio, this.httpOptions)
      .pipe(catchError(this.handleError));
  }


  //delete audio
  deleteAudio(id: string):Observable<{}> {
    const url =`${this.apiURL + '/delete'}/${id}`; 
    return this.http.delete(url, this.httpOptions)
    .pipe(catchError(this.handleError))
  }


  //update
  updateAudio(audio: AudioModel): Observable<AudioModel> {
    return this.http.put<AudioModel>(`${this.apiURL + '/update'}/${audio.id}`, audio, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  // handle error
  handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}
