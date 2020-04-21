import { Component, OnInit } from '@angular/core';
import { HomeComponent } from 'src/app/home/components/home/home.component';
import { NowPlayingService } from '../../services/now-playing.service';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { Song } from 'src/app/spotify/models/song.model';
import { filter } from 'rxjs/operators';

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
        suppressAndOrCondition: true,
        filterOptions: ['contains', 'notContains']
      }
    },
    {
      headerName: 'Artist',
      field: 'artist',
      width: 300,
      sortable: true,
      filter: true,
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['contains', 'notContains']
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
    const filterModel = this.gridApi.getFilterModel();
    let filteredArray = this.rowDataArray;

    if (filterModel.loudness) {
      console.log('has loudness');
      if (filterModel.loudness.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.loudness > filterModel.loudness.filter);
        console.log('Filter out songs with loudness > ' + filterModel.loudness.filter);
      }
      else if (filterModel.loudness.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.loudness < filterModel.loudness.filter);
        console.log('Filter out songs with loudness < ' + filterModel.loudness.filter);
      }
    }
    if (filterModel.energy) {
      console.log('has energy');
      if (filterModel.energy.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.energy > filterModel.energy.filter);
        console.log('Filter out songs with energy > ' + filterModel.energy.filter);
      }
      else if (filterModel.energy.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.energy < filterModel.energy.filter);
        console.log('Filter out songs with energy < ' + filterModel.energy.filter);
      }
    }
    if (filterModel.happiness) {
      console.log('has happiness');
      if (filterModel.happiness.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.happiness > filterModel.happiness.filter);
        console.log('Filter out songs with happiness > ' + filterModel.happiness.filter);
      }
      else if (filterModel.happiness.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.happiness < filterModel.happiness.filter);
        console.log('Filter out songs with happiness < ' + filterModel.happiness.filter);
      }
    }
    if (filterModel.danceability) {
      console.log('has danceability');
      if (filterModel.danceability.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.danceability > filterModel.danceability.filter);
        console.log('Filter out songs with danceability > ' + filterModel.danceability.filter);
      }
      else if (filterModel.danceability.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.danceability < filterModel.danceability.filter);
        console.log('Filter out songs with danceability < ' + filterModel.danceability.filter);
      }
    }
    if (filterModel.artist) {
      console.log('has artist');
      if (filterModel.artist.type === 'contains') {
        const filterKeyword: string = filterModel.artist.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.artist.toString();
          const artistStr: string = temp.toLowerCase();
          return artistStr.includes(filterKeyword);
        });
        console.log('Filter out songs that contain: ' + filterKeyword);
      }
      else if (filterModel.artist.type === 'notContains') {
        const filterKeyword: string = filterModel.artist.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.artist.toString();
          const artistStr: string = temp.toLowerCase();
          return !artistStr.includes(filterKeyword);
        });
        console.log('Filter out songs that dont contain: ' + filterModel.artist.filter);
      }
    }
    if (filterModel.name) {
      console.log('has name');
      if (filterModel.name.type === 'contains') {
        const filterKeyword: string = filterModel.name.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.name.toString();
          const nameStr: string = temp.toLowerCase();
          return nameStr.includes(filterKeyword);
        });
        console.log('Filter out songs that contain: ' + filterModel.name.filter);
      }
      else if (filterModel.name.type === 'notContains') {
        const filterKeyword: string = filterModel.name.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.name.toString();
          const nameStr: string = temp.toLowerCase();
          return !nameStr.includes(filterKeyword);
        });
        console.log('Filter out songs that dont contain: ' + filterModel.name.filter);
      }
    }

    console.log('ROWDATA = ' + this.rowData.length + ' | FILTEREDARRAY = ' +  filteredArray.length);
    console.log(filteredArray);
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
