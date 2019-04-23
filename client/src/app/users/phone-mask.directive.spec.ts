/*
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Component, DebugElement} from "@angular/core";
import {PhoneMaskDirective} from "./phone-mask.directive";
import {By} from "@angular/platform-browser";

@Component({
  template: `<input type="text" phoneMask>`
})
class TestPhoneMaskComponent {
}


describe('Phone Masking Directive', () => {

  let component: TestPhoneMaskComponent;
  let fixture: ComponentFixture<TestPhoneMaskComponent>;
  let phoneInput: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestPhoneMaskComponent, PhoneMaskDirective]
    });

    fixture = TestBed.createComponent(TestPhoneMaskComponent);
    component = fixture.componentInstance;
    phoneInput = fixture.nativeElement.hostElement.querySelector('input');
  });

  it('should create', () =>{
    expect(component).toBeDefined();
  });

  it('should stimulate user input', () => {
    phoneInput.value = '6124257859';
    phoneInput.dispatchEvent(input);
    fixture.detectChanges();
    expect(phoneInput.textContent).toEqual('6124257859');
  });

});
*/
