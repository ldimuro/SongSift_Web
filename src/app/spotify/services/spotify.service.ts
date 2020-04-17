import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { map, filter, switchMap } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NowPlayingService } from 'src/app/nowPlaying/services/now-playing.service';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';
import { SongData } from '../models/songData.model';

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
  private userSongAnalysis: any;
  private songs: Song[] = [];
  private songData: SongData[] = [];

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

  requestToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const headers = {
      'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = {
      grant_type: 'authorization_code',
      code: this.nowPlayingSvc.getCode(),
      redirect_uri: encodeURIComponent('http://localhost:4200/now-playing/')
    };

    // tslint:disable-next-line:max-line-length
    const newBody = `grant_type=authorization_code&code=${this.nowPlayingSvc.getCode()}&redirect_uri=${encodeURIComponent('http://localhost:4200/now-playing/')}`;


    return this.http.post(tokenUrl, newBody, { headers }).subscribe(data => {
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

    return this.http.get(url + `search?q=weezer&type=artist&market=SV&offset=0&limit=20`, { headers })
      .subscribe(data => console.log(data));
  }

  getAlbum() {
    const url = 'https://api.spotify.com/v1/';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url + `search?q=weezer&type=album&market=SV&offset=0&limit=20`, { headers })
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
    // ID #4: Young Lion

    return this.http.get(url + `audio-features?ids=4m0Vgr48VFaMYw0Sp1ozJu,2X485T9Z5Ly0xyaghN73ed,3AqPL1n1wKc5DVFFnYuJhp,570ocPyYy6lgJPnPAo66cZ`, { headers })
      .subscribe(data => console.log(data));
  }

  getSong() {
    const url = 'https://api.spotify.com/v1/';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url + `search?q=to%20build%20a%20home&type=track&market=US&offset=0&limit=20`, { headers })
      .subscribe(data => console.log(data));
  }

  getSongsFromSpotify(nextUrl: string) {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(nextUrl, { headers }).subscribe(data => {
      this.userTrackData = data;
      // console.log(this.userTrackData);

      // Loop through array and grab data, then call endpoint again to reach next offset
      const length = this.userTrackData.items.length;
      for (let i = 0; i < length; i++) {
        const songName = this.userTrackData.items[i].track.name;
        const songId = this.userTrackData.items[i].track.id;
        const artist = this.userTrackData.items[i].track.artists[0].name;
        const album = this.userTrackData.items[i].track.album.name;
        const popularity = this.userTrackData.items[i].track.popularity;

        const song: Song = new Song(songName, songId, artist, album, popularity);
        // const songData: SongData = this.getSongData(songId);
        // song.setSongData(songData);

        this.songs.push(song);
      }
      if (this.userTrackData.next !== null) {
        this.getSongsFromSpotify(this.userTrackData.next);
        console.log(this.userTrackData.offset + '/' + this.userTrackData.total);
      } else {
        console.log('Done getting songs');

        let idStr = '';
        let first = true;
        for (let i = 0; i < this.songs.length; i++) {
          if (first) {
            idStr += this.songs[i].songId;
            // console.log(i + 1 + '.\t' + this.songs[i].songName);
            first = false;
          } else if (i % 99 === 0) {
            // console.log('============LIMIT REACHED============');
            this.getSongData(idStr);

            idStr = '';
            first = true;
            i--;
          } else {
            idStr += ',' + this.songs[i].songId;
            // console.log(i + 1 + '.\t' + this.songs[i].songName);

            if (i === this.songs.length - 1) {
              console.log('END OF LIST');
              // this.getSongData(idStr);

              setTimeout(() => {
                this.getSongData(idStr);
              }, 1500);
            }
          }
        }
      }
    });
  }

  getSongData(ids: string) {
    const url = `https://api.spotify.com/v1/audio-features?ids=${ids}`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    let songData: SongData;
    this.http.get(url, { headers }).subscribe(data => {
      this.userSongAnalysis = data;
      console.log(this.userSongAnalysis);

      let tempo = 0;
      let danceability = 0;
      let happiness = 0;
      let energy = 0;
      let loudness = 0;
      for (let i = 0; i < this.userSongAnalysis.audio_features.length; i++) {
        tempo = this.userSongAnalysis.audio_features[i].tempo;
        danceability = this.userSongAnalysis.audio_features[i].danceability;
        happiness = this.userSongAnalysis.audio_features[i].valence;
        energy = this.userSongAnalysis.audio_features[i].energy;
        loudness = this.userSongAnalysis.audio_features[i].loudness;

        songData = new SongData(tempo, danceability, happiness, energy, loudness);
        this.songData.push(songData);
      }
    });
  }

  mergeSongAndSongData() {
    for (let i = 0; i < this.songs.length; i++) {
      this.songs[i].setSongData(this.songData[i]);
    }
    console.log('Finished merging');
  }

  getAllSongs() {
    return this.songs;
    // console.log(this.songs);
  }

  getAllSongData() {
    console.log('Sent song data');
    return this.songData;
  }

  getTopTracks() {
    const url = 'https://api.spotify.com/v1/me/top/tracks';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url, { headers }).subscribe(data => {
      console.log(data);
    });
  }


}
