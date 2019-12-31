import React, { useState, useCallback } from 'react';


import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Menu, Button, Typography, MenuItem, Dialog, DialogTitle } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TextField from '@material-ui/core/TextField';
import RefreshIcon from '@material-ui/icons/Refresh';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Axios from 'axios';
import StreamStatus from './streamStatus';
import CopyToClipboard from 'react-copy-to-clipboard'
function App() {

  const [loginMenuOpen, setLoginMenuOpen] = useState(true)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [streamWebsiteURLList, setStreamWebsiteURLList] = useState([""])
  const [streamKeyList, setStreamKeyList] = useState([""])
  const [localStreamKey, setLocalStreamKey] = useState("")
  

  const [lastUpdate, setLastUpdate] = useState("")
  const [ currentlyStreaming, setCurrentlyStreaming] = useState("false")
  const [error, setError] = useState("")

  const [, updateState] = React.useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  return (

    <div >

      <AppBar position="static" ><Toolbar style={{ backgroundColor: "red", justifyContent: "space-between" }}>
        <Typography>Stream to Multiple Destinations</Typography>
        <div>
          <IconButton onClick={(event) => {
            Axios.post("getStreamStatus", {username: username, password: password}).then((data) =>{
              console.log(data)
              if( data.data== "Not Authorized") {
                console.log("failed to Login")
              }
              else if (data.data.lastGotStatus) {
                setLastUpdate(data.data.lastGotStatus)
                setLocalStreamKey(data.data.localStreamKey)
                setCurrentlyStreaming(data.data.ffmpegCurrentlyStreaming)
                console.log(data.data.remoteKeyList)
                console.log(data.data.remoteURLList)
                setStreamWebsiteURLList(data.data.remoteURLList)
                setStreamKeyList(data.data.remoteKeyList)
                
                setLoginMenuOpen(false)
                forceUpdate()
              }
            }).catch((err) => {
              console.log(err)
            })
          }}
           style={{ position: "relative", right: 5, top: 2, width: "2fr" }} >
            <RefreshIcon />
          </IconButton>
          
          
        </div>
      </Toolbar></AppBar>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))" }}>
        <div style={{ borderWidth: 3, borderColor: "gray", padding: 10, margin: 10, width: "1fr", borderStyle: "solid" }}>
          <Typography>Status: <StreamStatus username={username} password={password} /></Typography>
          <div style={{display:"flex", flexWrap:"wrap", width:"100%", alignItems:"center"}}>
          <Typography>RTMP Address: rtmp://{window.location.hostname}/live/</Typography><CopyToClipboard text={"rtmp://"+window.location.hostname+"/live/"}><IconButton><FileCopyIcon /></IconButton></CopyToClipboard>

          </div>
          <div style={{display:"flex", flexWrap:"wrap", width:"100%", alignItems:"center"}}>
          <Typography>RTMP Stream Key:{localStreamKey}</Typography><CopyToClipboard text={localStreamKey}><IconButton><FileCopyIcon  /></IconButton></CopyToClipboard>

          </div>
          <Typography>Last Update: {new Date(lastUpdate).toLocaleString()} </Typography>
          {
            currentlyStreaming ?
            <Button style={{backgroundColor:"blue"}}
            onClick={() => {
              Axios.post("killCurrentSession", {username:username, password:password}).then((data)=>{
                console.log(data.data)
                if(data.data == "Killed") {
                  Axios.post("getStreamStatus", {username: username, password: password}).then((data) =>{
                    console.log(data)
                    if( data.data== "Not Authorized") {
                      console.log("failed to Login")
                    }
                    else if (data.data.lastGotStatus) {
                      setLastUpdate(data.data.lastGotStatus)
                      setLocalStreamKey(data.data.localStreamKey)
                      setCurrentlyStreaming(data.data.ffmpegCurrentlyStreaming)
                      console.log(data.data.remoteKeyList)
                      console.log(data.data.remoteURLList)
                      setStreamWebsiteURLList(data.data.remoteURLList)
                      setStreamKeyList(data.data.remoteKeyList)
                      
                      setLoginMenuOpen(false)
                      forceUpdate()
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              }).catch((err) =>{
                console.log(err)
              })
            }}><Typography style={{color:"white", fontSize:25}}>Stop</Typography></Button>: 
            <Button style={{backgroundColor:"blue"}} onClick={() => {
              Axios.post("startStreamSession", {username:username, password:password, streamURLList:streamWebsiteURLList, streamKeyList: streamKeyList}).then((data) => {
                console.log(data)
                setCurrentlyStreaming(data.data.ffmpegCurrentlyStreaming)
                setLocalStreamKey(data.data.streamKey)
                setError(data.data.error)
                Axios.post("getStreamStatus", {username: username, password: password}).then((data) =>{
                  console.log(data)
                  if( data.data== "Not Authorized") {
                    console.log("failed to Login")
                  }
                  else if (data.data.lastGotStatus) {
                    setLastUpdate(data.data.lastGotStatus)
                    setLocalStreamKey(data.data.localStreamKey)
                    setCurrentlyStreaming(data.data.ffmpegCurrentlyStreaming)
                    console.log(data.data.remoteKeyList)
                    console.log(data.data.remoteURLList)
                    setStreamWebsiteURLList(data.data.remoteURLList)
                    setStreamKeyList(data.data.remoteKeyList)
                    
                    setLoginMenuOpen(false)
                    forceUpdate()
                  }
                }).catch((err) => {
                  console.log(err)
                })
              }).catch((err) => {

                console.log(err)
                Axios.post("getStreamStatus", {username: username, password: password}).then((data) =>{
                  console.log(data)
                  if( data.data== "Not Authorized") {
                    console.log("failed to Login")
                  }
                  else if (data.data.lastGotStatus) {
                    setLastUpdate(data.data.lastGotStatus)
                    setLocalStreamKey(data.data.localStreamKey)
                    setCurrentlyStreaming(data.data.ffmpegCurrentlyStreaming)
                    console.log(data.data.remoteKeyList)
                    console.log(data.data.remoteURLList)
                    setStreamWebsiteURLList(data.data.remoteURLList)
                    setStreamKeyList(data.data.remoteKeyList)
                    
                    setLoginMenuOpen(false)
                    forceUpdate()
                  }
                }).catch((err) => {
                  console.log(err)
                })
              })
            }}
            ><Typography style={{color:"white", fontSize:25}}>Start</Typography></Button>
          }
          {error ? <Typography style={{color:"red"}}>{error}</Typography> : null}
        </div>
        <div id={streamWebsiteURLList.toString()} style={{ borderWidth: 3, borderColor: "gray", padding: 10, margin: 10, width: "1fr", borderStyle: "solid" }}>
          {
            streamWebsiteURLList.map((item, index) => {
              console.log(item)
              console.log(streamKeyList[index])
              console.log(index)
             

                return (
                <div style={{ display: "flex", flexDirection: "row", }} key={item+Math.random()} >
                  <h4>{index + 1}. </h4>
                  
                  <TextField defaultValue={streamWebsiteURLList[index]} style={{ border: "1px solid gray", padding: 4, margin: 5, width: "35%" }}
                    onChange={(event) => {
                      var newStreamURLList = streamWebsiteURLList
                      newStreamURLList[index] = event.target.value
                      setStreamWebsiteURLList(newStreamURLList)
                      console.log(streamWebsiteURLList)
                      
                    }} label="Stream URL"></TextField>
                  
                  <TextField defaultValue={streamKeyList[index]}
                  style={{ border: "1px solid gray", padding: 4, margin: 5, width: "35%" }}
                    onChange={(event) => {
                      var newStreamKeyList = streamKeyList
                      newStreamKeyList[index] = event.target.value
                      console.log(streamWebsiteURLList, streamKeyList)
                      setStreamKeyList(newStreamKeyList)
                      
                      
                    }}
                    label="Stream Key"></TextField>
                  <IconButton onClick={(event) => {
                    var newStreamKeyList = streamKeyList
                    newStreamKeyList.splice(index,1)
                    var newStreamURLList = streamWebsiteURLList
                    newStreamURLList.splice(index,1)
                    setStreamWebsiteURLList(newStreamURLList)
                    setStreamKeyList(newStreamKeyList)
                    console.log(streamWebsiteURLList, streamKeyList)
                    forceUpdate()
                  }}
                    disabled={index == 0}>
                    {index == 0 ? null : <RemoveCircleIcon />}
                  </IconButton>


                </div>)
              
             
              
            })
          }

          <div>
            <Button style={{ width: "45%", backgroundColor: "blue" }}
              onClick={() => {
                var newStreamKeyList = streamKeyList
                newStreamKeyList.push("")
                var newStreamURLList = streamWebsiteURLList
                newStreamURLList.push("")
                setStreamWebsiteURLList(newStreamURLList)
                setStreamKeyList(newStreamKeyList)
                console.log(streamWebsiteURLList, streamKeyList)
                forceUpdate()
              }}
            >
              <Typography style={{ color: "white", fontSize: 32 }}>+</Typography>
            </Button>
            
          </div>
        </div>

      </div>
      <Dialog  open={loginMenuOpen}>
        
        <div>
              <Typography>Enter Username and Password to make changes.</Typography>
            </div>

            <TextField
              onChange={(event) => {
                setUsername(event.target.value)
              }}
              id="username"
              style={{ margin: 5 }}
              label="Username"
              margin="normal"
              variant="outlined"
            />
            <TextField
              onChange={(event) => {
                setPassword(event.target.value)
              }}
              id="password"
              style={{ margin: 5 }}
              label="Password"
              margin="normal"
              variant="outlined"
            />

            <div>
              <Button style={{ width: "95%", margin: 5 }}
                onClick={() => {
                  Axios.post("getStreamStatus", {username: username, password: password}).then((data) =>{
                    console.log(data)
                    if( data.data== "Not Authorized") {
                      console.log("failed to Login")
                    }
                    else if (data.data.lastGotStatus) {
                      setLastUpdate(data.data.lastGotStatus)
                      setLocalStreamKey(data.data.localStreamKey)
                      setCurrentlyStreaming(data.data.ffmpegCurrentlyStreaming)
                      console.log(data.data.remoteKeyList)
                      console.log(data.data.remoteURLList)
                      setStreamWebsiteURLList(data.data.remoteURLList)
                      setStreamKeyList(data.data.remoteKeyList)
                      
                      setLoginMenuOpen(false)
                      forceUpdate()
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                  
                }}>
                <Typography>Save</Typography>
              </Button>
            </div>
      </Dialog>
    </div>
  );
}

export default App;
