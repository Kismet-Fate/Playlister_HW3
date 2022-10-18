import jsTPS_Transaction from '../common/jsTPS.js';
export default class AddSong_Transaction extends jsTPS_Transaction{

    constructor(store) {
        super();
        this.store = store;
        this.song = {
            title: 'Untitled',
            artist: 'Unknown',
            youTubeId: 'dQw4w9WgXcQ',
        };
        this.index = this.store.getPlaylistSize()-1;
    }
    doTransaction() {
        this.store.addSong(this.index, this.song);
    }
    undoTransaction() {
        this.store.deleteSong(this.index);
    }
}