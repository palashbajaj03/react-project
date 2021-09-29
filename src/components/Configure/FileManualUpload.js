import React, { Component, useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios'
import cookie from 'react-cookies';

class FileManualUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
        }

    }
    onChangeHandler = e => {
     
        this.setState({
            selectedFile: e.target.files,
            loaded: 0,
        })
    }
    onClickHandler = () => {
        let { client_id, emailid } = this.props.user
        let token = cookie.load('user_token')
        let data = new FormData()
        for(var x = 0; x<this.state.selectedFile.length; x++) {
            data.append('file', this.state.selectedFile[x])
        }
        data.append('scoop_client_id',client_id )
        data.append('scoop_email_id', emailid)
        data.append('channel','manual_upload')
        data.append('token',token)
        axios.post('https://app.scoop.ai/api/v2/plugins/sync',data).then((res) => {

        }).catch(error => {
            if (error.response) {
                console.log(error)
            }
        })
    }


    render() {
        return (<div>

            <input type="file" accept=".mp3, .mp4, .wav" name="file" onChange={this.onChangeHandler} multiple />
            <button type="button" class="btn btn-success" onClick={this.onClickHandler}>Upload</button>
        </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user,
})

const mapActionToProps = {

}
export default connect(mapStateToProps, mapActionToProps)(FileManualUpload);
