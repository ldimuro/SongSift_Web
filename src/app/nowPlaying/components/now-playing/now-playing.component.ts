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

  private gridApi;
  private gridColumnApi;
  rowSelection = 'single';

  audio = new Audio();

  columnDefs = [
    { headerName: '', field: 'index', width: 75 },
    { headerName: 'Name', field: 'name', width: 300, sortable: true },
    { headerName: 'Artist', field: 'artist', width: 300, sortable: true, filter: true  },
    { headerName: 'Tempo', field: 'tempo', width: 150, sortable: true },
    { headerName: 'Danceability', field: 'danceability', width: 150, sortable: true },
    { headerName: 'Happiness', field: 'happiness', width: 150, sortable: true },
    { headerName: 'Energy', field: 'energy', width: 150, sortable: true },
    { headerName: 'Loudness', field: 'loudness', width: 150, sortable: true, }
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

    // setTimeout(() => {
    //   this.spotifySvc.getUserId();
    // }, 1500);

    setTimeout(() => {
      this.getSongsFromSpotify();
    }, 2000);

    setTimeout(() => {
      this.getAllSongData();
    }, 10000);

    setTimeout(() => {
      this.mergeSongAndSongData();
    }, 11000);

    setTimeout(() => {
      this.getAllSongs();
    }, 12000);
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
        index: i + 1,
        name: this.songs[i].songName,
        artist: this.songs[i].artist,
        tempo: this.songs[i].data.tempo,
        danceability: this.songs[i].data.danceability,
        happiness: this.songs[i].data.happiness,
        energy: this.songs[i].data.energy,
        loudness: this.songs[i].data.loudness,
        previewUrl: this.songs[i].previewUrl
      };

      this.rowDataArray.push(x);
    }

    const filteredArray = this.rowDataArray.filter(s => s.energy >= 0.9 && s.happiness >= 0.7);
    console.log('Finished formatting response');

    // this.rowData = this.rowDataArray;
    this.rowData = filteredArray;
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

  getUserId() {
    this.spotifySvc.getUserId();
  }

  createPlaylist() {
    let result = window.prompt('Enter name for playlist');
    if (result === '') {
      result = 'Song Sift Playlist';
    }
    this.spotifySvc.createPlaylist(result);
  }

  backToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    const url = selectedRows[0].previewUrl;

    this.audio.src = url;
    this.audio.play();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

}
