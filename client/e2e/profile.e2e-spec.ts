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

});
