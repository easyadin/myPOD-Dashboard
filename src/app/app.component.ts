import { CloudService } from './services/cloud.service';
import { AudioModel } from './interfaces/audio.model';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Component, Inject } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NumberSymbol } from '@angular/common';

// // Upload data
// export interface DialogData {
//   audioTitle: string;
//   // audioDescription: string;
//   speakerName: string;
//   audioUrl: string;
//   album: string;
//   event: any;
//   // ...
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  audioTitle: string;
  album: string;
  speakerName: string;
  audioUrl: string;
  status: string;
  event: any;

  title = 'myPOD-Dashboard';
  @ViewChild('sidenav') sidenav: MatSidenav;

  mobileQuery: MediaQueryList;
  miniMobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  value = '';
  uploading = false; // temp

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  closeSidenav() {
    if (this.mobileQuery.matches) {
      this.sidenav.close();
    }
  }

  openSidenav() {
    this.sidenav.open();
  }

  onSliderChangeEnd($event) {}

  fileSelected(audioFile: any) {
    //set default audio file details
    this.audioTitle = audioFile.target.files[0].name;
    this.speakerName = 'Toye Fakunle';
    this.status = 'new';
    this.openDialog(audioFile);
  }

  // send data to dialog
  openDialog(audioFile: any): void {
    const dialogRef = this.dialog.open(UploadDialog, {
      data: {
        audioTitle: this.audioTitle,
        album: this.album,
        speakerName: this.speakerName,
        audioUrl: this.audioUrl,
        status: this.status,
        event: audioFile,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
    });
  }
}
/////////////////////////////////////
// dialog component
@Component({
  selector: 'upload-dialog',
  templateUrl: 'upload-dialog.html',
  styleUrls: ['./app.component.scss'],
})
export class UploadDialog {
  mode: ProgressBarMode = 'determinate';
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  getAudioUrl: Observable<string>;
  audioURL: string;
  uploadState: Observable<string>;

  isSaving: boolean = false;
  isUploading: boolean = false;
  uploadComplete: boolean = false;

  postAudio: AudioModel;

  constructor(
    public cloudService: CloudService,
    private afStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<UploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AudioModel
  ) {}

  cancelDialog(): void {
    this.dialogRef.close();
    this.isSaving = false;
    this.isUploading = false;
    this.uploadComplete = false;
  }

  uploadAudio() {
    this.isSaving = true;
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(this.data.event.target.files[0]); // push file
    //monitor progress
    this.uploadProgress = this.task.percentageChanges();
    this.uploadState = this.task.snapshotChanges().pipe(map((s) => s.state));
    //get audio url
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.getAudioUrl = this.ref.getDownloadURL();
          this.getAudioUrl.subscribe(
            (url) => (
              (this.data.audioUrl = url),
              (this.uploadComplete = true),
              // post to api
              this.addToAPI(id),
              //close dialog
              setTimeout(() => {
                this.dialogRef.close();
              }, 500)
            )
          );
        })
      )
      .subscribe();
  }

  addToAPI(id: string) {
    this.postAudio = new AudioModel();
    this.postAudio.album = this.data.album || '';
    this.postAudio.audioTitle = this.data.audioTitle;
    this.postAudio.speakerName = this.data.speakerName;
    this.postAudio.audioUrl = this.data.audioUrl;
    this.postAudio.status = this.data.status;
    this.postAudio.event = this.data.event;
    this.postAudio.id = id;
    this.cloudService.addAudio(this.postAudio).subscribe((res) => {
      // tell user to refresh 
    });
    // this.cloudService.addAudio(this.data),
  }
}
