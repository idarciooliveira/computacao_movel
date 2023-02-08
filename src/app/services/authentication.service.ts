// authentication.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User, Usuario } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private afAuth: AngularFireAuth) { }

  registerUser(value: Usuario) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(value.email, value.nbi)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  loginUser(value: User) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password).then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  logOutUser() {
    return this.afAuth.signOut();
  }

  userDetails() {
    return this.afAuth.user;
  }
}
