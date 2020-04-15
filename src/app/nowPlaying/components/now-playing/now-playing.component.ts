import { Component, OnInit } from '@angular/core';
import { HomeComponent } from 'src/app/home/components/home/home.component';
import { NowPlayingService } from '../../services/now-playing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {

  code: string;

  constructor(private nowPlayingSvc: NowPlayingService) { }

  ngOnInit() {
    this.nowPlayingSvc.parseCode();
    console.log('CODE: ' + this.nowPlayingSvc.getCode());
  }

}
