import {ProfilePage} from "./profile.po";
import {browser, protractor, element, by} from "protractor";
import {Key} from "selenium-webdriver";

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;


  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(80);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('create and populate a profile page for user', () => {
  let page: ProfilePage;

  beforeEach(() => {
    page = new ProfilePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
    browser.executeScript("window.localStorage.setItem('userId','655477182929676100000')");
  });

  it('should find profile page title', () => {
    page.navigateTo();
    expect(page.elementExistsWithId("profile-title")).toBe(true);
    expect(page.getTextFromField("profile-title")).toEqual("Profile Page");
  });

  it('find the user\'s full name as header', () =>{
    expect(page.elementExistsWithId("profileFullName")).toBe(true);
    expect(page.getTextFromField("profileFullName")).toEqual("Jimmie Future");
  });

    it('find the user\'s email', () =>{
      expect(page.elementExistsWithId("profileEmail")).toBe(true);
      expect(page.getTextFromField("profileEmail")).toEqual("Email: Aquamate64@morris.umn.edu");
    });

    it('find the user\'s phone', () =>{
      expect(page.elementExistsWithId("profilePhone")).toBe(true);
      expect(page.getTextFromField("profilePhone")).toEqual("Phone: (981) 461-3498");
    });

    it('find the user\'s pic', () =>{
      expect(page.elementExistsWithId("https://picsum.photos/200/300/?random")).toBe(true);
    });

    it('Should find Upcoming Ride Card Title', () =>{
      expect(page.elementExistsWithId("upcomingRidesTitle")).toBe(true);
      expect(page.getTextFromField("upcomingRidesTitle")).toEqual("Upcoming Rides");
    });

    it('Should find Upcoming Ride Messsage', () =>{
      expect(page.elementExistsWithId("upcomingRides")).toBe(true);
      expect(page.getTextFromField("upcomingRides")).toMatch("You can see all your current Rides Below");
    });

    it('Should find Upcoming Ride List', () => {
      expect(page.elementExistsWithId("upcomingRides")).toBe(true);
      expect(page.getTextFromField("upcomingRides")).toMatch("2046 Neptune Court, Wright, IA 64892");
      expect(page.getTextFromField("upcomingRides")).toMatch("9782 Henry Street, Hannasville, IA 20609");
      expect(page.getTextFromField("upcomingRides")).toMatch("881 Boardwalk , Waumandee, SD 97192");
      expect(page.getTextFromField("upcomingRides")).toMatch("8974 Cyrus Avenue, Joes, SD 96915");
    });

  it('edit button exists and clicking on it displays phoneForm', () => {
    expect(page.elementExistsWithId("editButton")).toBe(true);
    expect(page.elementDoesExistWithId("phoneForm")).toBe(false);
    page.click("editButton");
    expect(page.elementExistsWithId("phoneForm")).toBe(true);

  });

});
