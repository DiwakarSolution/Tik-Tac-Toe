let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg_container.hide");  // let msgContainer = document.querySelector(".msg_container .hide");
let msg = document.querySelector("#msg");
let turnO = true;//playerX, playerY
// let arr = ["apple", "banana", "litchi"]; //example
// let arr2D = [["apple", "litchi"],["potato", "masrum"],["pant", "shirt"]];//2d array
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
];

const disableboxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enabledBoxes = () => {
    for (let box of boxes) {
        box.disableboxes = false;
        box.innerText = "";
        box.disabled = false;
    }
};

const showWinner = (Winner) => {
    msg.innerText = `Congratution,\n Winner is ${Winner}`;
    msgContainer.classList.remove("hide");
};

const resetGame =  () => {
    turnO = true;
    enabledBoxes();
    msgContainer.classList.add("hide");
}
boxes.forEach((box) => {
   box.addEventListener("click", () => {
        console.log("box was clicked");
        if(turnO) {
            box.innerText = "O";   //playerO
            turnO = false;
        }else{
             box.innerText = "X";  //playerX
             turnO = true;
        }
        box.disabled = true;
        checkWinner();
   });
});
const checkWinner = () => {
    for(pattern of winPatterns){
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;
        
        if(pos1val != "" && pos2val != "" && pos3val){
            if(pos1val === pos2val && pos2val === pos3val){
                console.log("You are Winner!", pos1val);
                disableboxes();
                showWinner(pos1val);
            }
        }
    }
}

newBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);