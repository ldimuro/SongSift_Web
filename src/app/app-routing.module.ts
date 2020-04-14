import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import { NowPlayingComponent } from './nowPlaying/components/now-playing/now-playing.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { title: 'Song Sift' } },
  { path: 'now-playing', component: NowPlayingComponent, data: { title: 'Now Playing' }},
  { path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
