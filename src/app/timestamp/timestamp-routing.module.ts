import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimestampPage } from './timestamp.page';

const routes: Routes = [
  {
    path: '',
    component: TimestampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimestampPageRoutingModule {}
