const render = {
    card: async(title, content) => {
        document.getElementById("appContent").innerHTML = `
        <div id="card">
            <h2>${title}</h2>
            <div id="drawContainer">
                <h3>${content}</h3>
            </div>
        </div>`;
    },

    cardBotomButton: async(title, content, bottomButtonContent) => {
        document.getElementById("appContent").innerHTML = `
        <div id="card">
            <h2>${title}</h2>
            <div id="drawContainer">
                <div id="playerContainer">${content}</div>
                <div class="bottom">${bottomButtonContent}</div>
            </div>
        </div>`;
    },

    menu: async(title, content) => {
        let menuItems = ``;
        content.forEach(element => {
            menuItems += `<div class="playerLabel"><button id="${
                element.id
                }" class="removePlayerBtn">${element.name}</button></div>`;
            document.getElementById("appContent").innerHTML = `
                <div id="card">
                    <h2><img src="${title}" class="banner-img"></h2>
                    <div id="drawContainer">
                        ${menuItems}
                    </div>
                </div>
            `;
        });
    },

    timer: (tMax) => {
        document.getElementById('staticContent').style.display = 'none';
        document.getElementById("appContent").innerHTML = `<canvas id="cv" width=2500 height=2500>Unsupported</canvas>`;
        let c = document.getElementById("cv");
        const tick = document.getElementById("ticker");
        const buzzer = document.getElementById("buzzer");
        let canv = c.getContext("2d");
        canv.fillStyle = "#FFF";
        let endTime = new Date().getTime() + tMax * 1000;
        document.getElementById("ticker").play();
        document.getElementById('cv').addEventListener('click', function() {
            endTime = 0;
        }, false);

        let timingFn = setInterval(function() {
            const curTime = new Date().getTime();
            canv.clearRect(0, 0, 2500, 2500);
            canv.beginPath();
            canv.moveTo(1250, 1250);
            canv.arc(1250, 1250, 1200, 0, Math.PI * 2 * (0 - (endTime - curTime) / (tMax * 1000)), true);
            canv.lineTo(1250, 1250);
            canv.fill();
            if (curTime > endTime) {
                tick.pause();
                clearInterval(timingFn);
                buzzer.play();
                document.getElementById('staticContent').style.display = 'block';
                chooseWinner();
            }
        }, 1000 / 60);
    },

    tallCard: async(title, content) => {
        document.getElementById("appContent").innerHTML = `
        <div id="card">
            <h2>${title}</h2>
            <div id="drawContainerTall">
                <h3>${content}</h3>
            </div>
        </div>`;
    },

    content: {
        gameSettings: `
        <div id="playerContainer">
        <div class="select-container">
            <select class="gameSettings" id="gameType">
                <option value="default" selected hidden disabled>GAME TYPE</option>
                <option value="50p">First to 50 points</option>
                <option value="80p">First to 80 points</option>
                <option value="100p">First to 100 points</option>
                <option value="5t">5 turns each</option>
                <option value="10t">10 turns each</option>
                <option value="15t">15 turns each</option>
            </select>
        </div><div class="select-container">
            <select class="gameSettings"id="guessTime">
                <option value="default" selected hidden disabled>TIME PER TURN</option>
                <option value=30>30 seconds per turn</option>
                <option value=60>60 seconds per turn</option>
                <option value=90>90 seconds per turn</option>                                                          
            </select>
            </div>
        </div>
        <div class="bottom">
            <button id="startBtn" style="background-color: #999">Add Players</button>
        </div>
    `,
        howToPlay: `
    <h2>How to play</h2>
    <div id="cardList">
        <h2>1. New Turns</h2>
        <div id="drawContainerTall">
            <h3>Pass the phone to the player whose name comes up on the screen.</h3>
        </div>
    </div>
    <div id="cardList">
        <h2>2. The prompt</h2>
        <div id="drawContainerTall">
            <h3>Tell everyone the category at the top of the card. During the timer you will act out the word or phrase that appears here but don't tell anyone what it is.</h3>
        </div>
    </div>
    <div id="cardList">
        <h2>3. The timer</h2>
        <div id="drawContainerTall">
            <h3>Act out the thing on your card until someone guesses it or time runs out.</h3>
        </div>
    </div>
    <div id="cardList">
        <h2>4. Scoring</h2>
        <div id="drawContainerTall">
            <h3>Correct guess: +10 points to the person who guessed</h3>
            <h3>Time ran out before a correct guess is made: -5 points to the actor</h3>
        </div>
    </div>
    `,
        settings: `
        <h2>Attributions</h2>
        <h4><ul>
        <li>Built with Apache Cordova</li>
        <li>Hosted on Heroku</li>
        <li>Logo By Penelope Sellier</li>
        </ul></h4>
        <h2>Settings</h2>
        <p>Reset the App and return the deck to its default state</p>
        <div id="reset" class="cardViewContainer"><p>Reset App</p></div>
      `
    },

    cardView: {
        categories: async(deck) => {
            let categoryHTML = ``;
            deck.cards.forEach((card, i) => {
                categoryHTML += `<div id="view${i}" class="cardViewContainer" data-cardRef="${i}"><p>${card.category}</p></div>`;
            })
            categoryHTML += `<div id="newCat" class="cardViewContainer"><p>Add New Category</p></div>`;
            document.getElementById("appContent").innerHTML = `<h2>Browse Categories</h2>` + categoryHTML;
        },
        cards: async(cat, index) => {
            console.log(cat);
            let categoryHTML = ``;
            cat.items.forEach((item, i) => {
                categoryHTML += `<div id="view${i}" class="cardViewContainer cv-tall"><div class="rhs"><button id="edit${i}" data-catRef="${index}" data-cardRef="${i}">&vellip;</button></div><p>${item}<p></div>`;
            })
            categoryHTML += `<div id="newCat" class="cardViewContainer" data-catRef="${index}"><p>Add New Card</p></div>`;
            categoryHTML += `<div id="delCat" class="cardViewContainer" data-catRef="${index}"><p>Delete this Category</p></div>`;
            document.getElementById("appContent").innerHTML = `<h2>${cat.category}</h2>` + categoryHTML;
        },
        delCard: async(catIndex, cardIndex) => {
            document.getElementById("appContent").innerHTML = `<h2>Do you want to delete this card?</h2><h4>${deck.cards[catIndex].items[cardIndex]}</h4><div id="delCard" class="cardViewContainer" data-catRef="${catIndex}" data-cardRef="${cardIndex}"><p>Delete Card</p></div>`;
        },
        delCat: async(catIndex) => {
            document.getElementById("appContent").innerHTML = `<br><h4>Do you want to delete this category and all cards inside it?</h4><h2>${deck.cards[catIndex].category}</h2><div id="delCard" class="cardViewContainer" data-catRef="${catIndex}"><p>Delete Category</p></div>`;
        }
    },

    static: {
        default: () => {
            document.getElementById(`pauseBtn`).style.display = 'block';
            document.getElementById(`backBtn`).style.display = 'none';
        },
        backarrow: () => {
            document.getElementById(`pauseBtn`).style.display = 'none';
            document.getElementById(`backBtn`).style.display = 'block';
        },
        none: () => {
            document.getElementById(`backBtn`).style.display = 'none';
            document.getElementById(`pauseBtn`).style.display = 'none';
        }
    }
};