import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/components/home/home.component';
import { NowPlayingComponent } from './nowPlaying/components/now-playing/now-playing.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NowPlayingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonToggleModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
