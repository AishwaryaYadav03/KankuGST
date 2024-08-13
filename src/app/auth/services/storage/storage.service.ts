import { Injectable } from '@angular/core';
const USER: string = "user";
const TOKEN: string = "token";
@Injectable({
  providedIn: 'root'
})


export class StorageService {


  //Login user: set token in local storage
  public saveToken(token: any) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN, token);
      return true;
    }
    return false;
  }

  public saveUser(user: any) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER, JSON.stringify(user));
    }
  }

  public getUser() {
    if (typeof window !== 'undefined') {
      let user = window.localStorage.getItem(USER);
      if (user !== null) {
        return JSON.parse(user);
      }
      else {
        this.logout();
        return null;
      }
    }
  }

  //If we want to get token from localstorage
  public getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN);
    }
    return null;
  }

  // public getUserRole() {
  //   let userData = this.getUser();
  //   if (userData !== null) {
  //     return userData.authorities[0].authority;
  //   }
  //   return null;
  // }

  public getUserRole() {
    let userData = this.getUser();
    if (userData !== null && userData.authorities !== null && userData.authorities.length > 0) {
      return userData.authorities[0].authority;
    }
    return null;
  }

  public logout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER);
      window.localStorage.removeItem(TOKEN);
      return true;
    }
    return false;
  }


}
