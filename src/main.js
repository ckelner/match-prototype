// TODO: these should be dynamic
// TODO: probably want to throw these in an object
var GLOBE_sqSize = 96,
    GLOBE_rowWidth = 480,
    GLOBE_playerCurHoverArr = [ ],
    GLOBE_unHoverTimeoutIdArr = [ ],
    GLOBE_playerDirection = "top",
    GLOBE_numOfRows = 9,
    GLOBE_domLog = null;

$(function() {
  var gameBoard = $("#game-board");
  createGrid(gameBoard);
  setupGrid();
  setupDOMLogging();
  setInterval(moveGrid, 20);
});

function setupDOMLogging(){
  GLOBE_domLog = $("#DOMLogging")[0];
}

function logToDOM(msg){
  GLOBE_domLog.innerHTML += msg + "<br>";
  console.log(msg);
  GLOBE_domLog.scrollTop = GLOBE_domLog.scrollHeight;
}

function createGrid(gameBoard){
  var rows = gameBoard.width() / GLOBE_numOfRows;
  var numOfCols = 5;
  var columns = gameBoard.height() / numOfCols;
  for(var r = 0; r < GLOBE_numOfRows; r++){
    var rowHTML = "<div class='rowDiv' id='row"+r+"'>";
    for(var c = 0; c < numOfCols; c++){
      rowHTML += writeRow(randColor(), c);
    }
    rowHTML += "</div>"
    gameBoard.append(rowHTML);
  }
}

function writeRow(color, num){
  return "<div class='colDiv "+color+"' game_Color='"+color+"' onmouseover='sqHover(this)' onmouseout='sqOut(this)' id='col"+num+"'></div>"
}

function randColor(){
  // return 0 - 4
  var num = Math.floor(Math.random()*5);
  switch(num){
    case 0: return "blueCol"; break;
    case 1: return "redCol"; break;
    case 2: return "yellowCol"; break;
    case 3: return "orangeCol"; break;
    case 4: return "greenCol"; break;
  }
}

function setupGrid(){
  var kids = $("#game-board").children();
  kids.each(function( index ) {
    var domObj = kids[index];
    if(domObj.velocity === undefined || domObj.velocity === null){
      domObj.velocity = randomVelocity();
    }
    if(domObj.direction === undefined || domObj.direction === null){
      domObj.direction = randomDirection();
    }
    if(domObj.counter === undefined || domObj.counter === null){
      domObj.counter = 5;
    }
    if(domObj.pauseAni === undefined || domObj.pauseAni === null){
      domObj.pauseAni = false;
    }
  });
}

function moveGrid(){
  var kids = $("#game-board").children();
  kids.each(function( index ) {
    rowAnim(kids[index]);
  });
}

function randomVelocity(){
  var rand = Math.floor((Math.random() * 5) + 1);
  return rand.toString();
}

function randomDirection(){
  switch(Math.floor(Math.random() * 2)){
    case 0: return "left"; break;
    case 1: return "right"; break;
  }
}

function rowAnim(domObj){
  if(!domObj.pauseAni){
    var jQDomObj = $(domObj);
    var velocity = (domObj.velocity * 1);
    var direction = domObj.direction;
    var offset = jQDomObj.css(direction);
    jQDomObj.css(direction, (offset.substring(0, offset.indexOf('p')) * 1) + velocity);
    drawMoreSquares(domObj, direction);
  }
}

function drawMoreSquares(domObj, dir){
  var jQDomObjParen = $(domObj.parentElement);
  var jQDomObj = $(domObj);
  var offSet = jQDomObj.css(dir);
  var offSetNum = offSet.substring(0, offSet.indexOf('p'));
  switch(dir){
    case "left":
      if(offSetNum >= 0){
        newSquare(domObj);
      }
    break;
    case "right":
      if((jQDomObj.width() - offSetNum) < GLOBE_rowWidth){
        newSquare(domObj);
      }
    break;
  }
}

function newSquare(domObj){
  var jQDomObj = $(domObj);
  if(domObj.direction === "left"){
    var left = jQDomObj.css('left');
    var newLeft = (left.substring(0, left.indexOf('p')) * -1) - GLOBE_sqSize;
    jQDomObj.css('left', newLeft);
  }
  var wid = jQDomObj.css('width');
  wid = wid.substring(0, wid.indexOf('p')) * 1;
  jQDomObj.css('width', wid + GLOBE_sqSize);
  var rowHtml = writeRow(randColor(), domObj.counter);
  if(domObj.direction === "left"){
    jQDomObj.prepend(rowHtml);
  } else {
    jQDomObj.append(rowHtml);
  }
  domObj.counter++;
  if(wid > GLOBE_rowWidth + (GLOBE_sqSize * 2)){
    if(domObj.direction === "left"){
      $(domObj.children[domObj.children.length - 1]).remove();
    } else {
      $(domObj.children[0]).remove();
      var offset = jQDomObj.css(domObj.direction);
      jQDomObj.css(domObj.direction, (offset.substring(0, offset.indexOf('p')) * 1) - GLOBE_sqSize);
    }
    jQDomObj.css('width', (domObj.children.length * GLOBE_sqSize));
  }
}

function sqHover(curObj){
  //DEBUG
  logToDOM("user hovered");
  if( checkFirstPauseRow(curObj) !== null && winner === false ) {
    clearTimeouts();
    clearPauseAndSqArray();
  }
  // see if the player has hovered over anything (successfully) yet
  if( GLOBE_playerCurHoverArr.length > 0 ) {
    // get the last object the player hovered over
    var prevObj = GLOBE_playerCurHoverArr[ GLOBE_playerCurHoverArr.length - 1 ];
    if( prevObj !== undefined && prevObj !== null && prevObj != curObj ) {
      // compare the previous color with the current
      if( prevObj.attributes.game_color.value === curObj.attributes.game_color.value ) {
        var winner = checkIfWinner(curObj);
        if( winner === false ) {
          var continuePath = false;
          var previousRow = prevObj.parentElement.id.substring(3,4) * 1;
          var currentRow = curObj.parentElement.id.substring(3,4) * 1;
          switch( GLOBE_playerDirection ) {
            case "down":
              if( previousRow < currentRow ) {
                continuePath = true;
              } else {
                continuePath = false;
              }
            break;
            case "up":
              if( currentRow < previousRow ) {
                continuePath = true;
              } else {
                continuePath = false;
              }
            break;
            default:
              continuePath = false;
            break;
          }
          if( continuePath ) {
            clearTimeouts();
            pauseSq(prevObj);
            pauseSq(curObj);
            addSq(curObj);
          } else {
            brokenPatten();
          }
        } else {
          winnerAction();
        }
      } else {
        brokenPatten();
      }
    } else {
      clearTimeouts();
      // else we do nothing - same fucking object
      logToDOM("javascript thinks these fucking objects are the same")
    }
  } else {
    GLOBE_playerDirection = checkFirstPauseRow(curObj);
    if( GLOBE_playerDirection !== null ){
      clearTimeouts();
      clearPauseAndSqArray();
      pauseSq(curObj);
      addSq(curObj);
    }
  }
}

// check if row is at very top or bottom
function checkFirstPauseRow(sqObj){
  // GLOBE_playerDirection: up, down (more to come?)
  // number of rows limited to: GLOBE_numOfRows
  switch(sqObj.parentElement.id){
    case 'row0':
      return "down";
    break;
    case 'row8':
      return "up";
    break;
    default:
      return null; // started in the middle - BAD
    break;
  }
}

function pauseSq(sqObj){
  sqObj.parentElement.pauseAni = true;
}

function unPauseSq(sqObj){
  sqObj.parentElement.pauseAni = false;
}

function brokenPatten(){
  //DEBUG
  logToDOM("detect break in the pattern");
  clearPauseAndSqArray();
}

function clearPauseAndSqArray(){
  $.each( GLOBE_playerCurHoverArr, function( i, sqObj ){
    unPauseSq(sqObj);
  });
  GLOBE_playerCurHoverArr = [ ];
  clearTimeouts();
}

function addSq(sqObj){
  GLOBE_playerCurHoverArr.push(sqObj);
}

function sqOut(curObj){
  //DEBUG
  logToDOM("user unhovered");
  var timeoutId = setTimeout(brokenPatten, 2000);
  GLOBE_unHoverTimeoutIdArr.push( timeoutId );
}

function clearTimeouts(){
  $.each( GLOBE_unHoverTimeoutIdArr, function( i, timeoutId ){
    clearTimeout( timeoutId );
  });
  GLOBE_unHoverTimeoutIdArr = [ ];
}

function checkIfWinner(curObj){
  var firstLastRow = checkFirstPauseRow(curObj);
  if( firstLastRow !== null ) { // < got first or last
    if( GLOBE_playerCurHoverArr.length >= 7 ) { // < with 8 rows
      return true;
    }
  }
  return false;
}

function winnerAction(){
  alert("Winner winner chicken dinner!");
}
