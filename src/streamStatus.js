import React, {Component} from 'react';
import {Typography} from '@material-ui/core';
import Axios from 'axios'


export default class StreamStatus extends Component {
    state ={
        streaming: null
    }
    componentDidMount(){
        this.interval = setInterval(() => {
            Axios.post("getStreamStatus", {username: this.props.username, password: this.props.password}).then((data) =>{
                console.log(data)
                if( data.data== "Not Authorized") {
                  console.log("failed to Login")
                  
                }
                else if (data.data.lastGotStatus) {
                  
                  this.setState({streaming:data.data.ffmpegCurrentlyStreaming})
                  
                }
              }).catch((err) => {
                console.log(err)
              })
        }, 5000);
    }

    render(){
        return(
            <Typography>{this.state.streaming ? "Live": "Not Streaming"}</Typography>
        )
    }
}