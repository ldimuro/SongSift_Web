import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchStr: string;
  query: FormControl = new FormControl();

  favoriteSeason: string;
  seasons: string[] = ['1', '2', '3', '4', '5'];

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {

  }

  buttonClicked() {
    console.log('it worked');
  }

}
