import { AudioModel } from './../interfaces/audio.model';
import { Component, OnInit } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Observable, throwError } from 'rxjs';
import { publish } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  audiofiles$: AudioModel[];
  published$ : AudioModel[];
  pending$;

  TotalMessages;
  published = 0;
  pending = 0;


  constructor(public cloudService: CloudService) {}

  ngOnInit() {
    // get media files
    return this.cloudService.getAudioFiles().subscribe(
      (data) => {
        this.audiofiles$ = data;
        this.TotalMessages = this.audiofiles$.length;

        //get puiblished audio count
        this.getCounters()
      },
      (error) => {
        console.log('erroe occured: ', error);
      }
    );
  }

  getCounters(){
     this.published$ = this.audiofiles$.filter(audio => audio.status === 'published');
        this.published = this.published$.length
     this.pending$ = this.audiofiles$.filter(audio => audio.status === 'new');
        this.pending = this.pending$.length
  }
}
