import{ getColorBackground, getPlayAgainButton, getTimerElement }from'./selectors.js'
function shuffle(arr){
  if(!Array.isArray(arr)||arr.length<= 2)return

  for(let i=arr.length-1;i>1;i--){
    const j=Math.floor(Math.random()*i)
    let tem=arr[i];
    arr[i]=arr[j]
    arr[j]=tem
  }
}
export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorslist=[]
  const huelist=['red','orange','yellow','green','blue','purple','pink','monochrome']

  // random "count" colors
  for(let i=0;i<count;i++){
    //randomcolors function is provided by https://github.com/davidmerfield/randomColor
   const color=window.randomColor({
      luminosity: 'dark',
      hue: huelist[i%huelist.length],
   });
   colorslist.push(color)
  }
  const fullcolorList=[...colorslist,...colorslist]
  shuffle(fullcolorList)
  return fullcolorList
}
export function showPlayAgainButton(){
  const playAgainButton=getPlayAgainButton()
  if(playAgainButton)playAgainButton.classList.add('show')
}
export function hidePlayAgainButton(){
  const playAgainButton=getPlayAgainButton()
  if(playAgainButton)playAgainButton.classList.remove('show')
}
export function setTimeText(text){
  const tiemElement=getTimerElement()
  if(tiemElement)tiemElement.textContent=text
}
export function createTime({second,onChange,onFinish}){
  let Interval=null
  
  function start(){
    clear()
    let currentSecond=second
    Interval=setInterval(()=>{
      // if(onChange)onChange(currentSecond)
      onChange?.(currentSecond)
      currentSecond--
      if(currentSecond<0){
        clear()
        onFinish?.()
      }

    },1000)
  }
  function clear(){
    clearInterval(Interval)
  }
  return{
    start,
    clear,
  }
}
export function setBackgroundColor(color){
  const BackgroundColorElement=getColorBackground()
  if(BackgroundColorElement)BackgroundColorElement.style.backgroundColor=color
}