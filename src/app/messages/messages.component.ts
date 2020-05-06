import { AudioModel } from './../interfaces/audio.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Observable, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  audiofiles$: AudioModel[];
  audioStatus;

  postAudio: AudioModel;

  constructor(
    private _snackBar: MatSnackBar,
    public cloudService: CloudService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    // get media files
    return this.cloudService.getAudioFiles().subscribe(
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
  deleteAudio(audioURL, id) {
    this.cloudService.deleteAudio(id).subscribe((res) => {
      this.storage.storage.refFromURL(audioURL).delete(),
        // refresh
        this.openSnackBar(`Audio deleted`, 'close')
        window.location.reload();
    });
  }

  // update audio status
  updateStatus(audioFile, status) {
    audioFile.status = status;
    audioFile.event = '';

    this.postAudio = new AudioModel();
    this.postAudio = audioFile;
    this.cloudService.updateAudio(this.postAudio).subscribe((res) => {
      this.audioStatus = status == 'new'? 'unpublished' : status
      this.openSnackBar(`Audio ${this.audioStatus}`, 'close')
    });
  }
}
