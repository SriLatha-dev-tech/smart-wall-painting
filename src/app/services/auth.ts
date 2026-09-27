import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {


  logout(){

    localStorage.removeItem('token');

    localStorage.removeItem('user');

  }


}
