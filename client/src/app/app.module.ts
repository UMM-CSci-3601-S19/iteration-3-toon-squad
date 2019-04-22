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
import {ValidatorService} from "./validator.service";
import {AppAuthGuard} from "./app.authGuard";

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';

import {AddRideComponent} from './rides/add-ride.component';
import {EditRideComponent} from './rides/edit-ride.component';
import {DeleteRideComponent} from "./rides/delete-ride.component";

import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule}  from "@angular/material/checkbox";
import {ProfileComponent} from "./users/profile.component";

import {RouterLinkDirectiveStub} from "./rides/router-link-directive-stub";
import {PhoneMaskDirective} from "./users/phone-mask.directive";

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
    EditRideComponent,
    DeleteRideComponent,
    ProfileComponent,
    RouterLinkDirectiveStub,
    PhoneMaskDirective
  ],
  providers: [
    RideListService, AppService, AppAuthGuard, UserService, ValidatorService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddRideComponent, EditRideComponent, DeleteRideComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
