import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { FirestoreService } from '../service/firestore.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {

  credentials: FormGroup;
  type = 'user';

  constructor(
    private fb: FormBuilder,
    private loadinController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private fs: FirestoreService,) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required]]
    });
  }

  async register(){
    const loading = await this.loadinController.create();
    loading.present();
    console.log(this.credentials.value);
    const user = await this.authService.register(this.credentials.value, this.type);
    loading.dismiss();

    // if (user) {
    //   this.router.navigateByUrl('/home', {replaceUrl: true});
    // }else{
    //   this.showAlert('Registration failed', 'Please try again');
    // }
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({
      header,
      message,
      buttons:['OK']
    });
  }

  radioGroupChange(event) {
    this.type = event.detail.value;
    console.log(event.detail.value);
    }

  takeToHomePage(){
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }

}
