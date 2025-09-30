const API_URL 
const NUMBER_OF_CATEGORIES = 8;
const NUMBER_OF_CLUES_PER_CATEGORY = 6;

let categories= [];
let activeClue= null;
let activeClueMode=0;
let isPlayButtonClickable = true;
$("#play").on("click, handleClickOfPlay");
function handleClickOfPlay(){
    if (isPlayButtonClickable){
        setupTheGame();
    }
}

async function setupTheGame() {
    $("#spinner").show();
    $("#categories").empty();
    $("#clues").empty();
    $("#active-clue").html("");
    $("#play").text("Restarting...");
    isPlayButtonClickable = false;

    const categoryIds = await getCategoryIds();

    categories =[];
    for (let id of categoryIds){
        let catData = await getCategoryData(id);
        categories.push(catData);
    }

    fillTable(categories);

    $("#spinner").hide();
    $("#play").text("Restart Game");
}
async function getCategoryIds(categoryId) {
    const res = await fetch ('${API_URL}categories?id=${categoryId}');
    const data = await res.json
    
    let validCats = data.filter(c => c.clues_count >= NUMBER_OF_CLUES_PER_CATEGORY);
    let selected =[];
    while(selected.length < NUMBER_OF_CATEGORIES){
        let randomIndex= Math.floor(Math.random()* validCats.length);
        let cat = validCats[randomIndex];
        if (!selected.includes(cat.id)){
            selected.push(cat.id);
        }
    }
    return selected;
}
async function getCategoryData(categoryId) {
    const res= await fetch('${API_URL}category?id=${categoryid');
    const data = await res.json();

    let shuffledClues = data.clues.sort(()=> 0.5 - Math.random());
    let chosenClues = shuffledClues.slice (0, NUMBER_OF_CLUES_PER_CATEGORY);
    
    let formattedClues = chosenClues.map ((c, 1 )=> ({
        id: c.id,
        value: c.value || (i+1)*200,
        question: c.question,
        answer: c.answer
    }));
    return {
        id:data.id,
        title: data.title,
        clues: formattedClues
    };
}

