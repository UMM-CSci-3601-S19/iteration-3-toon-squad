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
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Test round trip functionality', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
  });

  it('Should see the roundtrip checkbox in addride', () => {
    page.navigateTo();


  });



  });


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

})


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
      expect(rides.length).toBe(4);
    });
  });

  it('should get only rides offered when radio button pressed', () => {
    page.navigateTo();
    page.click("isDrivingButton");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });
  });

  it('should get only rides requested when radio button pressed', () => {
    page.navigateTo();
    page.click("isNotDrivingButton");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
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
      expect(rides.length).toBe(6);
    });
  });


  /////////////////////////////////////////////////////////////////
  //   This test MUST be run with 100 ms delay or less to pass. ////
  /////////////////////////////////////////////////////////////////
  it('should have all the filters work together', () => {
    page.navigateTo();

    page.getRides().then( (rides) => {
      expect(rides.length).toBe(6);
    });

    page.getElementById("rideOrigin").sendKeys("u");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(5);
    });

    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking ON
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(4);
    });

    page.getElementById("isNotDrivingButton").click();
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });

    page.getElementById("rideDestination").sendKeys("w");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });

    page.getElementById("rideDestination").sendKeys("8");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(0);
    });

    page.getElementById("isDrivingButton").click(); // no change (still empty)
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(0);
    });

    page.getElementById("rideDestination").click();
    page.backspace(2) // erases input in destination
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(1);
    });

    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking OFF...
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });

    page.getElementById("rideOrigin").click();
    page.backspace(1) // erases input in origin field.
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });

    page.getElementById("isNotDrivingButton").click(); // should give us our remaining three rides (offered)
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });
  });

});

describe('Ride list', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
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
    page.click('add-ride-button');

    page.setIsDriving();
    page.field('driverID').sendKeys('JohnDoe');
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
    expect(page.getUniqueRide('JohnDoe')).toMatch('2');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Morris, MN');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Alexandria, MN');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Non-smoking');
    expect(page.getUniqueRide('JohnDoe')).toMatch('JohnDoe is offering this ride');
  });

  it('Should accept a ride with unspecified time and date, and place at the bottom', () => {

    let doeFound = false;
    let macaroniFound = false;

    page.navigateTo();
    page.click('add-ride-button');

    // We're going to add a ride with no specified data and time
    page.setIsNotDriving();
    page.field('driverID').sendKeys('Jefferson Macaroni');
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




