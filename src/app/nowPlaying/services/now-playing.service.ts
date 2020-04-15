import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NowPlayingService {

  code: string;

  constructor(private router: Router) { }

  parseCode() {
    const url = this.router.url;
    this.code = url.substring(18);
  }

  getCode() {
    return this.code;
  }

}
