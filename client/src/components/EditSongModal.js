import React, { useState, useContext, useEffect } from 'react';
import { __RouterContext } from 'react-router';
import { GlobalStoreContext } from '../store';

const EditSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [youTubeId, setYouTubeId] = useState('');
    const hideEditSongModal = () => {
        let modal = document.getElementById('edit-song-modal');
        modal.classList.remove('is-visible');
    };
    const handleEditSong = () => {
        let editedSong = { title: title, artist: artist, youTubeId: youTubeId };
        store.addEditSongTransaction(editedSong);
        setTitle('');
        setArtist('');
        setYouTubeId('');
        hideEditSongModal();
    };

    useEffect(() => {
        setTitle(store.selectedSong.title);
        setArtist(store.selectedSong.artist);
        setYouTubeId(store.selectedSong.youTubeId);
    }, [store.selectedSong]);

    return (
        <div class='modal' id='edit-song-modal' data-animation='slideInOutLeft'>
            <div class='modal-root' id='verify-edit-song-root'>
                <div class='modal-north'>Edit Song</div>
                <div class='modal-center'>
                    <div class='modal-center-content'>
                        <div class='edit-song-modal-row'>
                            <span class='modal-label'>Title:</span>
                            <input
                                type='text'
                                id='edit-song-title-form'
                                class='modal-form'
                                value={title}
                                placeholder=''
                                onChange={(event) => setTitle(event.target.value)}
                            />
                        </div>
                        <div class='edit-song-modal-row'>
                            <span class='modal-label'>Artist:</span>
                            <input
                                type='text'
                                id='edit-song-artist-form'
                                class='modal-form'
                                value={artist}
                                placeholder=''
                                onChange={(event) => setArtist(event.target.value)}
                            />
                        </div>
                        <div class='edit-song-modal-row'>
                            <span class='modal-label'>YouTubeId:</span>
                            <input
                                type='text'
                                id='edit-song-youTubeId-form'
                                class='modal-form'
                                value={youTubeId}
                                placeholder=''
                                onChange={(event) => setYouTubeId(event.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div class='modal-south'>
                    <input
                        type='button'
                        id='edit-song-confirm-button'
                        class='modal-button'
                        value='Confirm'
                        onClick={handleEditSong}
                    />
                    <input
                        type='button'
                        id='edit-song-cancel-button'
                        class='modal-button'
                        value='Cancel'
                        onClick={hideEditSongModal}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditSongModal;
