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
  });

  it('should find profile page title', () => {
    page.navigateTo();
    expect(page.elementExistsWithId("profile-title")).toBe(true);
    expect(page.getProfileTitle()).toEqual("Profile Page");
  });

  it('find the user\'s full name as header', () =>{
    expect(page.elementExistsWithId("profileFullName")).toBe(true);
    expect(page.getProfileName()).toEqual("Jimmie Future");
  });

  it('find the user\'s email', () =>{
    expect(page.elementExistsWithId("profileEmail")).toBe(true);
    expect(page.getProfileEmail()).toEqual("Email: Aquamate64@morris.umn.edu");
  });

  it('find the user\'s phone', () =>{
    expect(page.elementExistsWithId("profilePhone")).toBe(true);
    expect(page.getProfilePhone()).toEqual("Phone: (981) 461-3498");
  });


});
