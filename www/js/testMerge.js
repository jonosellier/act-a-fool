function mergeDecks(deck1, deck2) {
    for (let d2 of deck2.cards) { //for every card in deck2
        let d2ind1 = false
        for (let d1 of deck1.cards) { //iterate over the cards in deck1
            if (d2.category == d1.category) { //if they are in the same category
                d1.items = d1.items.concat(d2.items)
                d2ind1 = true;
            }
        }
        if (!d2ind1) deck1.cards.push(d2) //if they are not in the same category then it is a new category
    }
    return deck1
}

let a = {
    cards: [{
            category: "a",
            items: [
                "1", "2", "3"
            ]
        },
        {
            category: "b",
            items: [
                "1", "2", "3"
            ]
        },
        {
            category: "c",
            items: [
                "1", "2", "3"
            ]
        }
    ]
}

let b = {
    cards: [{
            category: "a",
            items: [
                "4", "5"
            ]
        },
        {
            category: "d",
            items: [
                "1", "2", "3"
            ]
        },
        {
            category: "c",
            items: [
                "9", "10", "11"
            ]
        }
    ]
}

let c = mergeDecks(a, b);

console.log(JSON.stringify(c));