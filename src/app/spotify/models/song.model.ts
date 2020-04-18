import { SongData } from './songData.model';

export class Song {
    songName: string;
    songId: string;
    artist: string;
    album: string;
    popularity: number;
    previewUrl: string;
    data: SongData;

    constructor(songName: string, songId: string, artist: string, album: string, popularity: number, previewUrl: string) {
        this.songName = songName;
        this.songId = songId;
        this.artist = artist;
        this.album = album;
        this.popularity = popularity;
        this.previewUrl = previewUrl;
    }

    setSongData(data: SongData) {
        this.data = data;
    }
}
