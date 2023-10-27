const state ={

    score:{

        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")

    },

    cardSprites:{

        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")

    },

    fieldCards:{

        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")

    },

    playerSides:{

        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")

    },

    button: document.getElementById("next-duel")

};

const playerSides = {

    player1: "player-cards",
    computer: "computer-cards"

}

//Atalho para a pasta dos ícones
const pathImages = "./src/assets/icons/";

//Cartas do Jogo
const cardData = [

    {

        id: 0,
        name: "Dragão Branco de Olhos Azuis",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]

    },

    {
        id: 1,
        name: "Mago Negro",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]

    },

    {

        id: 2,
        name: 'Exodia, "O Proibido"',
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]

    },

];

async function getRandomCardId(){

    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;

}

async function createCardImage(idCard, fieldSide){

    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    //Se cardImage for o jogador, cria a carta no campo
    if(fieldSide == playerSides.player1){

        cardImage.addEventListener("click", ()=>{

            setCardsField(cardImage.getAttribute("data-id"));

        });

        cardImage.addEventListener("mouseover", ()=>{

            drawSelectCard(idCard);
    
        });

    }

    return cardImage;

}

async function setCardsField(cardId){

    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    await showHiddenCardFieldsImages(true);
    await hiddenCardDetails();
    await drawCardsInField(cardId, computerCardId);
    let duelResults = await checkDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);

}

//Mostra as cartas no campo
async function drawCardsInField(cardId, computerCardId){

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}

//Se o value for true mostra as cartas. Se for false, oculta as cartas
async function showHiddenCardFieldsImages(value){

    if(value == true){

        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";

    }

    if(value == false){

        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";

    }

}

//Oculta os campos
async function hiddenCardDetails(){

    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

}

async function drawButton(text){

    state.button.innerText = text.toUpperCase();
    state.button.style.display = "block";

}

async function updateScore(){

    state.score.scoreBox.innerText = `Vitórias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`;

}

async function checkDuelResults(playerCardId, computerCardId){

    let duelResults = "Empatou";
    let playerCard = cardData[playerCardId];

    //Se o jogador ganhar o duelo
    if(playerCard.WinOf.includes(computerCardId)){

        duelResults = "Ganhou";
        await playAudio("win");
        state.score.playerScore++;

    }

    if(playerCard.LoseOf.includes(computerCardId)){

        duelResults = "Perdeu";
        await playAudio("lose");
        state.score.computerScore++;

    }

    return duelResults;

}

//Remove todas as cartas
async function removeAllCardsImages(){

    let {computerBOX, player1BOX} = state.playerSides;

    //Removendo cartas do computador
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());

    //Removendo cartas do jogador
    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());

}

async function drawSelectCard(index){

    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atributo : " + cardData[index].type;


}

async function drawCards(cardNumbers, fieldSide){

    for(let i = 0; i < cardNumbers; i++){

        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);

    }

}

//Reseta o duelo após atualizar o score. Essa função é chamada no index.html
async function resetDuel(){

    state.cardSprites.avatar.src="";
    state.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();

}

async function playAudio(status){

    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();

}

function init(){

    showHiddenCardFieldsImages(false);
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
    const bgm = document.getElementById("bgm");
    bgm.play();

}

init();