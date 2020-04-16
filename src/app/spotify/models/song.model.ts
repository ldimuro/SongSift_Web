import { SongData } from './songData.model';

export class Song {
    songName: string;
    songId: string;
    artist: string;
    album: string;
    popularity: number;
    data: SongData;

    constructor(songName: string, songId: string, artist: string, album: string, popularity: number) {
        this.songName = songName;
        this.songId = songId;
        this.artist = artist;
        this.album = album;
        this.popularity = popularity;
    }

    setSongData(data: SongData) {
        this.data = data;
    }
}
