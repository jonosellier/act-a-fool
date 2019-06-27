/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                deck = JSON.parse(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", "./decks/defaultDeck.json", true);
        xmlhttp.send();

        app.run();
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    run: function () {
        settingsObject = {
            condition: 'turns',
            threshhold: 1,
            current: 0
        }
        players = [];
        currPlayer = -1;
        render.menu(`./img/bannerLogo.png`, [{ name: 'New Game', id: 'startGame' }])
            .then(document.getElementById(`startGame`).addEventListener('click', showStartMenu, false));
    }
};

var deck, players = new Array(), currPlayer, currDeck;

let settingsObject = {
    guessTime: 30,
    condition: 'turns',
    threshhold: 1,
    current: 0
}

app.initialize();

function showStartMenu(){
    render.tallCard("Game Settings", render.content.gameSettings)
        .then(function (){
            document.getElementById(`startBtn`).addEventListener('click', getGameSettings, false);
            document.getElementById(`gameType`).addEventListener('change', validateSelection, false);
            document.getElementById(`guessTime`).addEventListener('change', validateSelection, false);
        });
}

function validateSelection(){
    if(document.getElementById("gameType").selectedIndex != 0 && document.getElementById("guessTime").selectedIndex != 0){
        console.log("valid")
        document.getElementById("startBtn").style.backgroundColor = '#000';
        return true;
    } else {
        console.log("invalid")
        document.getElementById("startBtn").style.backgroundColor = '#999';
        return false;
    }
}

function getGameSettings(){
    if(validateSelection()){
        let selectedType = document.getElementById("gameType").options[document.getElementById("gameType").selectedIndex].value;
        switch(selectedType){
            case "100p":
                settingsObject.condition = 'points';
                settingsObject.threshhold = 100;
                break;
            case "150p":
                settingsObject.condition = 'points';
                settingsObject.threshhold = 150;
                break;
            case "200p":
                settingsObject.condition = 'points';
                settingsObject.threshhold = 200;
                break;
            case "5t":
                settingsObject.condition = 'turns';
                settingsObject.threshhold = 5;
                break;
            case "10t":
                settingsObject.condition = 'turns';
                settingsObject.threshhold = 10;
                break;
            case "15t":
                settingsObject.condition = 'turns';
                settingsObject.threshhold = 15;
                break;
        }
        settingsObject.guessTime = document.getElementById("guessTime").options[document.getElementById("guessTime").selectedIndex].value;
        printPlayers();
    }
}

function generateCard() {
    var rand = Math.floor(Math.random() * deck.cards.length);
    var rand2 = Math.floor(Math.random() * (deck.cards[rand].items.length))
    render.card(deck.cards[rand].category, deck.cards[rand].items[rand2])
        .then(document.getElementById('card').addEventListener(`click`, startTimer));
}

function startTimer() {
    render.timer(5);
}

function addPlayer() {
    players.push({ name: document.getElementById("newPlayer").value, score: 0 });
    printPlayers();
}

function removePlayer() {
    const index = this.getAttribute("data-playerRef");
    console.log(index);
    console.log(players);
    players.splice(index, 1);
    console.log(players);
    printPlayers();
}

function printPlayers() {
    let playerHTML = ``;
    for (let i = 0; i < players.length; i++) playerHTML += `
        <div class="playerLabel">
            <button data-playerRef="${i}" id="removePlayer${i}" class="removePlayerBtn">${players[i].name}</button>
        </div>`; //Loads HTML

    const bottomHTML = `<input type="text" id="newPlayer"></input> <button class="inlineBtn" id="addPlayerBtn">Add</button><br><button id="startBtn">Start Game</button>`

    render.cardBotomButton(`Players`, playerHTML, bottomHTML).then(function () {
        document.getElementById(`addPlayerBtn`).addEventListener('click', addPlayer);
        if (players.length >= 3) document.getElementById(`startBtn`).addEventListener('click', showTurn); //enabled
        else document.getElementById(`startBtn`).style.backgroundColor = `#999`; //disabled
        for (let i = 0; i < players.length; i++) document.getElementById(`removePlayer${i}`).addEventListener('click', removePlayer, false); //remove player
    });
}

function showTurn() {
    currPlayer++;
    currPlayer = currPlayer % players.length;
    if (currPlayer == players.length - 1) settingsObject.current++;
    render.card("Next Player to Act", players[currPlayer].name)
        .then(document.getElementById("card").addEventListener(`click`, generateCard));
}

function chooseWinner() {
    let playerHTML = '';
    const bottomHTML = `<button id="startBtn">No One</button>`;
    for (let i = 0; i < players.length; i++) if (i != currPlayer) playerHTML += `<div class="playerLabel"><button data-playerRef="${i}" id="choosePlayer${i}" class="removePlayerBtn">${players[i].name}</button></div>`; //Loads HTML    
    render.cardBotomButton('Who Won?', playerHTML, bottomHTML)
        .then(function () {
            for (let i = 0; i < players.length; i++) if (i != currPlayer) document.getElementById(`choosePlayer${i}`).addEventListener('click', incrementScore, false);
            document.getElementById(`startBtn`).addEventListener('click', decrementCurrPlayerScore, false);
        });
}

function incrementScore() {
    const index = this.getAttribute("data-playerRef");
    players[index].score += 10;
    showScores();
}

function decrementCurrPlayerScore() {
    players[currPlayer].score -= 5;
    if (players[currPlayer].score <= 0) players[currPlayer].score = 0;
    console.log(players);
    showScores();
}

function showScores() {
    console.log(settingsObject);
    console.log(gameOver(settingsObject));
    if (gameOver(settingsObject)) showFinalScore();
    else {
        let playerHTML = ``;
        for (let i = 0; i < players.length; i++) playerHTML += `<h5>${players[i].name}: ${players[i].score}</h5>`;
        const bottomHTML = `<button id="startBtn">Next Turn</button>`;
        render.cardBotomButton(`Scores`, playerHTML, bottomHTML)
            .then(document.getElementById(`startBtn`).addEventListener('click', showTurn));
    }
}

function showFinalScore() {
    let playerHTML = `<h5>Final Scores:<br></h5>`;
    for (let i = 0; i < players.length; i++) playerHTML += `<h5>${players[i].name}: ${players[i].score}</h5>`;
    const bottomHTML = `<button id="startBtn">New Game</button>`;
    render.cardBotomButton(`Game Over!`, playerHTML, bottomHTML)
        .then(document.getElementById(`startBtn`).addEventListener('click', app.run));
}

function gameOver(settingsObj) {
    switch (settingsObj.condition) {
        case "turns":
            if (settingsObj.current >= settingsObj.threshhold) return true;
            break;
        case "points":
            for (const player of players) if (player.score >= settingsObj.current) settingsObj.current = player.score;
            if (settingsObj.current >= settingsObj.threshhold) return true;
            break;
        default:
            return false;
    }
    return false;
}