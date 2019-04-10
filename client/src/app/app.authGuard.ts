import {Injectable} from "@angular/core";
import {AppService} from "./app.service";
import {Router, CanActivate} from "@angular/router";

@Injectable()
export class AppAuthGuard implements CanActivate {

  constructor(public appService: AppService, public router: Router){}

  canActivate(): boolean {
    if (!this.appService.isSignedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}
