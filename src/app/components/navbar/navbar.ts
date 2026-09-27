import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  userName = "User";


  constructor(
    private authService: Auth,
    private router: Router
  ){

    const user = localStorage.getItem('user');

    if(user){
      this.userName = JSON.parse(user).name;
    }

  }


  logout(){

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}
