import { AudioModel } from './../interfaces/audio.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Observable, throwError } from 'rxjs';
import { publish } from 'rxjs/operators';
import { AudioService } from '../services/audio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { MediaMatcher } from '@angular/cdk/layout';
import { StreamState } from '../interfaces/stream-state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  audiofiles$: Array<AudioModel> = [];
  state: StreamState;
  currentFile: any = {};

  published$: AudioModel[];
  pending$;

  TotalMessages = 0;
  published = 0;
  pending = 0;

  mobileQuery: MediaQueryList;
  miniMobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  
  constructor(
    public audioService: AudioService,
    private _snackBar: MatSnackBar,
    public cloudService: CloudService,
    private storage: AngularFireStorage,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    //media query
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // listen to stream state
    this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  ngOnInit() {
    this.cloudService.getAudioFiles().subscribe(
      (data) => {
        this.audiofiles$ = data;
        this.TotalMessages = this.audiofiles$.length;

        //get puiblished audio count
        this.getCounters();
      },
      (error) => {
        console.log('erroe occured: ', error);
      }
    );
  }

  getCounters() {
    this.published$ = this.audiofiles$.filter(
      (audio) => audio.status === 'published'
    );
    this.published = this.published$.length;
    this.pending$ = this.audiofiles$.filter((audio) => audio.status === 'new');
    this.pending = this.pending$.length;
  }



  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }
// Stream audio ----------------

playStream(url) {
  this.audioService.playStream(url).subscribe((events) => {
    // listening for fun here
  });
}

openFile(file, index) {
  this.currentFile = { index, file };
  this.audioService.stop();
  this.playStream(file.audioUrl);
}
play() {
  this.audioService.play();
}
pause() {
  this.audioService.pause();
}
stop() {
  this.audioService.stop();
}
isFirstPlaying() {
  return this.currentFile.index === 0;
}

isLastPlaying() {
  return this.currentFile.index === this.audiofiles$.length - 1;
}

next() {
  const index = this.currentFile.index + 1;
  const file = this.audiofiles$[index];
  this.openFile(file, index);
}
previous() {
  const index = this.currentFile.index - 1;
  const file = this.audiofiles$[index];
  this.openFile(file, index);
}
}
