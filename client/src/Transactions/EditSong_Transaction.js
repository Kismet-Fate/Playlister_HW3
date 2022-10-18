import jsTPS_Transaction from '../common/jsTPS.js';
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(store, index, song1, song2){
        super();
        this.store = store;
        this.index = index;
        this.song1 = song1;
        this.song2 = song2;
    }
    doTransaction(){
        this.store.editSong(this.index, this.song2);
    }
    undoTransaction(){
        this.store.editSong(this.index, this.song1);
    }
}