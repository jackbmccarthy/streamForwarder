const express = require("express");
const bodyParser = require('body-parser');
const system = require("child_process");
const https = require("https");
const path = require("path");
const fs = require('fs')

let currentStatus = {
    ffmpegCurrentlyStreaming: false,
    localStreamKey: "",
    pid: 0,
    remoteURLList: [""],
    remoteKeyList: [""]

}
let currentSession

const app = express()
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"build/index.html"))
})

app.post("/getStreamStatus", (req, res) => {
    var username = process.env.RESTREAM_USERNAME || "admin"
    var password = process.env.RESTREAM_PASSWORD || "admin"
    console.log(username, password)
    if (req.body.password == password && req.body.username == username) {
        system.exec("pidof ffmpeg", (err, stdout, stderr) =>{
            console.log("err", err)
            if(err) {
                currentStatus.pid = 0
                currentStatus.ffmpegCurrentlyStreaming = false
            }
            console.log("stdout", stdout)
            if(stdout) {
                currentStatus.pid = stdout 
                currentStatus.ffmpegCurrentlyStreaming = true
            }
           
            console.log("stderr", stderr)
        })
        currentStatus.lastGotStatus = new Date()
        res.send(currentStatus)
    }
    else {
        res.send("Not Authorized")
    }

})

app.post("refreshStreamKey", (req, res) => {
    var username = process.env.RESTREAM_USERNAME || "admin"
    var password = process.env.RESTREAM_PASSWORD || "admin"
    if (req.body.password == password && req.body.username == username) {
    var alphabet = "qwertyuiopasdfghjklzxcvbnm1234567890"
        for (let i = 0; i < alphabet.length; i++) {
            currentStatus.localStreamKey += alphabet[Math.round(Math.random() * 36)]
        }
    res.send({localStreamKey: currentStatus.localStreamKey})
    }
    else{
        res.send("Not Authorized")
    }
})

app.post("/startStreamSession", (req, res) => {
    var username = process.env.RESTREAM_USERNAME || "admin"
    var password = process.env.RESTREAM_PASSWORD || "admin"
    console.log(username, password)
    
    if (req.body.password == password && req.body.username == username) {
        if (currentStatus.localStreamKey.length < 1 )
    {
        var alphabet = "qwertyuiopasdfghjklzxcvbnm1234567890"
        for (let i = 0; i < alphabet.length; i++) {
            currentStatus.localStreamKey += alphabet[Math.round(Math.random() * 36)]

        }
        var streamKey = currentStatus.localStreamKey
    }
    else {
        var streamKey = currentStatus.localStreamKey
    }

        var rtmpServers = ""
        for (let index = 0; index < req.body.streamURLList.length; index++) {
            if(req.body.streamURLList[index].length >= 5 && req.body.streamKeyList[index].length >= 1) {
                console.log(req.body.streamURLList[index][req.body.streamURLList[index].length-1])
            rtmpServers += ' -c copy -f flv "' + req.body.streamURLList[index]+(req.body.streamURLList[index][req.body.streamURLList[index].length-1] == "/" ? "": "/")+ req.body.streamKeyList[index] +'"'
            }
            else{
                null
            }
        }
        var streamCommand = 'ffmpeg -f flv -listen 1 -i rtmp://0.0.0.0:1935/live/' + streamKey + rtmpServers
        console.log(streamCommand)
        currentStatus.remoteURLList= req.body.streamURLList
        currentStatus.remoteKeyList = req.body.streamKeyList
        //var splitCommands = streamCommand.split(" ")
        //console.log(splitCommands)
        //splitCommands.shift()
        //splitCommands.filter((val) =>{return val.length>0})
        //console.log(splitCommands)
        currentStatus.ffmpegCurrentlyStreaming= true
        system.exec(streamCommand, (err,stdout,stderr) =>{
            console.log("Starting Stream")

            console.log("Error Line 114",err)
            console.log("stdout Line 115"+ stdout)
            console.log("stderr line 116"+stderr)
        })
        /*
        currentSession = system.spawn("ffmpeg", splitCommands)
        //currentSession = system.spawn("ping", ["192.168.1.1"])
        console.log(currentSession)
        console.log("These are split commands: ",splitCommands)
        currentStatus.pid = currentSession.pid
        currentSession.pid ? currentStatus.ffmpegCurrentlyStreaming = true : null
        console.log("pid: " + currentSession.pid)
        console.log(req.body.streamURLList)
        console.log(req.body.streamKeyList)
        currentSession.stdout.on("data", (data) => {
            console.log("Stdout: " + data)
        })
        currentSession.stdout.on("error", (err) =>{
            console.log("stdout error",err)
        })
        currentSession.stdout.on("readable", (err) =>{
            console.log("stdout readable",err)
        })
        currentSession.stdout.on("end", (err) =>{
            console.log("stdout end",err)
        })
        currentSession.stderr.on("error", (err) => {
            console.log("stderr error" ,err)
        })
        currentSession.stderr.on("data", (err) => {
            console.log("stderr data"+ err)
        })
        currentSession.stderr.on("close", (err) => {
            console.log("stderr close"+ err)
        })
        currentSession.stderr.on("readable", (err) => {
            console.log("stderr readable"+ err)
        })
        currentSession.stderr.on("end", (err) => {
            console.log("stderr end"+ err)
        })
        currentSession.on("close", (code, signal) => {
            console.log("Exiting on Close with Code: " + code)
            console.log(signal)
            currentStatus.ffmpegCurrentlyStreaming = false
        })
        currentSession.on("exit", (code, signal) =>{
            console.log(code, signal, "Exit")
        })
        currentSession.on("message", (code, signal) =>{
            console.log(code, signal, "Exit")
        })
        currentSession.on("error", (err) => {
            console.log("Exiting Error with Code: " + err)
            currentStatus.ffmpegCurrentlyStreaming = false
        })
        */
        res.send({streamKey: currentStatus.ffmpegCurrentlyStreaming ? streamKey: "",ffmpegCurrentlyStreaming:currentStatus.ffmpegCurrentlyStreaming,  })
    } //error: currentSession.pid? null : "Process could not be started, please check your settings"
    else {
        res.send("Not Authorized")
    }

})

app.post("/killCurrentSession", (req, res) => {
    var username = process.env.RESTREAM_USERNAME || "admin"
    var password = process.env.RESTREAM_PASSWORD || "admin"
    console.log(username, password)
    if (req.body.password == password && req.body.username == username) {
        const killingPid = system.spawn("pkill", ["ffmpeg"])
        killingPid.on("exit", (code, signal) =>{
            console.log("On Exit Event: "+code+"Sig"+signal)
        })
        killingPid.on("close", (code, signal) => {
            console.log("Exited with Code: " + code)
            if (code == 1) {
                res.send("Failed to kill process")
            }
            if (code == 0) {
               res.send("Killed") 
               currentStatus.pid=0
               currentStatus.ffmpegCurrentlyStreaming= false
            }
            
        })
    }
    else {
        res.send("Not Authorized")
    }


})




app.listen(process.env.PORT || 80, function () {
    console.log('Example app listening on port '+(process.env.PORT ? process.env.PORT.toString(): "80"+'! Go to https://localhost:3000/'))
  })
