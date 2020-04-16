import { Component, OnInit } from '@angular/core';
import { HomeComponent } from 'src/app/home/components/home/home.component';
import { NowPlayingService } from '../../services/now-playing.service';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {

  code: string;
  token: string;

  constructor(private nowPlayingSvc: NowPlayingService,
              private spotifySvc: SpotifyService,
              private router: Router) { }

  ngOnInit() {
    this.nowPlayingSvc.parseCode();
    console.log('CODE: ' + this.nowPlayingSvc.getCode());

    setTimeout(() => {
      this.getToken();
    }, 1000);
  }

  getToken() {
    this.spotifySvc.getToken();
  }

  getTrackInfo() {
    this.spotifySvc.getTrackInfo();
  }

  getSong() {
    this.spotifySvc.getSong();
  }

  getSongsFromSpotify() {
    this.spotifySvc.getSongsFromSpotify('https://api.spotify.com/v1/me/tracks?market=US&offset=0&limit=50');
  }

  getAllSongs() {
    this.spotifySvc.getAllSongs();
  }

  getTopTracks() {
    this.spotifySvc.getTopTracks();
  }

  backToHome() {
    this.router.navigate(['/home'], {replaceUrl: true});
  }
}
