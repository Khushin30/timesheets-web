import { FirestoreService } from './../service/firestore.service';
import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  date1: Date = null;
  date2: Date = null;
  credentials: FormGroup;
  credentials1: FormGroup;
  btnManage: HTMLIonButtonElement;
  btnTimeSheet: HTMLIonButtonElement;
  isAdmin: boolean;

  constructor(
    private fb: FormBuilder,
    private loadinController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private fs: FirestoreService,
  ) {}


  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });
    this.btnManage = document.getElementById('btn_manage') as HTMLIonButtonElement;
    this.btnTimeSheet = document.getElementById('btn_timeSheets') as HTMLIonButtonElement;

  }


  async login(){
    const loading = await this.loadinController.create();
    loading.present();
    const user = await this.authService.login(this.credentials.value);
    loading.dismiss();

    if (user) {
      if (await this.fs.isAdmin()) {
        console.log('is here');
        this.isAdmin = true;
        this.btnManage.setAttribute('disabled', 'false');
        this.btnTimeSheet.setAttribute('disabled', 'false');
      }else{
        this.takeToTimesheet();
      }
    }else{
      this.showAlert('Login failed', 'Please try again');
    }
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({
      header,
      message,
      buttons:['OK']
    });
  }

   msToTime(duration) {
    const milliseconds = Math.floor((duration % 1000) / 100);
    const  seconds = Math.floor((duration / 1000) % 60);
    const  minutes = Math.floor((duration / (1000 * 60)) % 60);
    const  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return (hours + ':' + minutes + ':' + seconds + '.' + milliseconds);
  }

  takeToTimesheet(){
    this.router.navigateByUrl('/home', {replaceUrl: true});
  }

  takeToEditPage(){
    this.router.navigateByUrl('/edit', {replaceUrl: true});
  }

  takeToNewUser(){
    this.router.navigateByUrl('/new-user', {replaceUrl: true});
  }

}
