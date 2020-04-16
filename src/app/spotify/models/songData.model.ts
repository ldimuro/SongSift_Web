export class SongData {
    tempo: number;
    danceability: number;
    happiness: number;
    energy: number;

    constructor(tempo: number, danceability: number, happiness: number, energy: number) {
        this.tempo = tempo;
        this.danceability = danceability;
        this.happiness = happiness;
        this.energy = energy;
    }
}
