import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { map, filter, switchMap } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = '30a58f631e5d4a0d8331fc0d29e052f9';
  private clientSecret = '42c2e656f635427c95618a49a1c6ce07';
  private body: any;
  private url = 'https://accounts.spotify.com/authorize?client_id=30a58f631e5d4a0d8331fc0d29e052f9' +
    '&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fnow-playing%2F';

  constructor(private http: HttpClient) { }

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YW5ndWxhcjphbmd1bGFy'
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
