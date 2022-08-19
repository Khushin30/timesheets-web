import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimestampPageRoutingModule } from './timestamp-routing.module';

import { TimestampPage } from './timestamp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimestampPageRoutingModule
  ],
  declarations: [TimestampPage]
})
export class TimestampPageModule {}
