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
    'user-library-read%20user-top-read%20playlist-modify-private%20playlist-modify-public';

  private accessToken: any;
  private refreshToken: any;
  private userTrackData: any;
  private userSongAnalysis: any;
  private songs: Song[] = [];
  private songData: SongData[] = [];
  private filteredSongIdArray;

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

  async requestToken() {
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

  getUserId() {
    const url = 'https://accounts.spotify.com/v1/me';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(url, { headers }).subscribe(data => {
      console.log('USER ID: ' + data['id']);
    });
  }

  getArtist() { }

  getAlbum() { }

  getTrackInfo() { }

  getSong() { }

  async getSongsFromSpotify(nextUrl: string) {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    return this.http.get(nextUrl, { headers }).subscribe(async data => {
      this.userTrackData = data;
      // console.log(this.userTrackData);

      // Loop through array and grab data, then call endpoint again to reach next offset
      const length = this.userTrackData.items.length;
      for (let i = 0; i < length; i++) {
        const songName = this.userTrackData.items[i].track.name;
        const songId = this.userTrackData.items[i].track.id;
        const uri = this.userTrackData.items[i].track.uri;
        const artist = this.userTrackData.items[i].track.artists[0].name;
        const album = this.userTrackData.items[i].track.album.name;
        const popularity = this.userTrackData.items[i].track.popularity;
        const previewUrl = this.userTrackData.items[i].track.preview_url;

        const song: Song = new Song(songName, songId, artist, album, popularity, previewUrl, uri);
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
            first = false;
          } 
          else if (i % 99 === 0) {
            const response = await this.getSongData(idStr);
            await this.parseSongData(response);
            console.log(response);

            idStr = '';
            first = true;
            i--;
          } 
          else {
            idStr += ',' + this.songs[i].songId;

            if (i === this.songs.length - 1) {
              const response = await this.getSongData(idStr);
              await this.parseSongData(response);
              console.log(response);
              console.log('END OF LIST');
            }
          }
        }
      }
    });
  }

  async getSongData(ids: string) {
    const url = `https://api.spotify.com/v1/audio-features?ids=${ids}`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken
    });

    const response = await this.http.get(url, { headers }).toPromise();
    return response;
  }

  async parseSongData(data: any) {
    let songData: SongData;
    let tempo = 0;
    let danceability = 0;
    let happiness = 0;
    let energy = 0;
    let loudness = 0;
    for (let i = 0; i < data.audio_features.length; i++) {
      tempo = data.audio_features[i].tempo;
      danceability = data.audio_features[i].danceability;
      happiness = data.audio_features[i].valence;
      energy = data.audio_features[i].energy;
      loudness = data.audio_features[i].loudness;

      songData = new SongData(tempo, danceability, happiness, energy, loudness);
      this.songData.push(songData);
    }
  }

  mergeSongAndSongData() {
    for (let i = 0; i < this.songs.length; i++) {
      this.songs[i].setSongData(this.songData[i]);
    }
    console.log('Finished merging');
  }

  // 5sUm5SXdWTLNaR4tqE7jN4
  async addSongsToPlaylist(playlistId: string, songs: any[]) {

    this.createSongIdArray(songs);

    const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken,
      'Content-Type': 'application/json'
    });

    const body = {
      uris: this.filteredSongIdArray
    };

    let response = this.http.post(playlistUrl, body , {headers}).toPromise();
    return response;
  }

  createSongIdArray(songs: any[]) {
    const ids = [];
    for (let i = 0; i < songs.length; i++) {
      ids.push(songs[i].uri);
    }
    this.filteredSongIdArray = ids;
    this.filteredSongIdArray = JSON.stringify(this.filteredSongIdArray);
    this.filteredSongIdArray = JSON.parse(this.filteredSongIdArray);
  }




  getAllSongs() {
    return this.songs;
    // console.log(this.songs);
  }

  getAllSongData() {
    console.log('Sent song data');
    return this.songData;
  }

  async createPlaylist(playlistName: string) {
    const playlistUrl = 'https://api.spotify.com/v1/users/ldimuro/playlists';

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken,
      'Content-Type': 'application/json'
    });

    const body = {
      name: playlistName,
      description: 'Playlist generated using Song Sift'
    };

    const response = await this.http.post(playlistUrl, body , {headers}).toPromise();
    return response;

    // return this.http.post(playlistUrl, body , {headers})
    //   .subscribe(data => console.log(data));
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
