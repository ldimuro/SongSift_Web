import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { map, filter, switchMap } from 'rxjs/operators';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private searchUrl: string;
  private clientId = '30a58f631e5d4a0d8331fc0d29e052f9';
  private clientSecret = '42c2e656f635427c95618a49a1c6ce07';
  private body: any;

  constructor(private _http: HttpClient) { }

  // Get access token from Spotify to use API
  getAuth() {
    // // tslint:disable-next-line: deprecation
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic ' + btoa(this.clientId + ':' + this.clientSecret));
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // // tslint:disable-next-line: deprecation
    // const params: URLSearchParams = new URLSearchParams();
    // params.set('grant_type', 'client_credentials');
    // const body = params.toString();

    // return this._http.post('https://accounts.spotify.com/api/token', body, { headers })
    //   .pipe(map((response: any) => response.json()));
  }





}
