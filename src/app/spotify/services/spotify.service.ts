import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { map, filter, switchMap } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NowPlayingService } from 'src/app/nowPlaying/services/now-playing.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = '30a58f631e5d4a0d8331fc0d29e052f9';
  private clientSecret = '42c2e656f635427c95618a49a1c6ce07';
  private body: any;
  private url = 'https://accounts.spotify.com/authorize?client_id=30a58f631e5d4a0d8331fc0d29e052f9' +
    '&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fnow-playing%2F&scope=user-read-private%20' +
    'user-library-read%20user-top-read';

  private accessToken: any;
  private refreshToken: any;
  private userTrackData: any;

  constructor(private http: HttpClient,
              private nowPlayingSvc: NowPlayingService) { }

  // Get access token from Spotify to use API
  getAuth() {
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Authorization': 'Basic YW5ndWxhcjphbmd1bGFy'
    });

    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('response_type', 'code')
      .set('redirect_uri', 'http://localhost:4200/now-playing/')
      .set('scope', 'user-read-private')
      .set('scope', 'user-library-read');
    const options = {
      headers,
      params
    };

    console.log(this.url);
    window.location.href = this.url;
  }

  getToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const headers = { 'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
                      'Content-Type': 'application/x-www-form-urlencoded'};

    const body = {grant_type: 'authorization_code',
                  code: this.nowPlayingSvc.getCode(),
                  redirect_uri: encodeURIComponent('http://localhost:4200/now-playing/')};

    // tslint:disable-next-line:max-line-length
    const newBody = `grant_type=authorization_code&code=${this.nowPlayingSvc.getCode()}&redirect_uri=${encodeURIComponent('http://localhost:4200/now-playing/')}`;


    return this.http.post(tokenUrl, newBody, {headers}).subscribe(data => {
      console.log(data);
      this.accessToken = data['access_token'];
      this.refreshToken = data['refresh_token'];
    });

  }

  getArtist() {
    const url = 'https://api.spotify.com/v1/';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url + `search?q=weezer&type=artist&market=SV&offset=0&limit=20`, {headers})
      .subscribe(data => console.log(data));
  }

  getAlbum() {
    const url = 'https://api.spotify.com/v1/';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url + `search?q=weezer&type=album&market=SV&offset=0&limit=20`, {headers})
      .subscribe(data => console.log(data));
  }

  getTrackInfo() {
    const url = 'https://api.spotify.com/v1/';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    // ID #1: Bodysnatchers
    // ID #2: Let It Happen
    // ID #3: To Build A Home

    return this.http.get(url + `audio-features?ids=4m0Vgr48VFaMYw0Sp1ozJu,2X485T9Z5Ly0xyaghN73ed,3AqPL1n1wKc5DVFFnYuJhp`, {headers})
      .subscribe(data => console.log(data));
  }

  getSong() {
    const url = 'https://api.spotify.com/v1/';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url + `search?q=to%20build%20a%20home&type=track&market=US&offset=0&limit=20`, {headers})
      .subscribe(data => console.log(data));
  }

  getUserTracks(nextUrl: string) {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(nextUrl, {headers}).subscribe(data => {
      this.userTrackData = data;
      console.log(this.userTrackData);
      console.log('# of tracks: ' + this.userTrackData.items.length);

      // Loop through array and grab data, then call endpoint again to reach next offset
      const length = this.userTrackData.items.length;
      for (let i = 0; i < length; i++) {
        console.log(this.userTrackData.items[i].track.name);
      }
      this.getUserTracks(this.userTrackData.next);
    });
  }

  getTopTracks() {
    const url = 'https://api.spotify.com/v1/me/top/tracks';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url, {headers}).subscribe(data => {
        console.log(data);
      });
  }


}
