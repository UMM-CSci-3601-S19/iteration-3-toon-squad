/*import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {User} from "./user";
import {UserService} from "./user.service";
import {ProfileComponent} from "./profile.component";
import {CustomModule} from "../custom.module";
import {Observable} from "rxjs/Observable";
import {ActivatedRouteStub} from "./activated-route-stub";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';


describe('Profile Page',() => {

    let profileComponent: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let activatedRoute: ActivatedRouteStub;
    let userServiceStub: {
    getUserById: () => Observable<User>
  };


  beforeEach(() => {
    // making a stub for userService that contains a user whose information will fill the profile page
    userServiceStub = {
      getUserById: () => Observable.of(
        {
          _id: "5cb4fc0e61617348950e29d8",
          userId: "655477182929676100000",
          email: "bananacat123@hotmail.com",
          fullName: "Bindi Jenson",
          pictureUrl: "https://bit.ly/2IyHf4I",
          lastName: "Jenson",
          firstName: "Bindi",
        })
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [ProfileComponent],
      providers: [{provide: UserService, useValue: userServiceStub}]
                  // {provide: ActivatedRouteStub, useValue: activatedRoute}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      activatedRoute.setParamMap({id: 'id'});
      fixture = TestBed.createComponent(ProfileComponent);
      profileComponent = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('profile has the right information of the user', () => {
    expect(profileComponent.profile.email).toBe("bananacat123@hotmail.com");
  });


});*/
