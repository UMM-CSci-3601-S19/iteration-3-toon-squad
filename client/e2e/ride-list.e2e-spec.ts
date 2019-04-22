import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(80);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Organize rides by soonest to latest', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
  });

  // The ride list SHOULD be organized with rides CLOSER TO OUR TIME at the top, and rides FURTHER FROM OUR TIME
  // towards the bottom. We made 3 pre-defined rides that should appear in this order. The drivers are, "Hollie Past",
  // "Shelby Present", and "Jimmie Future", and appear in that order on the ride-list (assuming the rides haven't expired).

  // Let's walk through the first example. The description should be self explanatory.
  it('should find Hollie Past before Shelby Present', () => {

    let pastFound = false; // When we find Hollie Past, we set this to true.
    let presentFound = false; // When we find Shelby Present, we set this to true.

    page.navigateTo(); // Go to the ride-list page...

    // Here we will get all elements with class='rides' on the page, and for each element, we call a function...
    element.all(by.className("rides")).each(function(element, index) {

      // ...the function extracts ALL underlying text of that element, and then...
      element.getText().then(function(text) {

        // ...if the text includes "Hollie Past", then we know we found her ride.
        if (text.toString().includes("Hollie Past")) {

          pastFound = true; // Set to true, because we found Hollie Past
          expect(presentFound).toBe(false); // Logically, presentFound should STILL BE FALSE.
        }

        // ... if the text includes "Shelby Present", then we know we found her ride.
        if (text.toString().includes("Shelby Present")) {

          presentFound = true; // Set to true, because we found Shelby Present
          expect(pastFound).toBe(true); // Logically, pastFound should ALREADY BE TRUE.
        }
      });
    });
  });


  // The second example works the same way, except we compare different rides.
  it('should find Shelby Present before Jimmie Future', () => {

    let presentFound = false;
    let futureFound = false;

    page.navigateTo();
    element.all(by.className("rides")).each(function(element, index) {
      element.getText().then(function(text) {

        if (text.toString().includes("Shelby Present")) {
          presentFound = true;
          expect(futureFound).toBe(false);
        }
        if (text.toString().includes("Jimmie Future")) {
          futureFound = true;
          expect(presentFound).toBe(true);
        }
      });
    });
  });


  // Same idea as the first two tests...
  it('should find Hollie Past before Jimmie Future', () => {

    let pastFound = false;
    let futureFound = false;

    page.navigateTo();
    element.all(by.className("rides")).each(function(element, index) {
      element.getText().then(function(text) {

        if (text.toString().includes("Hollie Past")) {
          pastFound = true;
          expect(futureFound).toBe(false);
        }
        if (text.toString().includes("Jimmie Future")) {
          futureFound = true;
          expect(pastFound).toBe(true);
        }
      });
    });
  });


  // Still the same idea, except we're dealing with three rides now, so we do some additional checking.
  it('should find Hollie Past first, Shelby Present second, and Jimmie Future Third', () => {

    let pastFound = false;
    let presentFound = false;
    let futureFound = false;

    page.navigateTo();
    element.all(by.className("rides")).each(function(element, index) {
      element.getText().then(function(text) {

        if (text.toString().includes("Hollie Past")) {
          pastFound = true;
          expect(presentFound).toBe(false);
          expect(futureFound).toBe(false);
        }
        if (text.toString().includes("Shelby Present")) {
          presentFound = true;
          expect(pastFound).toBe(true);
          expect(futureFound).toBe(false);
        }
        if (text.toString().includes("Jimmie Future")) {
          futureFound = true;
          expect(pastFound).toBe(true);
          expect(presentFound).toBe(true);
        }
      });
    });
  });

});


describe('Using filters on Ride Page', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
  });

  it('should filter by destination', () => {
    page.navigateTo();
    page.getElementById("rideDestination").sendKeys("IA");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });
  });

  it('should filter by origin', () => {
    page.navigateTo();
    page.getElementById("rideOrigin").sendKeys("IA");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });
  });

  it('should get only rides offered when radio button pressed', () => {
    page.navigateTo();
    page.click("isDrivingButton");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(5);
    });
  });

  it('should get only rides requested when radio button pressed', () => {
    page.navigateTo();
    page.click("isNotDrivingButton");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });
  });

  it('should toggle nonSmoking checkbox to get rides', () => {
    page.navigateTo();
    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking ON...
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(5);
    });
    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking OFF...
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(7);
    });
  });

  it('should toggle roundTrip checkbox to get rides', () => {
    page.navigateTo();
    page.getElementById("checkboxRoundTrip").click(); // toggle roundTrip ON...
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });
    page.getElementById("checkboxRoundTrip").click(); // toggle roundTrip OFF...
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(7);
    });
  });


  /////////////////////////////////////////////////////////////////
  //   This test MUST be run with 100 ms delay or less to pass. ////
  /////////////////////////////////////////////////////////////////
  it('should have all the filters work together', () => {
    page.navigateTo();

    page.getRides().then( (rides) => {
      expect(rides.length).toBe(7);
    });

    page.getElementById("rideOrigin").sendKeys("u");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(6);
    });

    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking ON
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(4);
    });

    page.getElementById("isNotDrivingButton").click();
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });

    page.getElementById("rideDestination").sendKeys("w");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(1);
    });

    page.getElementById("checkboxRoundTrip").click(); // toggle roundTrip ON
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(0);
    });

    page.getElementById("rideDestination").click();
    page.backspace(1); // erases input in destination
    page.getElementById("rideOrigin").click();
    page.backspace(1); // erases input in origin field
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(1);
    });

    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking OFF
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(1);
    });

    page.getElementById("isDrivingButton").click();
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });

    page.getElementById("checkboxRoundTrip").click(); // toggle roundTrip OFF
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(5);
    });

    page.getElementById("isNotDrivingButton").click(); // should give us our remaining two rides (requested)
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });
  });

});

describe('Ride list', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage()
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
  });

  it('should get and highlight Rides title attribute ', () => {
    page.navigateTo();
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
  });

  it('should load some rides', () => {
    expect(page.elementExistsWithCss('.rides')).toBeTruthy();
  });

  it('Should have an add ride button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('add-ride-button')).toBeTruthy();
  });

  it('Should open a page when add ride button is clicked', () => {
    page.navigateTo();
    page.click('add-ride-button');
    expect(page.getAddRideTitle()).toEqual('Add a Ride');
  });

  it('Should revert to the ride-list page after canceling add ride', () => {
    page.navigateTo();
    page.click('add-ride-button');
    expect(page.getAddRideTitle()).toEqual('Add a Ride');
    page.click('exitWithoutAddingButton');
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
  });
});

describe('Interacts with more options button (editing/deleting ride)', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
    browser.executeScript("window.localStorage.setItem('userId', '832471086850197300000')");
    page.navigateTo();
  });

  it('can click on the more options button (ride OFFERED)', () => {
    page.click('settingsDriving');
  });

  it('can click on the more options button (ride REQUESTED)', () => {
    page.click('settingsNotDriving');
  });
});


describe('Can interact correctly with edit ride option', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
    browser.executeScript("window.localStorage.setItem('userId', '832471086850197300000')");
    page.navigateTo();
  });


  it('can click "Edit" and go to the edit ride page', () => {
    page.getSettingsDriving("Patton Vang").click();
    page.click('editDialogOpen');
    expect(page.elementExistsWithClass("editARide"));
  });

  it('can go to the edit ride page and then edit the ride', () => {
    page.getSettingsDriving("Patton Vang").click();
    page.click('editDialogOpen');

    // Check to make sure we have the right values on the page and in the fields
    expect(page.field("rideUserTitle").toString().includes("Patton Vang is"));
    expect(page.field("seatsAvailableField").toString().includes("2", 0));
    expect(page.field("originField").toString().includes("881 Boardwalk , Waumandee, SD 97192"));
    expect(page.field("destinationField").toString().includes("8974 Cyrus Avenue, Joes, SD 96915"))
    expect(page.field("departureDateField").toString().includes("8/14/2019"));
    expect(page.field("departureTime").toString().includes("5:00 AM"));
    expect(page.field("notesField").toString().includes("Aliqua sint ut dolor sint irure do. Duis labore esse duis ullamco in est irure magna do cillum exercitation eu."));

    page.getElementById("seatsAvailableField").clear();
    page.getElementById("seatsAvailableField").sendKeys("5");

    page.getElementById("originField").clear();
    page.getElementById("originField").sendKeys("here");

    page.getElementById("destinationField").clear();
    page.getElementById("destinationField").sendKeys("there");

    page.getElementById("departureDateField").clear();
    page.getElementById("departureDateField").sendKeys("9/20/2019");

    page.getElementById("departureTimeField").clear();
    page.getElementById("departureTimeField").sendKeys("10:00PM");

    page.getElementById("notesField").clear();
    page.getElementById("notesField").sendKeys("here are notes");

    page.getElementById("roundTripCheckBox").click();

    page.click("confirmEditRideButton");

    // Now we check the ride list to make sure the ride is updated.
    page.navigateTo();

    expect(page.getUniqueRide('Patton Vang')).toMatch('Patton Vang');
    expect(page.getUniqueRide('Patton Vang')).toMatch('here');
    expect(page.getUniqueRide('Patton Vang')).toMatch('there');
    expect(page.getUniqueRide('Patton Vang')).toMatch('Patton Vang is offering this ride');
    expect(page.getUniqueRide('Patton Vang')).toMatch('September 20th at 10:00 PM');
    expect(page.getUniqueRide('Patton Vang')).toMatch('smoke_free Non-Smoking');
    expect(page.getUniqueRide('Patton Vang')).toMatch('repeat Round Trip');
    expect(page.getUniqueRide('Patton Vang')).toMatch('here are notes');
  });
});

describe('Can delete a ride', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
    browser.executeScript("window.localStorage.setItem('userId', '832471086850197300000')");
    page.navigateTo();
  });


  it('can click "Cancel" from the ride deletion prompt (ride OFFERED)', () => {
    page.getSettingsDriving("Patton Vang").click();
    page.click('deleteDialogOpen');
    page.click('exitWithoutDeletingButton');
    expect(page.getUniqueRide('Patton Vang')).toMatch('Patton Vang');
    page.getRides().then((rides) => {
      // expect(rides.length).toBe(9); TODO: Reimplement this when add ride tests work consistently
      expect(rides.length).toBe(7);
    });
  });

  it('can delete ride from the ride deletion prompt (ride OFFERED)', () => {
    page.getSettingsDriving("Patton Vang").click();
    page.click('deleteDialogOpen');
    page.click('confirmDeleteRideButton');
    expect(page.elementDoesNotExistWithId('Patton Vang')).toBeFalsy();
    page.getRides().then((rides) => {
      // expect(rides.length).toBe(8); TODO: Reimplement this when add ride tests work consistently
      expect(rides.length).toBe(6);
    });
  });
});



// TODO: Reimplement when ride refresh is working. Because of the need for the refresh, it breaks most of the time.
// HOWEVER, even beyond that, the way that the text matching from getUniqueRide works is broken in itself due to factors
// like debug buttons in the ride's html and how the ride html is structured at the moment.

describe('Add Ride', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
    page.navigateTo();
    page.click('add-ride-button');
  });

  it('Should add the information we put in the fields by keystroke to the database', () => {
    page.navigateTo();
    browser.executeScript("window.localStorage.setItem('userFullName','JohnDoe')");
    page.click('add-ride-button');

    page.setIsDriving();
    page.field('notesField').sendKeys('Likes to play music. Climate control. Gregarious.');
    page.field('seatsAvailableField').sendKeys('2');
    page.field('originField').sendKeys('Morris, MN');
    page.field('destinationField').sendKeys('Alexandria, MN');
    page.field('departureDateField').sendKeys('4/15/2020');
    page.field('departureTimeField').sendKeys('6:00PM');
    page.setNonSmoking();
    page.click('confirmAddRideButton');

    page.navigateTo();
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
    expect(page.getUniqueRide('JohnDoe')).toMatch('JohnDoe');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Likes to play music. Climate control. Gregarious.');
    expect(page.getUniqueRide('JohnDoe')).toMatch('2 SEATS LEFT');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Morris, MN');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Alexandria, MN');
    expect(page.getUniqueRide('JohnDoe')).toMatch('smoke_free Non-Smoking');
    expect(page.getUniqueRide('JohnDoe')).toMatch('JohnDoe is offering this ride');
  });

  it('Should accept a ride with unspecified time and date, and place at the bottom', () => {

    let doeFound = false;
    let macaroniFound = false;

    page.navigateTo();
    browser.executeScript("window.localStorage.setItem('userFullName','Jefferson Macaroni')");
    page.click('add-ride-button');

    // We're going to add a ride with no specified data and time
    page.setIsNotDriving();
    page.field('originField').sendKeys('Washington, D.C.');
    page.field('destinationField').sendKeys('Morris, MN');
    page.click('confirmAddRideButton');


    page.navigateTo();
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Jefferson Macaroni');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Washington, D.C.');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Morris, MN');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Jefferson Macaroni is requesting this ride');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Unspecified date');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('unspecified time');

    // Now we will make sure Jefferson Macaroni (no date provided) is listed after
    // JohnDoe (the latest ride with a date provided).
    // This test is similar to the "organize rides soonest to latest" tests

    element.all(by.className("rides")).each(function(element, index) {
      element.getText().then(function(text) {

        if (text.toString().includes("JohnDoe")) {
          doeFound = true;
          expect(macaroniFound).toBe(false);
        }
        if (text.toString().includes("Jefferson Macaroni")) {
          macaroniFound = true;
          expect(doeFound).toBe(true);
        }
      });
    });
  });


});








