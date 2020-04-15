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
    '&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fnow-playing%2F';

  private accessToken: any;
  private refreshToken: any;

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
      .set('scope', 'user-read-private');
    const options = {
      headers,
      params
    };

    console.log(this.url);
    window.location.href = this.url;

    //return this.http.get(this.url, { responseType: 'text' });
    //.subscribe(response => console.log(response));
  }

  getToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
    // });

    // const params = new HttpParams()
    //   .set('grant_type', 'authorization_code')
    //   .set('code', this.nowPlayingSvc.getCode())
    //   .set('redirect_uri', 'http://localhost:4200/now-playing/');
    // const options = {
    //   headers,
    //   params
    // };

    const headers = { 'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
                      'Content-Type': 'application/x-www-form-urlencoded'};

    const body = {grant_type: 'authorization_code',
                  code: this.nowPlayingSvc.getCode(),
                  redirect_uri: encodeURIComponent('http://localhost:4200/now-playing/')};

    const newBody = `grant_type=authorization_code&code=${this.nowPlayingSvc.getCode()}&redirect_uri=${encodeURIComponent('http://localhost:4200/now-playing/')}`;


    return this.http.post(tokenUrl, newBody, {headers}).subscribe(data => {
      console.log(data);
      this.accessToken = data['access_token'];
      this.refreshToken = data['refresh_token'];
    });

  }

  getArtist() {
    // const url = 'https://api.spotify.com/v1/';

    // const headers: HttpHeaders = new HttpHeaders({
    //   'Authorization': 'Bearer BQBCmAvTI8T_Z639OSpM8hwiq0y7zQFqc72b1bw-ze9x6huOW0ghH7YVFrtDSjw0xc4UWPxMI1VHOkKHOdE'
    // });

    // return this.http.get(url + `search?q=weezer&type=artist&market=SV&offset=0&limit=20`, {headers})
    //   .subscribe(data => console.log(data));
  }


}
