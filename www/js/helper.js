// @author jonathan
function mergeDecks(deck1, deck2) {
    for (let d2 of deck2.cards) { //for every card in deck2
        let d2ind1 = false
        for (let d1 of deck1.cards) { //iterate over the cards in deck1
            if (d2.category == d1.category) { //if they are in the same category
                d1.items = d1.items.concat(d2.items)
                d2ind1 = true;
                break;
            }
        }
        if (!d2ind1) deck1.cards.push(d2) //if they are not in the same category then it is a new category
    }
    return deck1
}

function addCategory(catName, item) {
    if (item) {
        deck.cards.push({
            category: catName,
            items: [item]
        })
        localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
    }
    console.log(deck.cards);
}

function addCard(catIndex, cardValue) {
    deck.cards[catIndex].items.push(cardValue);
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
}

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

function doAddCat() {
    const cat = document.getElementById('catValue').value
    const item = document.getElementById('itemValue').value
    if (item) {
        addCategory(cat, item)
        startBrowser()
    } else alert("Please add a card to the new category")
}

function doDelCat() {
    const index = this.getAttribute('data-catRef');
    deck.cards.splice(index, 1);
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
    startBrowser();
}

function doAddCard() {
    const index = this.getAttribute('data-catRef');
    const item = document.getElementById('itemValue').value
    if (item) {
        addCard(index, item)
        startBrowser()
    } else alert("Cards can't be blank")
}

function doDelCard() {
    const i = this.getAttribute('data-catRef');
    const j = this.getAttribute('data-cardRef');
    deck.cards[i].items.splice(j, 1);
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
    startBrowser();
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