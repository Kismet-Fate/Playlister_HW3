import React, { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    const [playlistTitle, setPlaylistTitle] = useState('');
    const hideDeleteListModal = () => {
        let modal = document.getElementById('delete-list-modal');
        modal.classList.remove('is-visible');
    };

    const handleDeleteList = () => {
        store.deletePlaylist(store.selectedListId);
        hideDeleteListModal();
    };

    useEffect(() => {
        setPlaylistTitle(store.getPlaylistNameById(store.selectedListId));}, [store.selectedListId]);

    return (
        <div class='modal' id='delete-list-modal' data-animation='slideInOutLeft'>
            <div class='modal-root' id='verify-delete-list-root'>
                <div class='modal-north'>Delete playlist?</div>
                <div class='modal-center'>
                    <div class='modal-center-content'>
                        Are you sure you wish to permanently delete the playlist,{' '}
                        <span>{playlistTitle}</span>?
                    </div>
                </div>
                <div class='modal-south'>
                    <input
                        type='button'
                        id='delete-list-confirm-button'
                        class='modal-button'
                        value='Confirm'
                        onClick={handleDeleteList}
                    />
                    <input
                        type='button'
                        id='delete-list-cancel-button'
                        class='modal-button'
                        value='Cancel'
                        onClick={hideDeleteListModal}
                    />
                </div>
            </div>
        </div>
    );
}

export default DeleteListModal;
