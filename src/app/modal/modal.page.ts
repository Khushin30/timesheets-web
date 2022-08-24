import { DataService } from './../service/data.service';
import { Stamp, FirestoreService } from './../service/firestore.service';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id: string;

  stamp: Stamp = null;
  changeAble: boolean;

  constructor(private fs: FirestoreService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private ds: DataService,
    ) { }

  async ngOnInit() {
    if (sessionStorage.getItem('user')) {
      this.stamp = await this.fs.getStampByEmailAndId(this.id, sessionStorage.getItem('user')) as unknown as Stamp;
      this.changeAble = false;
    } else {
      this.stamp = await this.fs.getStampById(this.id) as unknown as Stamp;
      this.changeAble = this.stamp.submitted;
    }
    console.log(this.stamp.submitted);
    console.log(this.changeAble);
  }

  updateWeek(){
    if (sessionStorage.getItem('user')) {
      this.fs.updateWeek(this.stamp, sessionStorage.getItem('user'));
    } else {
      this.fs.updateWeek(this.stamp, this.fs.getEmail());
    }
    this.modalCtrl.dismiss();
  }

  async submitWeek(){
    if (this.ds.isAbleToSubmit(new Date('Aug 19 2022')) || !this.changeAble) {
      const alert = await this.alertCtrl.create({
        header: 'Once you submit a timesheet it cannot be edited! Do you want to continue?',
        buttons: [
          {
            text: 'cancel',
            role: 'cancel'
          },
          {
            text: 'Continue',
            handler: (res) => {
              console.log('yeah here');
              if (sessionStorage.getItem('user')) {
                this.fs.submitWeek(this.stamp, sessionStorage.getItem('user'));
                this.fs.createNextWeek(sessionStorage.getItem('user'));
              } else {
                this.fs.submitWeek(this.stamp, this.fs.getEmail());
                this.fs.createNextWeek(this.fs.getEmail());
              }
              this.modalCtrl.dismiss();
            }
          }
        ]
      });
      alert.present();
    }else{
      const alert = await this.alertCtrl.create({
        header: 'Cannot submit timesheet until Friday',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel'
          },
        ]
      });
      alert.present();
    }
  }
}


