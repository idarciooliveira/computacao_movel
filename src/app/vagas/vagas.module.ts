import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VagasPageRoutingModule } from './vagas-routing.module';

import { VagasPage } from './vagas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VagasPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [VagasPage],
})
export class VagasPageModule {}
