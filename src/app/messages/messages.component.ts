import { AudioModel } from './../interfaces/audio.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Observable, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StreamState } from '../interfaces/stream-state';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  audiofiles$: AudioModel[];
  audioStatus;
  postAudio: AudioModel;

  state: StreamState;
  currentFile: any = {};

  constructor(
    public audioService: AudioService,
    private _snackBar: MatSnackBar,
    public cloudService: CloudService,
    private storage: AngularFireStorage
  ) {
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
  stop() {
    this.audioService.stop();
  }
  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.audiofiles$.length - 1;
  }
}
