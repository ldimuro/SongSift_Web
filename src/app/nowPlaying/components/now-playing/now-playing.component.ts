import { Component, OnInit } from '@angular/core';
import { HomeComponent } from 'src/app/home/components/home/home.component';
import { NowPlayingService } from '../../services/now-playing.service';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { Song } from 'src/app/spotify/models/song.model';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {

  code: string;
  token: string;
  songs: Song[] = [];
  rowDataArray = [];

  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Artist', field: 'artist', sortable: true },
    { headerName: 'Tempo', field: 'tempo', sortable: true },
    { headerName: 'Danceability', field: 'danceability', sortable: true },
    { headerName: 'Happiness', field: 'happiness', sortable: true },
    { headerName: 'Energy', field: 'energy', sortable: true },
    { headerName: 'Loudness', field: 'loudness', sortable: true, }
  ];

  rowData: any;

  constructor(private nowPlayingSvc: NowPlayingService,
              private spotifySvc: SpotifyService,
              private router: Router) { }

  ngOnInit() {
    this.nowPlayingSvc.parseCode();
    console.log('CODE: ' + this.nowPlayingSvc.getCode());

    setTimeout(() => {
      this.requestToken();
    }, 1000);

    setTimeout(() => {
      this.getSongsFromSpotify();
    }, 2000);

    setTimeout(() => {
      this.getAllSongData();
    }, 8000);

    setTimeout(() => {
      this.mergeSongAndSongData();
    }, 9000);

    setTimeout(() => {
      this.getAllSongs();
    }, 10000);
  }

  requestToken() {
    this.spotifySvc.requestToken();
  }

  getSongsFromSpotify() {
    this.spotifySvc.getSongsFromSpotify('https://api.spotify.com/v1/me/tracks?market=US&offset=0&limit=50');
  }

  getAllSongs() {
    const response = this.spotifySvc.getAllSongs();
    this.songs = response;

    for (let i = 0; i < this.songs.length; i++) {
      const x = {
        name: this.songs[i].songName,
        artist: this.songs[i].artist,
        tempo: this.songs[i].data.tempo,
        danceability: this.songs[i].data.danceability,
        happiness: this.songs[i].data.happiness,
        energy: this.songs[i].data.energy,
        loudness: this.songs[i].data.loudness
      };

      this.rowDataArray.push(x);
    }
    console.log('Finished formatting response');

    this.rowData = this.rowDataArray;
    // console.log(response);
  }

  getAllSongData() {
    const response = this.spotifySvc.getAllSongData();
  }

  mergeSongAndSongData() {
    this.spotifySvc.mergeSongAndSongData();
  }

  getTopTracks() {
    this.spotifySvc.getTopTracks();
  }

  getTrackData() {
    this.spotifySvc.getTrackInfo();
  }

  backToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
