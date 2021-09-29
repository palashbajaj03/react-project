import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { conversationAction, collectionAction } from '../../actions';


const BookMarkConversation = (props) => {

  let [collectionName, setCollectioName] = useState([]);
  let [collectionId, setCollectioId] = useState([]);
  let [collectionHandle, setcollectionHandle] = useState(false);
  let [handleNewText, sethandleNewText] = useState("");
  useEffect(() => {
    return () => {
      window.jQuery('#bookMarkConversation').on('show.bs.modal', resetValues)
    }
  
  })

  const selectCollection = (e) => {
    const id = e.target.id;
    const name = e.target.value;
    setCollectioName(collectionName.concat(name));
    setCollectioId(collectionId.concat(id))


    if (!e.target.checked) {
      let string = e.target.id
      let searchinput = collectionId
      var index = searchinput && searchinput.indexOf(string);
      if (index !== '' && index > -1) {
        searchinput.splice(index, 1)
        setCollectioId([...searchinput])
      }
      let strin = e.target.value
      let searchinpu = collectionName
      var inde = searchinpu && searchinpu.indexOf(strin);

      if (inde !== '' && inde > -1) {
        searchinpu.splice(inde, 1)
        setCollectioName([...searchinpu]);
      }
    }
  }

 
  const bookMarkConversation = () => {
    const { client_id, emailid, firstname, lastname, rep_id } = props.user
    const { convId: conversation_id, source } = props
    if (handleNewText) {
      let { client_id, emailid } = props.user;
      props.create({
        collection: {
          name: handleNewText,
          description: "",
          type: "manual",
          end_date: '',
          created_by: {
            first_name: firstname,
            last_name: lastname,
            emailid,
            rep_id
          },
          // keep_updating: this.state.keep_updating,
          filter: {}
        }
      }, client_id, emailid, true, conversation_id)
      sethandleNewText('')
    } else {
      if (collectionName && collectionId) {
        props.bookmark({ client_id, emailid, conversation_id, id: collectionId, source })
        setCollectioId([])
        setCollectioName([]);
      }
    }
  }

  const resetValues = () => {
    setCollectioId([])
    setCollectioName([]);
    setcollectionHandle(false);
    sethandleNewText("");
  }

  const handleCreateNew = () => {
    setcollectionHandle(!collectionHandle)
    sethandleNewText('')
  }

  const handleTextChange = (e) => {
    let value = e.target.value
    sethandleNewText(value)
  }

  return (
    <div className="modal" id="bookMarkConversation">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" onClick={resetValues}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="modal-box">
              <div className="modal-icon">
                <img src="/static/images/create-collection.png" />
              </div>
              <div className="modal-title">
                <h2>Save To Collection</h2>
                <p>All the shared data will be deleted for the users it has been shared with.</p>
              </div>

              <div className="modal-body">
                <div className="dropdown mb-2">
                  <button className="btn custom-dropdown dropdown-toggle" id="selectCollection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {collectionName.length > 0 ? collectionName.toString() : 'Select Collection'}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="selectCollection">
                    <ul>
                      {props.collectionList && props.collectionList.map((collection, index) => (
                        collection.name === props.collectionName ?
                          "" : <li key={index}>
                            <div className="form-group dropDownText checkboxContainer">
                              <input name="isGoing" type="checkbox" id={collection.id} value={collection.name} onChange={selectCollection} checked={collectionId.includes(collection.id)} />
                              <span className="checkBoxText">{collection.name}</span>
                              <span className="virtualBox"></span>
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="input-create-collection text-right">
                  <button className="crt-collection-btn" onClick={handleCreateNew}> <i className={collectionHandle ? "" : "icon-plus"}></i> {collectionHandle ? "Cancel" : "Create New"}</button>
                  {collectionHandle && <div className="newCollection mt-2">
                    <input type="text" placeholder="Add Name" className="form-control" name="newCollection" onChange={handleTextChange} />
                    {/* <button className="colorBtn btn btn-secondary" onClick={createCollection}>Create collection</button> */}
                  </div>}
                </div>

              </div>

              <div className="collectionButtons">
                <button type="button" className="colorBtn btn btn-secondary" onClick={bookMarkConversation} data-dismiss="modal">{collectionHandle ? 'CREATE & SAVE' : 'SAVE'}</button>
                <button type="button" className="btn emptyColorBtn" data-dismiss="modal" onClick={resetValues}>CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    // collectionList: state.conversationReducer.manualCollection
  }
}

const mapActionToProps = {
  //readCollection: conversationAction.manualCollectionList,
  bookmark: conversationAction.bookMarkConversation,
  create: collectionAction.createCollection,
}

export default connect(mapStateToProps, mapActionToProps)(BookMarkConversation);