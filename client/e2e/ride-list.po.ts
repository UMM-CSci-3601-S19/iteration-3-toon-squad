import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class RidePage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/rides');
  }

  // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
  highlightElement(byObject) {
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }

    return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
  }

  backspace(n: number) {
    let i : number;
    for ( i = 0; i < n; i++) {
      browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }
  }

  getRideTitle() {
    const title = element(by.id('ride-list-title')).getText();
    this.highlightElement(by.id('ride-list-title'));

    return title;
  }

  setNonSmoking() {
    const checkbox = element(by.id("checkboxNonSmoking"));
    checkbox.click();
  }

  setIsDriving() {
    const radioButton = element(by.id("isDrivingButton"));
    radioButton.click();
  }

  setIsNotDriving() {
    const radioButton = element(by.id("isNotDrivingButton"));
    radioButton.click();
  }

  getRides() {
    return element.all(by.className('rides'));
  }

  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  getUniqueRide(driver: string) {
    const ride = element(by.id(driver)).getText();
    this.highlightElement(by.id(driver));

    return ride;
  }

  getElementById(id: string) {
    return element(by.id(id));
  }

  getElementsByCss(css: string) {
    return element.all(by.css(css));
  }
  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }


  field(idOfField: string) {
    return element(by.id(idOfField));
  }


  getAddRideTitle() {
    const title = element(by.id('ride-add-title')).getText();
    this.highlightElement(by.id('ride-add-title'));

    return title;
  }

}
