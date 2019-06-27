const render = {
    card: async (title, content) => {
        document.getElementById("appContent").innerHTML = `
        <div id="card">
            <h2>${title}</h2>
            <div id="drawContainer">
                <h3>${content}</h3>
            </div>
        </div>`;
    },

    cardBotomButton: async (title, content, bottomButtonContent) => {
        document.getElementById("appContent").innerHTML = `
        <div id="card">
            <h2>${title}</h2>
            <div id="drawContainer">
                <div id="playerContainer">${content}</div>
                <div class="bottom">${bottomButtonContent}</div>;
            </div>
        </div>`;
    },

    menu: async (title, content) => {
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
        document.getElementById(
            "appContent"
        ).innerHTML = `<canvas id="cv" width=2500 height=2500>Unsupported</canvas>`;
        let c = document.getElementById("cv");
        let canv = c.getContext("2d");
        canv.fillStyle = "#FFF";
        let t = 0;
        const endTime = new Date().getTime() + tMax * 1000;

        let timingFn = setInterval(function () {
            canv.clearRect(0, 0, canv.width, canv.height);
            canv.beginPath();
            canv.moveTo(1250, 1250);
            canv.arc(1250, 1250, 1200, 0, Math.PI * 2 * (t++ / (tMax * 60)));
            canv.lineTo(1250, 1250);
            canv.fill();
            if (new Date().getTime() > endTime) {
                clearInterval(timingFn);
                chooseWinner();
            }
        }, 1000 / 60);
    },

    tallCard: async (title, content) => {
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
            <select class="gameSettings" id="gameType">
                <option value="default" selected hidden disabled>Game Type</option>
                <option value="100p">First to 100 points</option>
                <option value="150p">First to 150 points</option>
                <option value="200p">First to 200 points</option>
                <option value="5t">5 turns each</option>
                <option value="10t">10 turns each</option>
                <option value="15t">15 turns each</option>
            </select>
            <select class="gameSettings"id="guessTime">
                <option value="default" selected hidden disabled>Time per Turn</option>
                <option value=30>30 seconds per turn</option>
                <option value=60>60 seconds per turn</option>
                <option value=90>90 seconds per turn</option>                                                          
            </select>
        </div>
        <div class="bottom">
            <button id="startBtn" style="background-color: #999">Add Players</button>
        </div>
        `
    }
};
