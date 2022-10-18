import { createContext, useState } from 'react';
import jsTPS, { jsTPS_Transaction } from '../common/jsTPS';
import api from '../api';
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: 'CHANGE_LIST_NAME',
    CLOSE_CURRENT_LIST: 'CLOSE_CURRENT_LIST',
    CREATE_NEW_LIST: 'CREATE_NEW_LIST',
    LOAD_ID_NAME_PAIRS: 'LOAD_ID_NAME_PAIRS',
    SET_CURRENT_LIST: 'SET_CURRENT_LIST',
    SET_LIST_NAME_EDIT_ACTIVE: 'SET_LIST_NAME_EDIT_ACTIVE',
    SELECT_LIST_TO_DELETE: 'SELECT_LIST_TO_DELETE',
    SELECT_SONG: 'SELECT_SONG',
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

export const useGlobalStore = () => {

    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        selectedListId: '',
        selectedSongIdx: -1,
        selectedSong: { title: '', artist: '', youTubeId: '' },
    });

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {

            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedListId: '',
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }

            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedListId: '',
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }

            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    selectedListId: '',
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }

            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedListId: '',
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }

            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedListId: '',
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }

            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedListId: '',
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }

            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    selectedListId: '',
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }

            case GlobalStoreActionType.SELECT_LIST_TO_DELETE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedListId: payload,
                    selectedSongIdx: -1,
                    selectedSong: { title: '', artist: '', youTubeId: '' },
                });
            }
            case GlobalStoreActionType.SELECT_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedListId: '',
                    selectedSongIdx: payload.index,
                    selectedSong: payload.song,
                });
            }
            default:
                return store;
        }
    };

    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist,
                                    },
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    };

    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {},
        });
        tps.clearAllTransactions();
    };

    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray,
                });
            } else {
                console.log('API FAILED TO GET THE LIST PAIRS');
            }
        }
        asyncLoadIdNamePairs();
    };

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist,
                    });
                    store.history.push('/playlist/' + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    };
    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    };
    store.undo = function () {
        tps.undoTransaction();
    };
    store.redo = function () {
        tps.doTransaction();
    };

    store.canUndo = () => {
        return tps.hasTransactionToUndo();
    };
    store.canRedo = () => {
        return tps.hasTransactionToRedo();
    };
    store.hasCurrentList = () => {
        return store.currentList !== null;
    };
    store.getPlaylistNameById = (id) => {
        const idNamePairs = store.idNamePairs;
        const name = idNamePairs.filter((item) => {
            return item._id === id;
        })[0].name;
        return name;
    };

    store.setListNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null,
        });
    };

    store.createNewList = () => {
        const playlist = { name: 'untitled', songs: [] };
        const asyncCreateNewList = async () => {
            const response = await api.createPlaylist(playlist);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist,
                    });
                    store.history.push('/playlist/' + playlist._id);
                }
            }
        };
        asyncCreateNewList();
    };

    store.selectListToDelete = (id) => {
        storeReducer({
            type: GlobalStoreActionType.SELECT_LIST_TO_DELETE,
            payload: id,
        });
    };

    store.deletePlaylist = (id) => {
        async function asyncDeletePlaylist(id) {
            let response = await api.getPlaylistById(id);
            let playlist = response.data.playlist;
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {},
                });
                async function deleteList(playlist) {
                    response = await api.deletePlaylistById(playlist._id);
                    store.loadIdNamePairs();
                }
                deleteList(playlist);
            }
        }
        asyncDeletePlaylist(id);
    };

    store.moveSong = (start, end) => {
        const list = store.currentList;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        } else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        async function asyncUpdatePlaylist(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list,
                });
            }
        }

        asyncUpdatePlaylist(list);
    };

    store.addMoveSongTransaction = (initOldSongIndex, initNewSongIndex) => {
        const transaction = new MoveSong_Transaction(
            store,
            initOldSongIndex,
            initNewSongIndex
        );
        tps.addTransaction(transaction);
    };

    store.selectSong = (index) => {
        const song = store.currentList.songs[index];
        storeReducer({
            type: GlobalStoreActionType.SELECT_SONG,
            payload: { index: index, song: song },
        });
    };

    store.deleteSong = (index) => {
        const list = store.currentList;
        const removedSong = list.songs.splice(index, 1)[0];
        async function asyncUpdatePlaylist(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list,
                });
            }
        }

        asyncUpdatePlaylist(list);
        return removedSong;
    };

    store.addDeleteSongTransaction = (index) => {
        let transaction = new DeleteSong_Transaction(store, index);
        tps.addTransaction(transaction);
    };

    store.addSong = (songIdx, song) => {
        const list = store.currentList;
        if (store.selectedSongIdx !== -1) list.songs.splice(songIdx, 0, song);
        else list.songs.push(song);
        async function asyncUpdatePlaylist(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list,
                });
            }
        }

        asyncUpdatePlaylist(list);
    };

    store.addAddSongTransaction = () => {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    };

    store.editSong = (songIdx, editedSong) => {
        const list = store.currentList;
        let song = list.songs[songIdx];
        song.title = editedSong.title;
        song.artist = editedSong.artist;
        song.youTubeId = editedSong.youTubeId;
        async function asyncUpdatePlaylist(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list,
                });
            }
        }
        asyncUpdatePlaylist(list);
    };

    store.addEditSongTransaction = (editedSong) => {
        const uneditedSong = store.currentList.songs[store.selectedSongIdx];
        const uneditedSongClone = {
            title: uneditedSong.title,
            artist: uneditedSong.artist,
            youTubeId: uneditedSong.youTubeId,
        };
        const transaction = new EditSong_Transaction(
            store,
            store.selectedSongIdx,
            uneditedSongClone,
            editedSong
        );
        tps.addTransaction(transaction);
    };

    return { store, storeReducer };
};
