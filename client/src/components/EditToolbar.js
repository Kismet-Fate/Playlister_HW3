import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
  
    let enabledButtonClass = 'playlister-button';
  
    const handleAddSong = () => {
      store.addAddSongTransaction();
    };
    function handleUndo() {
      store.undo();
    }
    function handleRedo() {
      store.redo();
    }
    function handleClose() {
      history.push('/');
      store.closeCurrentList();
    }
    /*
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    */
    return (
        <span id='edit-toolbar'>
            <input
                type='button'
                id='add-song-button'
                disabled={!store.hasCurrentList()}
                value='+'
                className={enabledButtonClass}
                onClick={handleAddSong}
            />
            <input
                type='button'
                id='undo-button'
                disabled={!store.canUndo()}
                value='⟲'
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type='button'
                id='redo-button'
                disabled={!store.canRedo()}
                value='⟳'
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type='button'
                id='close-button'
                disabled={!store.hasCurrentList()}
                value='&#x2715;'
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>
    );
}

export default EditToolbar;