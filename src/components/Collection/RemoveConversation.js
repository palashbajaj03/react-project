import React from 'react';

const RemoveConversation = (props) => {
  const removeConversation = () => {
    props.remove();
  }
  return (
    <div className="modal" id="removeConversation">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
          </div>
          <div className="modal-body">
            <div className="modal-box">
              <div className="modal-icon">
                <img src="/static/images/remove-collection.png" />
              </div>
              <div className="modal-title">
                <h2> Do you want to remove this conversation from {props.name} collection? </h2>
                <p>This conversation will be removed only from this collection but will be available elsewhere.</p>
              </div>
              <div className="collectionButtons">
                <button type="button" className="colorBtn btn btn-secondary" onClick={removeConversation} data-dismiss="modal">REMOVE</button>
                <button type="button" className="btn emptyColorBtn" data-dismiss="modal">CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemoveConversation;