import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

import {RideListComponent} from "./rides/ride-list.component";

import {RideListService} from './rides/ride-list.service';
import {UserService} from "./users/user.service";
import {AppService} from "./app.service";
import {AppAuthGuard} from "./app.authGuard";

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';

import {AddRideComponent} from './rides/add-ride.component';

import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule}  from "@angular/material/checkbox";
import {ProfileComponent} from "./users/profile.component";


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
    RideListComponent,
    AddRideComponent,
    ProfileComponent,
  ],
  providers: [
    RideListService, AppService, AppAuthGuard, UserService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddRideComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
