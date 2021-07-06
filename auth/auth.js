var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FormData = require('form-data');

const axios = require("axios")
const process = require("process")
app.use(bodyParser.text());


app.get('/', function (req, res) {
   res.sendFile("../thanks.html");
})
app.post('/', function (req, res) {
    const data = new FormData();
    console.log(req.body)
    data.append('client_id', process.env.CLIENT_ID);
    data.append('client_secret', process.env.CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', "https://moderatorbotdc.tk/thanks");
    data.append('scope', 'identify');
    data.append('code', req.body);

    fetch('https://discordapp.com/api/oauth2/token', {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            const config = {
                headers:{
                    "authorization":`Bearer ${data.access_token}`
                }
            }
            axios
                .get("https://discordapp.com/api/users/@me",config)
                .then(response=>{
                    console.log(response.data.username)
                    res.send(response.data.username)
                })
                .catch(error=>{
                    console.log(error)
                })
        })
})
app.listen(8081)
