import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {createTime, getRandomColorPairs, hidePlayAgainButton, setTimeText, showPlayAgainButton}from'./utils.js'
import{getColorBackground,
    getColorElementList,
    getTimerElement,
    getPlayAgainButton,
    getColorListElement,
    getInActiveColorList,}from './selectors.js'
// Global variables
let selections = []
let gameStatu = GAME_STATUS.PLAYING
let timer=createTime({
    second:5,
    onChange: handleTimeChange,
    onFinish: handleTimeFinish,
}) 
function handleTimeChange(second){
    const fullSecond=`0${second}`.slice(-2)
    const fullgiay=`${fullSecond}'s`
    setTimeText(fullgiay)
}
function handleTimeFinish(){
    gameStatu=GAME_STATUS.FINISHED,
    setTimeText('GAME Over 😰')
    showPlayAgainButton()
}


// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
function HandleColorClick(liElement){
    const shouldBlockClick=[GAME_STATUS.BLOCKING,GAME_STATUS.FINISHED].includes(gameStatu)
    const isClicked =liElement.classList.contains('active')
    if(!liElement||isClicked||shouldBlockClick)return
    // show color for clicked cell
    liElement.classList.add('active')

    // save clicked cell to selections
    selections.push(liElement)
    if(selections.length<2)return

    // check match
    const firtsColor=selections[0].dataset.color;
    const secondColor=selections[1].dataset.color;
    const isMatch=firtsColor===secondColor;
    if(isMatch){
        const isWin=getInActiveColorList().length===0
        if(isWin){
            showPlayAgainButton()
            setTimeText('YOU WIN! 🏆')
            timer.clear()
            gameStatu=GAME_STATUS.FINISHED
        }
        selections=[];
        return
    }
    // in case of not match
    // remove active class for 2 li element
    gameStatu=GAME_STATUS.BLOCKING
    setTimeout(()=>{
        selections[0].classList.remove('active')
        selections[1].classList.remove('active')
     // reset selectotions for the next turn
        selections=[]
        if(gameStatu!==GAME_STATUS.FINISHED){
            gameStatu=GAME_STATUS.PLAYING
        }
    },500)
  
}
 function initColors(){
    // random 8 pairs of color
    const colorslist= getRandomColorPairs(PAIRS_COUNT);
    // bind to li> div  .overlay
    const liList=getColorElementList();
    liList.forEach((liElement,index)=>{
        liElement.dataset.color=colorslist[index]
        const overlayElement=liElement.querySelector('.overlay')
        if(overlayElement)overlayElement.style.backgroundColor=colorslist[index]
    })
 }
 function AttachEventForColorList(){
    const ulElement=getColorListElement()
    if(!ulElement)return
    ulElement.addEventListener('click',(event)=>{
        HandleColorClick(event.target)
    })
 }
 function resetGame(){
    // reset globla vars
    gameStatu=GAME_STATUS.PLAYING
    selections=[]
    //reset DOM element
    //-remove active class form li
    //- hide replay button
    //- clear you win / time text
    const colorElementList=getColorElementList()
    for(const colorElement of colorElementList){
        colorElement.classList.remove('active')
    }
    hidePlayAgainButton()
    setTimeText('')
    // re-generate new color
    initColors()
    // start new game
    startTimer()
 }
 function attachEventForPalyAgainButton(){
    const playAgainButton=getPlayAgainButton();
    if(!playAgainButton)return
    playAgainButton.addEventListener('click',resetGame)
 }
 function startTimer(){
    timer.start()
 }
// main
(()=>{
    initColors();

    AttachEventForColorList();
    attachEventForPalyAgainButton()
    startTimer()
})()
