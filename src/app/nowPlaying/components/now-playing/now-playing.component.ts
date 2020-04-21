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
    {
      headerName: 'Name',
      field: 'name',
      width: 300,
      sortable: true,
      filter: true,
      filterParams: {
        filterOptions: ['contains']
      }
    },
    {
      headerName: 'Artist',
      field: 'artist',
      width: 300,
      sortable: true,
      filter: true,
      filterParams: {
        filterOptions: ['contains']
      }
    },
    {
      headerName: 'Danceability',
      field: 'danceability',
      width: 150, sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['greaterThan', 'lessThan']
      }
    },
    {
      headerName: 'Happiness',
      field: 'happiness',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['greaterThan', 'lessThan']
      }
    },
    {
      headerName: 'Energy',
      field: 'energy',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['greaterThan', 'lessThan']
      }
    },
    {
      headerName: 'Loudness',
      field: 'loudness',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['greaterThan', 'lessThan']
      }
    }
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
        name: this.songs[i].songName,
        artist: this.songs[i].artist,
        danceability: this.songs[i].data.danceability,
        happiness: this.songs[i].data.happiness,
        energy: this.songs[i].data.energy,
        loudness: this.songs[i].data.loudness,
        previewUrl: this.songs[i].previewUrl
      };

      this.rowDataArray.push(x);
    }

    // +energy && +happiness    = YES (71 songs)
    // +energy && -happiness    = NO
    // +energy && +danceability = NO
    // +energy && -danceability = NO
    // +energy && +loudness     = YES (70 songs)
    // +energy && -loudness     = NO
    // -energy && +happiness    = NO
    // -energy && -happiness    = YES (44 songs)
    // -energy && +danceability = MAYBE (6 songs)


    let highEnergy = 0.85;
    let lowEnergy = 0.3;

    let highHappiness = 0.75;
    let lowHappiness = 0.3;

    // NO NEED FOR LOW DANCEABILITY
    let highDance = 0.8;

    let highVolume = -3.5;
    let lowVolume = -10;

    const filteredArray = this.rowDataArray.filter(s => s.energy >= highEnergy && s.loudness >= highVolume);
    // const filteredArray = this.rowDataArray.filter(s => s.energy <= lowEnergy && s.danceability >= highDance);
    console.log('Finished formatting response: ' + filteredArray.length + ' songs');

    this.rowData = this.rowDataArray;
    // this.rowData = filteredArray;
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

  getFilterModel() {
    console.log(this.gridApi.getFilterModel());
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
