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
  totalFilteredArray = [];

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
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['greaterThan', 'lessThan'],
        applyButton: true,
        resetButton: true
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
        applyButton: true,
        resetButton: true,
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
        applyButton: true,
        resetButton: true,
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
        applyButton: true,
        resetButton: true,
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
        previewUrl: this.songs[i].previewUrl,
        id: this.songs[i].songId,
        uri: this.songs[i].uri
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

  async applyFilter() {
    console.log(this.gridApi.getFilterModel());
    const filterModel = this.gridApi.getFilterModel();
    let filteredArray = this.rowDataArray;

    if (filterModel.loudness) {     // If LOUDNESS filter has been applied
      if (filterModel.loudness.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.loudness > filterModel.loudness.filter);
      }
      else if (filterModel.loudness.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.loudness < filterModel.loudness.filter);
      }
    }
    if (filterModel.energy) {       // If ENERGY filter has been applied
      if (filterModel.energy.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.energy > filterModel.energy.filter);
      }
      else if (filterModel.energy.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.energy < filterModel.energy.filter);
      }
    }
    if (filterModel.happiness) {    // If HAPPINESS filter has been applied
      if (filterModel.happiness.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.happiness > filterModel.happiness.filter);
      }
      else if (filterModel.happiness.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.happiness < filterModel.happiness.filter);
      }
    }
    if (filterModel.danceability) { // If DANCEABILITY filter has been applied
      if (filterModel.danceability.type === 'greaterThan') {
        filteredArray = filteredArray.filter(s => s.danceability > filterModel.danceability.filter);
      }
      else if (filterModel.danceability.type === 'lessThan') {
        filteredArray = filteredArray.filter(s => s.danceability < filterModel.danceability.filter);
      }
    }
    if (filterModel.artist) {       // If ARTIST filter has been applied
      if (filterModel.artist.type === 'contains') {
        const filterKeyword: string = filterModel.artist.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.artist.toString();
          const artistStr: string = temp.toLowerCase();
          return artistStr.includes(filterKeyword);
        });
      }
      else if (filterModel.artist.type === 'notContains') {
        const filterKeyword: string = filterModel.artist.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.artist.toString();
          const artistStr: string = temp.toLowerCase();
          return !artistStr.includes(filterKeyword);
        });
      }
    }
    if (filterModel.name) {         // If NAME filter has been applied
      if (filterModel.name.type === 'contains') {
        const filterKeyword: string = filterModel.name.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.name.toString();
          const nameStr: string = temp.toLowerCase();
          return nameStr.includes(filterKeyword);
        });
      }
      else if (filterModel.name.type === 'notContains') {
        const filterKeyword: string = filterModel.name.filter.toString().toLowerCase();
        filteredArray = filteredArray.filter(s => {
          const temp = s.name.toString();
          const nameStr: string = temp.toLowerCase();
          return !nameStr.includes(filterKeyword);
        });
      }
    }

    this.totalFilteredArray = filteredArray;
    console.log(this.totalFilteredArray);
  }

  async createPlaylist() {
    let result = window.prompt('Enter name for playlist');
    if (result === '') {
      result = 'Song Sift Playlist';
    }
    if (result !== null) {
      let response = await this.spotifySvc.createPlaylist(result);
      let playlistId = response['id'];
      console.log(response);
      console.log('Playlist created');

      await this.applyFilter();
      console.log('Filters applied');

      let tmpArray = [];
      let count = 0;
      for (let i = 0; i < this.totalFilteredArray.length; i++) {
        if (count === 99) {
          console.log('LIMIT OF 99 REACHED, ADD SONGS');
          await this.spotifySvc.addSongsToPlaylist(playlistId, tmpArray);
          i--;
          count = 0;
          tmpArray = [];
        }
        else if (i === this.totalFilteredArray.length - 1) {
          console.log('REACHED END OF ARRAY');
          tmpArray.push(this.totalFilteredArray[i]);
          await this.spotifySvc.addSongsToPlaylist(playlistId, tmpArray);
        }
        else {
          tmpArray.push(this.totalFilteredArray[i]);
          console.log('NOT AT 99 YET');
        }
        count++;
      }

      // this.spotifySvc.addSongsToPlaylist(playlistId, this.totalFilteredArray);
    }
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
