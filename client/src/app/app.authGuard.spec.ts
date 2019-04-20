import {AppAuthGuard} from "./app.authGuard";

// We make a mock router for testing purposes
class MockRouter {
  navigate(path) {}
}

// since we are testing CanActivate inside AuthGuard we do that inside the AuthGuard
describe('AuthGuard', () => {
  describe('canActivate', () => {
    // We give a name to the AppAuthGuard component we imported above
    // Also declare appService and router as names that will be used in this test file
    let authGuard: AppAuthGuard;
    let appService;
    let router;

    it('should return true for a logged in user', () => {
      // We initialize appService with a isSignedIn() function that has a true value
      appService = { isSignedIn:() => true};
      router = new MockRouter();
      authGuard = new AppAuthGuard(appService,router);
      // Test if the canActivate in our AppAuthGuard returns true when isSignedIn value is true
      expect(authGuard.canActivate()).toEqual(true);
    });

    it('should return false for a logged out user', () => {
      // Initialize isSignedIn to be false
      appService = { isSignedIn:() => false};
      router = new MockRouter();
      authGuard = new AppAuthGuard(appService,router);
      // this calls the navigate method in the mock router above
      spyOn(router, 'navigate');

      // Test if the canActivate in our AppAuthGuard returns false when isSignedIn value is false
      expect(authGuard.canActivate()).toEqual(false);
      // Also test if the page navigates to home page when isSignedIn value is false as it should
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });


  });
});
