import { Injectable } from '@angular/core';
import { collection, doc, setDoc, Firestore, updateDoc, getDoc, getDocs } from '@angular/fire/firestore';
import { Auth, getAuth } from '@angular/fire/auth';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { type } from 'os';
import { compareAsc } from 'date-fns';
import { deleteDoc } from 'firebase/firestore';

export interface Stamp{
  weekOf: string;
  clockIn: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
  submitted: boolean;
  total: number;
}

export interface User{
  workerID: number;
  isAdmin: boolean;
  email: string;
  fullName: string;
}


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  auth = null;
  constructor(private firestore: Firestore, private ds: DataService) {
    this.auth = getAuth();
   }

  async createWeek(email: string){
    const date = this.ds.getFirstDayOfWeek(new Date());
    console.log(this.ds.convertDateToString(date));
    return await setDoc(doc(this.firestore,`${this.auth.currentUser.email}/${this.ds.convertDateToString(date)}`), {
      weekOf: this.ds.convertDateToString(date),
      clockIn: '',
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
      submitted: false,
      total: 0,
    });
  }

  async clockIn(){
    const dummy = new Date('Aug 18 2022 10:32:20 GMT-0500 (Central Daylight Time)').toString();
    console.log('clocked in');
    console.log(dummy);
    const date = this.ds.getFirstDayOfWeek(new Date());
    return await updateDoc(doc(this.firestore,`${this.auth.currentUser.email}/${this.ds.convertDateToString(date)}`), {
      clockIn: dummy,
    });
  }

  async clockOut(){
    const dummy = new Date('Aug 18 2022 17:32:20 GMT-0500 (Central Daylight Time)').toString();
    console.log('clocked out');
    console.log(dummy);
    try {
      this.calculateTotal();
    } catch (error) {
      console.log(error);
    }
  }

  async calculateTotal(){
    const date = this.ds.getFirstDayOfWeek(new Date());
    const docRef = doc(this.firestore, `${this.auth.currentUser.email}/${this.ds.convertDateToString(date)}`);
    const docSnap = await getDoc(docRef);
    try {
      const timeIn = new Date(docSnap.data().clockIn);
      const timeOut = new Date('Aug 18 2022 17:32:20 GMT-0500 (Central Daylight Time)');
      const prevTotal = docSnap.data().total;
      const total1 = this.getDifference(timeOut, timeIn);
      const day = timeIn.toString().split(' ')[0].toLowerCase();
      if (total1) {
        console.log(total1);
        console.log(prevTotal);
        return await updateDoc(doc(this.firestore,`${this.auth.currentUser.email}/${this.ds.convertDateToString(date)}`), {
          clockIn: '',
         [`${day}`]: total1,
          total: (total1 + prevTotal),
        });
      } else {
        console.log('didnt work enough to log');
      }
    } catch (error) {
      console.log(error);
    }
  }

  msToTime(duration) {
    console.log(duration);
    const  minutes = Math.floor((duration / (1000 * 60)) % 60);
    const  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return Math.round((hours + (minutes/60)) * 100) / 100;
  }

  getDifference(date1: Date, date2: Date){
    return this.msToTime(Math.abs(date1.getTime() - date2.getTime()));
  }

  async isClockedIn(): Promise<boolean>{
    const date = this.ds.getFirstDayOfWeek(new Date());
    const docRef = doc(this.firestore, `${this.auth.currentUser.email}/${this.ds.convertDateToString(date)}`);
    const docSnap = await getDoc(docRef);
    try {
      if (docSnap.data().clockIn !== '') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async addUserInfo(e, name: string, id: number, admin: boolean){
    const docRef = doc(this.firestore, `Users/${e}`);
    return await setDoc(docRef, {
      fullName: name,
      workerID: id,
      isAdmin: admin,
      email: e,
    });
  }

  async getAllStamps() {
    const docRef = collection(this.firestore, this.auth.currentUser.email);
    const querySnapshot = await getDocs(docRef);
    const stamps: Stamp[] = [];
    querySnapshot.forEach((d) =>{
      stamps.push(d.data() as unknown as Stamp);
    });
    return stamps;
  }

  async getAllStampsByEmail(email: string) {
    const docRef = collection(this.firestore, email);
    const querySnapshot = await getDocs(docRef);
    const stamps: Stamp[] = [];
    querySnapshot.forEach((d) =>{
      stamps.push(d.data() as unknown as Stamp);
    });
    return stamps;
  }

  async getStampById(id: string){
    const docRef = doc(this.firestore,`${this.auth.currentUser.email}/${this.ds.convertDateToString(new Date(id))}`);
    return await (await getDoc(docRef)).data();
  }

  async getStampByEmailAndId(id: string, email: string){
    const docRef = doc(this.firestore,`${email}/${this.ds.convertDateToString(new Date(id))}`);
    return await (await getDoc(docRef)).data();
  }

  async updateWeek(stamp: Stamp){
    const docRef = doc(this.firestore,`${this.auth.currentUser.email}/${stamp.weekOf}`);
    return await updateDoc(docRef, {
      mon: stamp.mon,
      tue: stamp.tue,
      wed: stamp.wed,
      thu: stamp.thu,
      fri: stamp.fri,
      sat: stamp.sat,
      sun: stamp.sun,
      total: (stamp.mon + stamp.tue + stamp.wed + stamp.thu + stamp.fri + stamp.sat + stamp.sun),
    });
  }

  async submitWeek(stamp: Stamp){
    const docRef = doc(this.firestore,`${this.auth.currentUser.email}/${stamp.weekOf}`);
    return await updateDoc(docRef, {
      mon: stamp.mon,
      tue: stamp.tue,
      wed: stamp.wed,
      thu: stamp.thu,
      fri: stamp.fri,
      sat: stamp.sat,
      sun: stamp.sun,
      submitted: true,
      total: (stamp.mon + stamp.tue + stamp.wed + stamp.thu + stamp.fri + stamp.sat + stamp.sun),
    });
  }

  getEmail(){
    return this.auth.currentUser.email;
  }

  async getName(){
    const docRef = doc(this.firestore, `Users/${this.auth.currentUser.email}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()) {
      return docSnap.data().fullName;
    }
  }

  async getNameByEmail(email: string){
    const docRef = doc(this.firestore, `Users/${email}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()) {
      return docSnap.data().fullName;
    }
  }

  async getID(){
    const docRef = doc(this.firestore, `Users/${this.auth.currentUser.email}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()) {
      return docSnap.data().workerID;
    }
  }

  async getIDByEmail(email: string){
    const docRef = doc(this.firestore, `Users/${email}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()) {
      return docSnap.data().workerID;
    }
  }

  async createNextWeek(){
    const nextWeekOf = this.ds.getNextMonday();
    const date = this.ds.getFirstDayOfWeek(new Date());
    console.log(this.ds.convertDateToString(date));
    const stamps: Stamp[] = await this.getAllStamps();
    if (stamps.length > 5) {
      const firstOfWeeks: Date[] = [];
      for (const stamp of stamps) {
        firstOfWeeks.push(new Date(stamp.weekOf));
      }
      firstOfWeeks.sort(compareAsc);
      const docToDelete = doc(this.firestore, `${this.auth.currentUser.email}/${this.ds.convertDateToString(firstOfWeeks[0])}`);
      await deleteDoc(docToDelete);
    }
    return await setDoc(doc(this.firestore,`${this.auth.currentUser.email}/${nextWeekOf}`), {
      weekOf: nextWeekOf,
      clockIn: '',
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
      submitted: false,
      total: 0,
    });
  }

  async isAdmin(){
    const docRef = doc(this.firestore, `Users/${this.auth.currentUser.email}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()) {
      return docSnap.data().isAdmin;
    }
    return false;
  }

  async getAllUsers(){
    const docRef = collection(this.firestore, 'Users');
    const querySnapshot = await getDocs(docRef);
    const users: User[] = [];
    querySnapshot.forEach((d) =>{
      users.push(d.data() as unknown as User);
    });
    return users;
  }

  async isEmailAdmin(email: string){
    const docRef = doc(this.firestore, `Users/${email}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()) {
      return docSnap.data().isAdmin;
    }
    return false;
  }
}
