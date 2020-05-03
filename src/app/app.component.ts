
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Component, Inject } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

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
    this.speakerName = "Toye Fakunle";
    this.openDialog(audioFile);
    // console.log(audioFile.target.files[0])
  }

  // upload dialog
  openDialog(audioFile: any): void {
    const dialogRef = this.dialog.open(UploadDialog, {
      data:{audioTitle : this.audioTitle,  speakerName : this.speakerName,
         audioUrl : this.audioUrl, album : this.album, event: audioFile }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
}






// dialog component
@Component({
  selector: 'upload-dialog',
  templateUrl: 'upload-dialog.html',
  styleUrls: ['./app.component.scss'],
})
export class UploadDialog {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  isSaving: boolean =  false;
  isUploading: boolean = false;
  uploadComplete: boolean = false;

  constructor(
    private afStorage : AngularFireStorage,
    public dialogRef: MatDialogRef<UploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  cancelDialog(): void {
    this.dialogRef.close();
  }

  uploadAudio(){
    this.isSaving = true;
    this.isUploading = true;
    // console.log(this.data.event.target.files[0]); // audio file information

    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(this.data.event.target.files[0]); // push file

    //finally close modal when upload completes
    // this.dialogRef.close();
    
  }


}
