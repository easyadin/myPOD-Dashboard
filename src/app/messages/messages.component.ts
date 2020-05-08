import { AudioModel } from './../interfaces/audio.model';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Observable, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StreamState } from '../interfaces/stream-state';
import { AudioService } from '../services/audio.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  audiofiles$: Array<AudioModel> = [];
  state: StreamState;
  currentFile: any = {};

  audioStatus;
  postAudio: AudioModel;


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
     // get media files
     this.cloudService.getAudioFiles().subscribe(
      (data) => {
        this.audiofiles$ = data;
      },
      (error) => {
        console.log('error occured: ', error);
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // delete audio
  deleteAudio(audio, event) {
    event.stopPropagation();
    this.cloudService.deleteAudio(audio.id).subscribe((res) => {
      this.storage.storage
        .refFromURL(audio.audioUrl)
        .delete()
        .then((res) => {
          this.openSnackBar(`Audio deleted`, 'close');
          // refresh
          this.ngOnInit();
        });
    });
  }

  // update audio status
  updateStatus(audioFile, status, event) {
    event.stopPropagation();
    audioFile.status = status;
    audioFile.event = '';
    this.postAudio = new AudioModel();
    this.postAudio = audioFile;
    this.cloudService.updateAudio(this.postAudio).subscribe((res) => {
      this.audioStatus = status == 'new' ? 'unpublished' : status;
      this.openSnackBar(`Audio ${this.audioStatus}`, 'close');
    });
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
