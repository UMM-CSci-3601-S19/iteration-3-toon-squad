import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './users/user.component';

import {RideListComponent} from "./rides/ride-list.component";
import {UserListComponent} from './users/user-list.component';

import {UserListService} from './users/user-list.service';
import {RideListService} from './rides/ride-list.service';

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';

import {AddUserComponent} from './users/add-user.component';
import {AddRideComponent} from './rides/add-ride.component';

import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule}  from "@angular/material/checkbox";


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatCardModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,

    UserListComponent, RideListComponent,

    UserComponent,

    AddUserComponent, AddRideComponent,

  ],
  providers: [
    UserListService,RideListService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddUserComponent, AddRideComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
