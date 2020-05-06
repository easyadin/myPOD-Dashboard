import { AudioModel } from './../interfaces/audio.model';
import { Component, OnInit } from '@angular/core';
import { CloudService } from '../services/cloud.service';
import { Observable, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  audiofiles$: AudioModel[];

  postAudio: AudioModel;

  constructor(
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
        console.log('erroe occured: ', error);
      }
    );
  }

  // delete audio
  deleteAudio(audioURL, id) {
    this.cloudService.deleteAudio(id).subscribe((res) => {
      this.storage.storage.refFromURL(audioURL).delete(),
        // refresh
        window.location.reload();
    });
  }

  // update audio status
  updateStatus(audioFile, status) {
    audioFile.status = status
    audioFile.event = "";

    this.postAudio = new AudioModel();
    this.postAudio = audioFile
    this.cloudService.updateAudio(this.postAudio).subscribe((res) => {
     
     });
  }
}
