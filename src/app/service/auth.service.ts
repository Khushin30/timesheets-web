import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private fs: FirestoreService, private ds: DataService) { }

  async register({email, password, fullName}){
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email,password);
      this.fs.createWeek(email);
      this.fs.addUserInfo(email, fullName, 1);
      return user;
    } catch (e) {
      console.log(e);
      console.log(email);
      console.log(password);
      return null;
    }
  }

  async login({email, password}){
    try {
      const user = await signInWithEmailAndPassword(this.auth, email,password);
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }


  logout(){
    return signOut(this.auth);
  }
}
