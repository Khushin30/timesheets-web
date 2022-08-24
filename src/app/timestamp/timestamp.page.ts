import { ModalPage } from './../modal/modal.page';
import { Stamp } from './../service/firestore.service';
/* eslint-disable no-underscore-dangle */
import { Router } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { FirestoreService } from './../service/firestore.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


//TODO: add date to the storage

@Component({
  selector: 'app-timestamp',
  templateUrl: './timestamp.page.html',
  styleUrls: ['./timestamp.page.scss'],
})
export class TimestampPage implements OnInit {
  btnClockIn: HTMLIonButtonElement;
  btnClockOut: HTMLIonButtonElement;
  stamps: Stamp[] = [];
  name: string;
  email: string;
  id: string;
  isAdmin = false;
  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    if (sessionStorage.getItem('user')) {
      console.log(sessionStorage.getItem('user'));
      this.isAdmin = true;
      this.email = sessionStorage.getItem('user');
      this.name = await this.firestoreService.getNameByEmail(this.email);
      this.id = await this.firestoreService.getIDByEmail(this.email);
      this.stamps = await this.firestoreService.getAllStampsByEmail(this.email);
      console.log(this.stamps);
      console.log(this.email);
    }else{
      if (this.firestoreService.isAdmin()) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      this.stamps = await this.firestoreService.getAllStamps();
      this.name = await this.firestoreService.getName();
      this.email = this.firestoreService.getEmail();
      this.id = await this.firestoreService.getID();
    }
    console.log(await this.firestoreService.isClockedIn());
    this.btnClockIn = document.getElementById('BTN_clockIn') as HTMLIonButtonElement;
    this.btnClockOut = document.getElementById('BTN_clockOut') as HTMLIonButtonElement;
    if (await this.firestoreService.isClockedIn()) {
      this.btnClockIn.setAttribute('disabled', 'true');
      this.btnClockOut.setAttribute('disabled', 'false');
    } else {
      this.btnClockIn.setAttribute('disabled', 'false');
      this.btnClockOut.setAttribute('disabled', 'true');
    }
  }

  async clockIn(){
    this.firestoreService.clockIn();
    this.btnClockIn.setAttribute('disabled', 'true');
    this.btnClockOut.setAttribute('disabled', 'false');
  }

  async clockOut(){
    this.firestoreService.clockOut();
    this.btnClockIn.setAttribute('disabled', 'false');
    this.btnClockOut.setAttribute('disabled', 'true');
  }

   msToTime(duration) {
    const milliseconds = Math.floor((duration % 1000) / 100);
    const  seconds = Math.floor((duration / 1000) % 60);
    const  minutes = Math.floor((duration / (1000 * 60)) % 60);
    const  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return (hours + ':' + minutes + ':' + seconds + '.' + milliseconds);
  }

  getDifference(date1: Date, date2: Date){
    return this.msToTime(Math.abs(date1.getTime() - date2.getTime()));
  }

  async logOut(){
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl:true});
  }

  async openStamp(stamp){
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        id: stamp.weekOf,
      },
      breakpoints: [0, .5, .8, 1],
      initialBreakpoint: .8
    });
    modal.present();
  }

  takeToHomePage(){
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }

}
