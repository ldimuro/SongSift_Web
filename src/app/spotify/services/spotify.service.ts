import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { map, filter, switchMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private searchUrl: string;
  private clientId = '30a58f631e5d4a0d8331fc0d29e052f9';
  private clientSecret = '42c2e656f635427c95618a49a1c6ce07';
  private body: any;

  constructor(private http: HttpClient) { }

  // Get access token from Spotify to use API
  getAuth() {
    let searchUrl = 'https://api.spotify.com/v1/search?query=weezer&offset=0&limit=30&type=artist&market=US';

    return this.http.get(this.searchUrl);
    // const headers = new HttpHeaders();
    // headers.append('Authorization', 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`));


  }





}
