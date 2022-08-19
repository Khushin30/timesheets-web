import { LoadingController, AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  profile = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ){}

  async logOut(){
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl:true});
  }

}
