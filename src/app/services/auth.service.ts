import { Observable } from 'rxjs/Observable';
import { User } from './../interfaces/user.model';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import  {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore,AngularFirestoreDocument} from '@angular/fire/firestore';
import  {switchMap} from 'rxjs/operators';
import {map, startWith} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 user$ : Observable<User>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) { 
      this.user$ = this.afAuth.authState.pipe(
       switchMap(user =>{
         if(user){
           return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
         }else {
           return of(null);
         }
       })
      )
    }


    async googleSignin(){
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    }

    async signOut(){
      await this.afAuth.signOut();
      return this.router.navigate(['/']);
    }


    updateUserData({uid,email,displayName,photoURL}: User){
      //Set user data to firestore on login
      const userRef : AngularFirestoreDocument<User> = this.afs.doc(`user/${uid}`);

      const data = {
        uid,
        email,
        displayName,
        photoURL
      };

      return userRef.set(data, {merge: true});
    }
}
