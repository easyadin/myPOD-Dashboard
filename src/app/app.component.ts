
import { Observable } from 'rxjs/Observable';
import {map, startWith} from "rxjs/operators";
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

//Upload data
export interface DialogData {
  audioTitle: string;
  // audioDescription: string;
  speakerName: string;
  audioUrl: string;
  album: string;
  event: any;
  //...
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  audioTitle: string;
  // audioDescription: string;
  speakerName: string; //default speaker
  audioUrl: string;
  album: string;
  event: any;
  //...

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
    //set audio file name
    this.audioTitle = audioFile.target.files[0].name;
    this.speakerName = 'Toye Fakunle';
    this.openDialog(audioFile);
    // console.log(audioFile.target.files[0])
  }

  // upload dialog
  openDialog(audioFile: any): void {
    const dialogRef = this.dialog.open(UploadDialog, {
      data: {
        audioTitle: this.audioTitle,
        speakerName: this.speakerName,
        audioUrl: this.audioUrl,
        album: this.album,
        event: audioFile,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
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
  uploadState : Observable<string>;


  isSaving: boolean = false;
  isUploading: boolean = false;
  uploadComplete: boolean = false;

  constructor(
    private afStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<UploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
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
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    //get audio url
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.getAudioUrl = this.ref.getDownloadURL();
          this.getAudioUrl.subscribe((url) => (this.audioURL = url,
            this.uploadComplete = true,
            //close dialog
            setTimeout(()=> {
              this.dialogRef.close();
            },500)
            ));
        })
      )
      .subscribe();
  }
}
