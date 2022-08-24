import { User } from './../service/firestore.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  name: string;
  email: string;
  id: string;
  users: User[];

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.name = await this.firestoreService.getName();
    this.email = this.firestoreService.getEmail();
    this.id = await this.firestoreService.getID();
    this.users = await this.firestoreService.getAllUsers();
  }

  editUser(user: User){
    sessionStorage.setItem('user', user.email);
    this.router.navigateByUrl('/home', {replaceUrl: true});
  }

}
