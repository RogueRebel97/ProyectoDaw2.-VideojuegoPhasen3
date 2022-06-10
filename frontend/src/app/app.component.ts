import { Component, Input } from '@angular/core';
import { UserService } from './user/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-end';
  @Input() duration!: any

  private logOut: boolean = false;

  constructor(private router: Router, private userService: UserService, private cookieService: CookieService) { }


  public logged() {
    if (this.userService.isLogged()) {
      this.logOut = false
      return true;

    }
    else {
      return false;

    }
  }

  // public loggedOut() {
  //   if (this.logOut) {
  //     return true

  //   } else {
  //     return false
  //   }
  // }



  public logout() {
    this.cookieService.delete("id");
    // this.logOut = true
    this.router.navigate(["/login"])

    let chip: any = document.getElementById("infoChip")

    chip.style.display = 'inline-block'

  }


}
