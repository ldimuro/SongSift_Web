import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/components/home/home.component';
import { NowPlayingComponent } from './nowPlaying/components/now-playing/now-playing.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { SpotifyComponent } from './spotify/components/spotify/spotify.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NowPlayingComponent,
    SpotifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonToggleModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatRadioModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    MatSlideToggleModule,
    FormsModule
  ],
  exports: [MatButtonToggleModule, MatIconModule, ReactiveFormsModule, BrowserAnimationsModule, MatRadioModule],
  providers: [HomeComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
