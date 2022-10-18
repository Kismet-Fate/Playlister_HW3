import React, { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedTo, setDraggedTo] = useState(false);

    const handleDragStart = (event) => {
        event.dataTransfer.setData('song', event.target.id);
        setIsDragging(true);
    };
    const handleDragOver = (event) => {
        event.preventDefault();
        setDraggedTo(true);
    };
    const handleDragEnter = (event) => {
        event.preventDefault();
        setDraggedTo(true);
    };
    const handleDragLeave = (event) => {
        event.preventDefault();
        setDraggedTo(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf('-') + 1);
        let sourceId = event.dataTransfer.getData('song');
        sourceId = sourceId.substring(sourceId.indexOf('-') + 1);
        setIsDragging(false);
        setDraggedTo(false);
        store.addMoveSongTransaction(parseInt(sourceId), parseInt(targetId));
    };

    const handleDeleteSong = (event) => {
        event.preventDefault();
        const showDeleteSongModal = () => {
            let modal = document.getElementById('delete-song-modal');
            modal.classList.add('is-visible');
        };
        store.selectSong(index);
        showDeleteSongModal();
    };

    const handleEditSong = (event) => {
        event.preventDefault();
        const showEditSongModal = () => {
            let modal = document.getElementById('edit-song-modal');
            modal.classList.add('is-visible');
        };
        store.selectSong(index);
        showEditSongModal();
    };

    const { song, index } = props;
    let cardClass = 'list-card unselected-list-card';
    return (
        <div
            key={index}
            id={'song-' + index}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable='true'
            onDoubleClick={handleEditSong}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className='song-link'
                href={'https://www.youtube.com/watch?v=' + song.youTubeId}
            >
                {song.title} by {song.artist}
            </a>
            <input
                type='button'
                id={'remove-song-' + index}
                className='list-card-button'
                value={'X'}
                onClick={handleDeleteSong}
            />
        </div>
    );
}

export default SongCard;
