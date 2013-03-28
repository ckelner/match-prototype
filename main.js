// TODO: these should be dynamic
var GLOBE_sqSize = 96;
var GLOBE_rowWidth = 480;
$(function() {
	var gameBoard = $("#game-board");
	createGrid(gameBoard);
	setupGrid();
	setInterval(moveGrid, 20);
});

function createGrid(gameBoard){
	var numOfRows = 9;
	var rows = gameBoard.width() / numOfRows;
	var numOfCols = 5;
	var columns = gameBoard.height() / numOfCols;
	for(var r = 0; r < numOfRows; r++){
		var rowHTML = "<div class='rowDiv' id='row"+r+"'>";
		for(var c = 0; c < numOfCols; c++){
			rowHTML += "<div class='colDiv "+randColor()+"' onmouseover='sqHover(this)'"+
			" onmouseout='sqMouseOut(this)' id='col"+c+"'></div>";
		}
		rowHTML += "</div>"
		gameBoard.append(rowHTML);
	}
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
	if(rowPauseHandler(domObj)){
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
	if(domObj.direction === "left"){
		jQDomObj.prepend("<div class='colDiv "+randColor()+"' onmouseover='sqHover(this)'"+
			" onmouseout='sqMouseOut(this)' id='col"+domObj.counter+"'></div>");
	} else {
		jQDomObj.append("<div class='colDiv "+randColor()+"' onmouseover='sqHover(this)'"+
			" onmouseout='sqMouseOut(this)' id='col"+domObj.counter+"'></div>");
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
	curObj.parentElement.pauseAni = true;
	curObj.heldByPlayer = true;
}

function sqMouseOut(curObj){
	curObj.parentElement.pauseAni = false;
	curObj.heldByPlayer = false;
}

function rowPauseHandler(domObj){
	if(domObj.pauseAni === undefined || domObj.pauseAni === null || domObj.pauseAni !== true){
		return true;
	} else {
		return false;
	}
}

