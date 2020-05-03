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
  speakerName: 'Toye Fakunle'; //default speaker
  audioUrl: string;
  album: string;
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

  // upload dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(UploadDialog, {
      data:{audioTitle : this.audioTitle,  speakerName : this.speakerName,
         audioUrl : this.audioUrl,
      album : this.album}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  fileSelected(audioFile: any) {
    //set audio file name
    this.audioTitle = audioFile.target.files[0].name;
    this.openDialog();
    // console.log(audioFile.target.files[0])
  }



}






// dialog component
@Component({
  selector: 'upload-dialog',
  templateUrl: 'upload-dialog.html',
  styleUrls: ['./app.component.scss'],
})
export class UploadDialog {
  constructor(
    public dialogRef: MatDialogRef<UploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  cancelDialog(): void {
    this.dialogRef.close();
  }

  uploadAudio(){
    //  console.log(this.data)
    

  }


}
