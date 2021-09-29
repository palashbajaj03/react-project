import React from 'react';

const DeleteCollection = (props) => {
  const deleteCollection = () => {
    props.delete()
  }
  
  return (
    <div className="modal" id="deleteCollection">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
          </div>
          <div className="modal-body">
            <div className="modal-box">
              <div className="modal-icon">
                <img src="/static/images/delete-collection.png" />
              </div>
              <div className="modal-title">
                <h2>Delete {props.name}?</h2>
                <p>All the shared data will be deleted for the users it has been shared with.</p>
              </div>
              <div className="collectionButtons">
                <button type="button" className="colorBtn btn btn-secondary" onClick={deleteCollection} data-dismiss="modal">DELETE</button>
                <button type="button" className="btn emptyColorBtn" data-dismiss="modal">CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteCollection;