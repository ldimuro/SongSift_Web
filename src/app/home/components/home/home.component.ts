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

  data: string;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {

  }

  // Spotify Login button
  loginButtonClicked() {
    this._spotifyService.getAuth();
  }

}
