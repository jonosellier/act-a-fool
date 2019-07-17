// @author jonathan
function gameOver(settingsObj) {
    switch (settingsObj.condition) {
        case 'turns':
            if (settingsObj.current >= settingsObj.threshhold) return true;
            break;
        case 'points':
            for (const player of players) {
                if (player.score >= settingsObj.current) { settingsObj.current = player.score; }
            }
            if (settingsObj.current >= settingsObj.threshhold) return true;
            break;
        default:
            return false;
    }
    return false;
}

function togglePause() {
    const pauseScreen = document.getElementById('pauseScreen');
    if (pauseScreen.style.display == 'none') pauseScreen.style.display = 'block';
    else pauseScreen.style.display = 'none';
}

function incrementScore() {
    const index = this.getAttribute('data-playerRef');
    players[index].score += 10;
    showScores();
}

function decrementCurrPlayerScore() {
    players[currPlayer].score -= 5;
    if (players[currPlayer].score <= 0) players[currPlayer].score = 0;
    console.log(players);
    showScores();
}

function addPlayer() {
    players.push({ name: document.getElementById('newPlayer').value, score: 0 });
    printPlayers();
}

function removePlayer() {
    const index = this.getAttribute('data-playerRef');
    console.log(index);
    console.log(players);
    players.splice(index, 1);
    console.log(players);
    printPlayers();
}

function rank(players) {
    const out = [...players].sort((a, b) => (a.score - b.score));
    console.log(players);
    console.log(out);
    return out;
}