import jsTPS_Transaction from '../common/jsTPS.js';
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(store, index) {
        super();
        this.store = store;
        this.index = index;
    }
    doTransaction() {
        this.song = this.store.deleteSong(this.index);
    }
    undoTransaction() {
        this.store.addSong(this.index, this.song);
    }
}