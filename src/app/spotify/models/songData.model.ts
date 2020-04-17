export class SongData {
    tempo: number;
    danceability: number;
    happiness: number;
    energy: number;
    loudness: number;

    constructor(tempo: number, danceability: number, happiness: number, energy: number, loudness: number) {
        this.tempo = tempo;
        this.danceability = danceability;
        this.happiness = happiness;
        this.energy = energy;
        this.loudness = loudness;
    }
}
