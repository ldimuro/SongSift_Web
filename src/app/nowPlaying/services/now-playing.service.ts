import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';

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
