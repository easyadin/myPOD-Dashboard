import { AudioModel } from './../interfaces/audio.model';
import { Component, OnInit } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Observable, throwError } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  audiofiles$: AudioModel[];

  constructor(public cloudService: CloudService) {}

  ngOnInit() {
    // get media files
    return this.cloudService
      .getAudioFiles()
      .subscribe((data) => {
        this.audiofiles$ = data;
      },
      (error) => {
        console.log('erroe occured: ', error);
      });
  }
}
