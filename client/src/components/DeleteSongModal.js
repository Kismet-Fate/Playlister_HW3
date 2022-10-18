import React, { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';

const DeleteSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const [songTitle, setSongTitle] = useState('');
    const hideDeleteSongModal = () => {
        let modal = document.getElementById('delete-song-modal');
        modal.classList.remove('is-visible');
    };
    const handleDeleteSong = () => {
        store.addDeleteSongTransaction(store.selectedSongIndex);
        hideDeleteSongModal();
    };

    useEffect(() => {
        setSongTitle(store.selectedSong.title);
    }, [store.selectedSong]);
    return (
        <div class='modal' id='delete-song-modal' data-animation='slideInOutLeft'>
            <div class='modal-root' id='verify-delete-song-root'>
                <div class='modal-north'>Remove song?</div>
                <div class='modal-center'>
                    <div class='modal-center-content'>
                        Are you sure you wish to permanently delete the song,{' '}
                        <span id='song-title-text'>{songTitle}</span>?
                    </div>
                </div>
                <div class='modal-south'>
                    <input
                        type='button'
                        id='delete-song-confirm-button'
                        class='modal-button'
                        onClick={handleDeleteSong}
                        value='Confirm'
                    />
                    <input
                        type='button'
                        id='delete-song-cancel-button'
                        class='modal-button'
                        onClick={hideDeleteSongModal}
                        value='Cancel'
                    />
                </div>
            </div>
        </div>
    );
};

export default DeleteSongModal;
