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
var appState = {
    players: undefined,
    screen: undefined,
    settings: undefined
}

const APP_STORAGE_KEY = 'jH0svSqpTO';

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('pause', this.onPause.bind(this), false);
        document.addEventListener('resume', this.onResume.bind(this), false);
        document.addEventListener("backbutton", app.backButton, false);

    },

    backButton: function() {
        switch (appState.screen.id) {
            case "catBrowser":
                startBrowser();
                break;
            case "cardBrowser": //go back to previous screen
                console.log(appState.screen.id)
                app.run();
                break;
            case "howTo":
                app.run();
                break;
            case "playerAdd":
                showStartMenu();
                break;
            case "timer": //do nothing
                break;
            default:
                togglePause();
        }
    },

    onPause: function() {
        appState.players = players;
        appState.settings = settingsObject;
        window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
    },

    onResume: function() {
        const storedState = window.localStorage.getItem(APP_STORAGE_KEY);

        if (storedState) {
            appState = JSON.parse(storedState);
        }

        players = appState.players;
        settingsObject = appState.settings;

        switch (appState.screen.id) {
            case "cardBrowser":
                app.run();
                break;
            case "mainMenu":
                app.run();
                break;
            case "playerAdd":
                app.run();
                break;
            case "card":
                generateCard();
                break;
            case "player":
                showTurn();
                break;
            case "timer":
                break;
        }
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                deck = JSON.parse(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", "./decks/defaultDeck.json", true);
        xmlhttp.send();
        document.getElementById(`pauseBtn`).addEventListener('click', togglePause, false);
        document.getElementById(`backBtn`).addEventListener('click', app.backButton, false);
        document.getElementById(`res`).addEventListener('click', togglePause, false)
        document.getElementById(`end`).addEventListener('click', app.run, false)
        app.run();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    run: function() {
        settingsObject = {
            condition: 'turns',
            threshhold: 1,
            current: 0
        }
        document.getElementById('pauseScreen').style.display = 'none'; //removes pause screen
        players = [];
        currPlayer = -1;
        render.menu(`./img/bannerLogo.png`, [{ name: 'New Game', id: 'startGame' }, { name: 'Deck Browser', id: 'viewBrowser' }, { name: 'How to Play', id: 'howTo' }])
            .then(() => {
                document.getElementById(`startGame`).addEventListener('click', showStartMenu, false);
                document.getElementById(`viewBrowser`).addEventListener('click', startBrowser, false);
                document.getElementById('howTo').addEventListener('click', showHowTo, false);
                render.static.none();
            });
        render.static.default();
    }
};

var deck, players = new Array(),
    currPlayer, currDeck;

let settingsObject = {
    guessTime: 30,
    condition: 'turns',
    threshhold: 1,
    current: 0
}

app.initialize();

function showHowTo() {
    appState.screen = { id: 'howTo', args: [] };
    render.static.backarrow();
    document.getElementById("appContent").innerHTML = render.content.howToPlay;
}

function startBrowser() {
    appState.screen = { id: 'cardBrowser', args: [] };
    render.static.backarrow();
    render.cardView.categories(deck)
        .then(deck.cards.forEach((card, i) => {
            document.getElementById(`view${i}`).addEventListener('click', viewCat, false);
        }));
}

function viewCat() {
    const index = this.getAttribute("data-cardRef");
    appState.screen = { id: 'catBrowser', args: [index] };
    console.log(deck.cards[index]);
    render.cardView.cards(deck.cards[index]);
}

function showStartMenu() {
    appState.screen = { id: "mainMenu", args: [] };
    render.static.default();
    render.card("Game Settings", render.content.gameSettings)
        .then(function() {
            document.getElementById(`startBtn`).addEventListener('click', getGameSettings, false);
            document.getElementById(`gameType`).addEventListener('change', validateSelection, false);
            document.getElementById(`guessTime`).addEventListener('change', validateSelection, false);
        });
}

function validateSelection() {
    if (document.getElementById("gameType").selectedIndex != 0 && document.getElementById("guessTime").selectedIndex != 0) {
        console.log("valid")
        document.getElementById("startBtn").style.backgroundColor = '#000';
        return true;
    } else {
        console.log("invalid")
        document.getElementById("startBtn").style.backgroundColor = '#999';
        return false;
    }
}

function getGameSettings() {
    if (validateSelection()) {
        let selectedType = document.getElementById("gameType").options[document.getElementById("gameType").selectedIndex].value;
        switch (selectedType) {
            case "50p":
                settingsObject.condition = 'points';
                settingsObject.threshhold = 50;
                break;
            case "80p":
                settingsObject.condition = 'points';
                settingsObject.threshhold = 80;
                break;
            case "100p":
                settingsObject.condition = 'points';
                settingsObject.threshhold = 100;
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
    const rand = Math.floor(Math.random() * deck.cards.length);
    const rand2 = Math.floor(Math.random() * (deck.cards[rand].items.length))
    appState.screen = { id: "card", args: [rand, rand2] };
    render.card(deck.cards[rand].category, deck.cards[rand].items[rand2])
        .then(document.getElementById('card').addEventListener(`click`, startTimer));
}

function startTimer() {
    appState.screen = { id: "timer", args: [] }
    render.timer(settingsObject.guessTime);
    document.getElementById('cv').addEventListener('click', chooseWinner, false);
}

function resumeTimer() {
    render.timerFrom(settingsObject.guessTime, (new Date().getTime() - appState.screen.args[0]));
}

function printPlayers() {
    appState.screen = { id: "playerAdd", args: [] };
    let playerHTML = ``;
    for (let i = 0; i < players.length; i++) playerHTML += `<button data-playerRef="${i}" id="removePlayer${i}" class="removePlayerBtn">${players[i].name}</button>`; //Loads HTML

    const bottomHTML = `<input type="text" id="newPlayer"></input> <button class="inlineBtn" id="addPlayerBtn">Add</button><br><button id="startBtn">Start Game</button>`

    render.static.backarrow();
    render.cardBotomButton(`Players`, playerHTML, bottomHTML).then(function() {
        document.getElementById(`addPlayerBtn`).addEventListener('click', addPlayer);
        if (players.length >= 3) document.getElementById(`startBtn`).addEventListener('click', showTurn); //enabled
        else {
            document.getElementById(`startBtn`).style.backgroundColor = `#999`; //disabled
            document.getElementById(`startBtn`).innerHTML = `${3-players.length} more players`;
            if (players.length == 2) document.getElementById(`startBtn`).innerHTML = `${3-players.length} more player`;
        }
        for (let i = 0; i < players.length; i++) document.getElementById(`removePlayer${i}`).addEventListener('click', removePlayer, false); //remove player
    });
}

function showTurn() {
    appState.screen = { id: "player", args: [currPlayer] };
    currPlayer++;
    currPlayer = currPlayer % players.length;
    if (currPlayer == players.length - 1) settingsObject.current++;
    render.static.default();
    render.card("Next Player to Act", players[currPlayer].name)
        .then(document.getElementById("card").addEventListener(`click`, generateCard));
}

function chooseWinner() {
    appState.screen = { id: "winner", args: [currPlayer] };
    let playerHTML = '';
    const bottomHTML = `<button id="startBtn">No One</button>`;
    for (let i = 0; i < players.length; i++)
        if (i != currPlayer) playerHTML += `<div class="playerLabel"><button data-playerRef="${i}" id="choosePlayer${i}" class="removePlayerBtn">${players[i].name}</button></div>`; //Loads HTML    
    render.cardBotomButton('Who Won?', playerHTML, bottomHTML)
        .then(function() {
            for (let i = 0; i < players.length; i++)
                if (i != currPlayer) document.getElementById(`choosePlayer${i}`).addEventListener('click', incrementScore, false);
            document.getElementById(`startBtn`).addEventListener('click', decrementCurrPlayerScore, false);
        });
}

function showScores() {
    appState.screen = { id: "player", args: [currPlayer] };
    console.log(settingsObject);
    console.log(gameOver(settingsObject));
    if (gameOver(settingsObject)) showFinalScore();
    else {
        const bottomHTML = `<button id="startBtn">Next Turn</button>`;
        render.cardBotomButton(`Scores`, printScoreboard(), bottomHTML)
            .then(document.getElementById(`startBtn`).addEventListener('click', showTurn));
    }
}

function printScoreboard() {
    const sortedPlayers = [...players].sort((a, b) => (a.score - b.score));
    let output = ``;
    for (let i = 0; i < sortedPlayers.length; i++) output += `<h5>${sortedPlayers[i].name}: ${sortedPlayers[i].score}</h5>`;
    return output;
}

function showFinalScore() {
    appState.screen = { id: "mainMenu", args: [] };
    const bottomHTML = `<button id="startBtn">New Game</button>`;
    render.cardBotomButton(`Game Over!`, `<h5>Final Scores:<br></h5>${printScoreboard()}`, bottomHTML)
        .then(document.getElementById(`startBtn`).addEventListener('click', app.run));
}