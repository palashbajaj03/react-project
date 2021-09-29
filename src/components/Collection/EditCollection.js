import React, { useState,useEffect } from 'react';

const EditCollection = (props) => {
  let [collectionName, setcollectionName] = useState('');

  const keyPressed = (e) => {
    const { which } = e;
    if (which === 13) {
      document.getElementById("save").click();
    }
  }

  const changeValue = (e) => {
    let name = e.target.value;
    if ((name !== ' ') && (name.length<=255)) {
      setcollectionName(name)
    }
  }

  const update = () => {
    if ((collectionName) && (collectionName !== ' ')) {
      props.rename(collectionName)
      setcollectionName('')
    }
  }

  const resetValues = () => {
    setcollectionName('');
  }


  useEffect(()=>{
    return () => {
      window.jQuery('#editCollection').on('show.bs.modal', resetValues)
    }
  })



  return (
    <div className="modal" id="editCollection">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
          </div>
          <div className="modal-body">
            <div className="modal-box">
              <div className="modal-icon">
                <img src="/static/images/rename-collection.png" />
              </div>
              <div className="modal-title">
                <h2>Rename "{props.name}"</h2>
                <p>Renaming this conversation will be reflected for all the users it has been shared with.</p>
              </div>
              <div className="collectionName manual">
                <div className="form-group">
                  <input type="text" name="collectionName" className="form-control" value={collectionName} onKeyUp={keyPressed} onChange={changeValue} placeholder="Add New name" maxLength={255} required />
                </div>
              </div>
              <div className="collectionButtons">
                <button type="button" id="save" className="colorBtn btn btn-secondary" data-dismiss="modal" onClick={update}>SAVE</button>
                <button type="button" className="btn emptyColorBtn" data-dismiss="modal">CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCollection;