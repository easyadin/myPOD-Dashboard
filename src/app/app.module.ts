import { environment } from './../environments/environment';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { HttpClientModule } from '@angular/common/http';
// import {
//   AngularFireStorageReference,
//   AngularFireUploadTask,
//   StorageBucket
// }  from "@angular/fire/storage";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, UploadDialog } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { AlbumsComponent } from './albums/albums.component';
import { SpeakersComponent } from './speakers/speakers.component';
import { GenreComponent } from './genre/genre.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    AppComponent, UploadDialog,
    LayoutComponent,
    DashboardComponent,
    MessagesComponent,
    AlbumsComponent,
    SpeakersComponent,
    GenreComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp({ // investigate security issues doing this
      apiKey: environment.apiKey,
      authDomain: environment.authDomain,
      projectId: environment.projectId ,
      storageBucket: environment.storageBucket,
    }),
    AngularFireStorageModule,
    RouterModule.forRoot([
      { path: '', component: LayoutComponent }, //default route
      { path: 'dashboard', component: DashboardComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'albums', component: AlbumsComponent },
      { path: 'speakers', component: SpeakersComponent },
      { path: 'genre', component: GenreComponent },
      { path: '**', component: NotFoundComponent } //not found
    ]),
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
