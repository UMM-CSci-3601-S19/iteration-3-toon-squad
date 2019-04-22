import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Ride} from './ride';
import {RideListComponent} from './ride-list.component';
import {RideListService} from './ride-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {RouterLinkDirectiveStub} from "./router-link-directive-stub";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {By} from "@angular/platform-browser";
import {Subject} from "rxjs/Subject";

describe('Ride list', () => {

  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    refreshNeeded$: Subject<void>
  };

  let linkDes;
  let routerLinks;

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRides: () => Observable.of([
        {
          _id: 'chris_id',
          user: 'Chris',
          userId: "001",
          notes: 'These are Chris\'s ride notes',
          seatsAvailable: 3,
          origin: 'UMM',
          destination: 'Willie\'s',
          departureDate: '3/6/2019',
          departureTime: '10:00:00',
          isDriving: true,
          nonSmoking: true,
          roundTrip: true,
          passengerIds: [],
          passengerNames: []
        },
        {
          _id: 'dennis_id',
          user: 'Dennis',
          userId: "002",
          notes: 'These are Dennis\'s ride notes',
          seatsAvailable: -1,
          origin: 'Caribou Coffee',
          destination: 'Minneapolis, MN',
          departureDate: '8/15/2018',
          departureTime: '11:30:00',
          isDriving: false,
          nonSmoking: true,
          roundTrip: true,
          passengerIds: [],
          passengerNames: []
        },
        {
          _id: 'agatha_id',
          user: 'Agatha',
          userId: "003",
          notes: 'These are Agatha\'s ride notes',
          seatsAvailable: 3,
          origin: 'UMM',
          destination: 'Fergus Falls, MN',
          departureDate: '3/30/2019',
          departureTime: '16:30:00',
          isDriving: true,
          nonSmoking: false,
          roundTrip: false,
          passengerIds: [],
          passengerNames: []
        }
      ]),
      refreshNeeded$: new Subject<void>()
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [RideListComponent,RouterLinkDirectiveStub],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();

      // find DebugElements with an attached RouterLinkStubDirective
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

      // get attached link directive instances
      // using each DebugElement's injector
      routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));

    });
  }));

  //TIME AND DATE PARSING
  //Time parsing from 24 hour format to 12 hour AM/PM
  it('the client parses 13:01 time to 1:01 PM', () => {
    expect(rideList.hourParse("13:01")).toBe("1:01 PM");
  });

  it('the client parses 23:59 time to 11:59 PM', () => {
    expect(rideList.hourParse("23:59")).toBe("11:59 PM");
  });

  it('the client parses 00:00 time to 12:00 AM', () => {
    expect(rideList.hourParse("00:00")).toBe("12:00 AM");
  });

  it('the client parses 00:59 time to 12:59 AM', () => {
    expect(rideList.hourParse("00:59")).toBe("12:59 AM");
  });

  it('the client parses 12:00 time to 12:00 PM', () => {
    expect(rideList.hourParse("12:00")).toBe("12:00 PM");
  });

  it('the client parses 12:30 time to 12:30 PM', () => {
    expect(rideList.hourParse("12:30")).toBe("12:30 PM");
  });

  it('the client parses 15:30 time to 3:30 PM', () => {
    expect(rideList.hourParse("15:30")).toBe("3:30 PM");
  });

  it('the client parses 09:44 time to 9:44 AM', () => {
    expect(rideList.hourParse("09:44")).toBe("9:44 AM");
  });

  it('the client parses 11:03 time to 11:03 AM', () => {
    expect(rideList.hourParse("11:03")).toBe("11:03 AM");
  });

  it('the client parses 10:00 time to 10:00 AM', () => {
    expect(rideList.hourParse("10:00")).toBe("10:00 AM");
  });

  it('the client parses 09:59 time to 9:59 AM', () => {
    expect(rideList.hourParse("09:59")).toBe("9:59 AM");
  });

  //Date parsing from ISO format to human readable times
  it('the client parses ISO date 2019-03-01T06:00:00.000Z to March 1st', () => {
    expect(rideList.dateParse("2019-03-01T06:00:00.000Z")).toBe("March 1st");
  });

  it('the client parses ISO date 2019-03-02T06:00:00.000Z to March 2nd', () => {
    expect(rideList.dateParse("2019-03-02T06:00:00.000Z")).toBe("March 2nd");
  });

  it('the client parses ISO date 2019-03-03T06:00:00.000Z to March 3rd', () => {
    expect(rideList.dateParse("2019-03-03T06:00:00.000Z")).toBe("March 3rd");
  });

  it('the client parses ISO date 2019-03-04T06:00:00.000Z to March 4th', () => {
    expect(rideList.dateParse("2019-03-04T06:00:00.000Z")).toBe("March 4th");
  });

  it('the client parses ISO date 2019-03-14T06:00:00.000Z to March 14th', () => {
    expect(rideList.dateParse("2019-03-14T06:00:00.000Z")).toBe("March 14th");
  });

  it('the client parses ISO date 2019-03-22T06:00:00.000Z to March 22nd', () => {
    expect(rideList.dateParse("2019-03-22T06:00:00.000Z")).toBe("March 22nd");
  });

  it('the client parses ISO date 2019-03-31T06:00:00.000Z to March 31st', () => {
    expect(rideList.dateParse("2019-03-31T06:00:00.000Z")).toBe("March 31st");
  });



  //Affirmative containings: has the following items
  it('contains all the rides', () => {
    expect(rideList.rides.length).toBe(3);
  });

  it('contains a ride with user \'Chris\' and his UserId', () => {
    expect(rideList.rides.some((ride: Ride) => ride.user === 'Chris')).toBe(true);
    expect(rideList.rides.some((ride: Ride) => ride.userId === '001')).toBe(true);
  });

  it('contain a ride with user \'Dennis\' and his UserId', () => {
    expect(rideList.rides.some((ride: Ride) => ride.user === 'Dennis')).toBe(true);
    expect(rideList.rides.some((ride: Ride) => ride.userId === '002')).toBe(true);
  });

  it('has two rides that have 3 available seats', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.seatsAvailable === 3).length).toBe(2);
  });

  it('has two rides that where a ride is being offered', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.isDriving).length).toBe(2);
  });

  it('has one ride that where a ride is being requested', () => {
    expect(rideList.rides.filter((ride: Ride) => !ride.isDriving).length).toBe(1);
  });

  it('has two rides with origin \'UMM\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.origin === 'UMM').length).toBe(2);
  });

  it('has one ride with destination \'Fergus Falls, MN\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.destination === 'Fergus Falls, MN').length).toBe(1);
  });

  it('has one ride with departure time \'16:30:00\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '16:30:00').length).toBe(1);
  });

  it('has one ride with departure date \'3/30/2019\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.departureDate === '3/30/2019').length).toBe(1);
  });

  it('has one ride with _id \'dennis_id\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride._id === 'dennis_id').length).toBe(1);
  });

  it('has three rides with notes containing \'These are\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.notes.includes('These are')).length).toBe(3);
  });

  it('has two rides with non-smoking indicated', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.nonSmoking === true).length).toBe(2);
  });

  it('has one ride where non-smoking is not indicated', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.nonSmoking === false).length).toBe(1);
  });

  it('has two rides with round-trip indicated', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.roundTrip === true).length).toBe(2);
  });

  it('has one ride declared one way indicated', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.roundTrip === false).length).toBe(1);
  });


  ///////////////////////////////////////////
  ////  Does not contain certain fields   ///
  //////////////////////////////////////////


  it('doesn\'t contain a ride with user \'Dilbert\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.user === 'Dilbert')).toBe(false);
  });

  it('doesn\'t contain a ride with origin \'The Circus\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.origin === 'The Circus')).toBe(false);
  });

  it('doesn\'t have a ride with destination \'Wadena, MN\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Wadena, MN')).toBe(false);
  });

  it('doesn\'t have a ride with departure time \'17:30:00\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.departureTime === '17:30:00')).toBe(false);
  });

  it('doesn\'t have a ride with departure date \'11/30/2019\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.departureDate === '11/30/2019')).toBe(false);
  });

  it('doesn\'t have a ride with _id \'bob_id\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride._id === 'bob_id')).toBe(false);
  });

  it('doesn\'t have a ride with notes \'Smoker\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.notes === 'Smoker')).toBe(false);
  });

  it('doesn\'t have a requested ride with zero or more seats available', () => {
    expect(rideList.rides.some((ride: Ride) => !ride.isDriving && ride.seatsAvailable > 0)).toBe(false);
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////
  //////   Basic Filtering Tests   //////////
  ///////////////////////////////////////////

  it('filters by origin', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideOrigin = 'UM';
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(2);
    });
  });

  it('filters by destination', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideDestination = 'Fergus';
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });

  it('filters by isDriving TRUE', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideDriving = true;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(2);
    });
  });

  it('filters by isDriving FALSE', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideDriving = false;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////
  ////  Tag Filtering Tests   ////////
  ////////////////////////////////////

  // Tag filtering works like this: if you check the nonSmoking checkbox,
  // ride-list only displays rides with nonSmoking specified. However, unchecking the box
  // displays rides with AND without the nonSmoking tag. The same is true for roundTrip tag.

  // Therefore, without the nonSmoking checked, we SHOULD get all the rides (given that all other filters are
  // their original values.

  // Since the rideNonSmoking parameter is false be default, we should have all rides at first.
  it('filters by nonSmoking tag', () => {
    expect(rideList.filteredRides.length).toBe(3);

    // Now, we set rideNonSmoking to true and should see a change in the ride-list.
    rideList.rideNonSmoking = true;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(2);
    });
  });

  // As explained earlier, roundTrip works the same way.
  it('filters by roundTrip tag', () => {
    // roundTrip is false by default.
    expect(rideList.filteredRides.length).toBe(3);

    // Now we set roundTrip to true and test.
    rideList.rideRoundTrip = true;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(2);
    });
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////
  /////  Combining filters   /////////////
  ////////////////////////////////////////

  it('filters by origin and destination', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideOrigin = 'UMM';
    rideList.rideDestination = 'w';
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });

  it('filters by isDriving and nonSmoking', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideDriving = true;
    rideList.rideNonSmoking = true;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });

  it('filters by isDriving and roundTrip', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideDriving = true;
    rideList.rideRoundTrip = true;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });

  it('filters by nonSmoking and roundTrip', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideNonSmoking = true;
    rideList.rideRoundTrip = true;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(2);
    });
  });

  it('filters by origin, destination, isDriving, nonSmoking, and roundTrip', () => {
    expect(rideList.filteredRides.length).toBe(3);
    rideList.rideOrigin = 'UMM';
    rideList.rideDestination = 'w';
    rideList.rideDriving = true;
    rideList.rideNonSmoking = true;
    rideList.rideRoundTrip = true;
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('Misbehaving Ride List', () => {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>
    refreshNeeded$: Subject<void>
  };

  let linkDes;
  let routerLinks;

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRides: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      }),
      refreshNeeded$: new Subject<void>()
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent,RouterLinkDirectiveStub],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();

      // find DebugElements with an attached RouterLinkStubDirective
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

      // get attached link directive instances
      // using each DebugElement's injector
      routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    });
  }));

  it('generates an error if we don\'t set up a RideListService', () => {
    // Since the observer throws an error, we don't expect rides to be defined.
    expect(rideList.rides).toBeUndefined();
  });
});

