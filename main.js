$(function() {
	var gameBoard = $("#game-board");
	createGrid(gameBoard);
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
			rowHTML += "<div class='colDiv "+randColor()+"' id='col"+c+"'></div>";
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

function moveGrid(){
	// child array
	var kids = $("#game-board").children();
	kids.each(function( index ) {
		var domObj = kids[index];
		if(domObj.velocity === undefined || domObj.velocity === null){
			domObj.velocity = randomVelocity();
		}
		if(domObj.direction === undefined || domObj.direction === null){
			domObj.direction = randomDirection();
		}
		rowAnim(domObj);
	});
}

function randomVelocity(){
	var rand = (Math.random() * 5) + 1;
	return rand.toString();
}

function randomDirection(){
	switch(Math.floor(Math.random() * 2)){
		case 0: return "left"; break;
		case 1: return "right"; break;
	}
}

function rowAnim(domObj){
	var jQDomObj = $(domObj);
	var velocity = (domObj.velocity * 1);
	var direction = domObj.direction;
	var offset = jQDomObj.css(direction);
	jQDomObj.css(direction, (offset.substring(0, offset.indexOf('p')) * 1) + velocity);
	drawMoreSquares(domObj, direction);
}

function drawMoreSquares(domObj, dir){
	var jQDomObjParen = $(domObj.parentElement);
	var jQDomObj = $(domObj);
	var offSet = jQDomObj.css(dir);
	var offSetNum = offSet.substring(0, offSet.indexOf('p'));
	switch(dir){
		case "left":
			if(offSetNum > 0){
				newSquareLeft(domObj);
			}
		break;
		case "right":
			// TODO: 480 is hard-coded row width... should be dynamic
			if((jQDomObj.width() - offSetNum) < 480){
				newSquareRight(domObj);
			}
		break;
	}
}

function newSquareRight(domObj){
	var lastId = domObj.children[domObj.children.length-1].id;
	var colNum = (lastId.substring(3, lastId.length) * 1) + 1;
	var jQDomObj = $(domObj);
	jQDomObj.append("<div class='colDiv "+randColor()+"' id='col"+colNum+"'></div>");
	var wid = jQDomObj.css('width');
	wid = wid.substring(0, wid.indexOf('p')) * 1;
	// TODO: should be dynamic
	jQDomObj.css('width', wid + 96);
	if(wid > 480 + (96 * 2)){
		$(domObj.children[0]).remove();
		jQDomObj.css('width', wid - 96);
		var offset = jQDomObj.css('right');
		jQDomObj.css('right', (offset.substring(0, offset.indexOf('p')) * 1) - 96);
	}
	if(domObj.children.length - 1 > 10){
		// how many over
		var overBy = (domObj.children.length - 1) - 12;
		for(var x = 0; x < overBy - 1; x++){
			$(domObj.children[x]).remove();
			/*wid = jQDomObj.css('width');
			wid = wid.substring(0, wid.indexOf('p')) * 1;
			jQDomObj.css('width', wid - 96);*/
			offset = jQDomObj.css('right');
			jQDomObj.css('right', (offset.substring(0, offset.indexOf('p')) * 1) - 96);
		}
	}
}

function newSquareLeft(domObj){
	var lastId = domObj.children[domObj.children.length-1].id;
	var lastIdNum = (lastId.substring(3, lastId.length) * 1);
	var firstId = domObj.children[0].id;
	var firstIdNum = (firstId.substring(3, firstId.length) * 1);
	var whichNum = lastIdNum + 1;
	if(firstIdNum > lastIdNum){
		whichNum = firstIdNum + 1;
	}
	var jQDomObj = $(domObj);
	jQDomObj.prepend("<div class='colDiv "+randColor()+"' id='col"+whichNum+"'></div>");
	// TODO: 96 is hard-coded col width... should be dynamic
	jQDomObj.css('width', jQDomObj.width() + 96);
	var left = jQDomObj.css('left');
	var newLeft = (left.substring(0, left.indexOf('p')) * -1) - 96;
	jQDomObj.css('left', newLeft);
	var wid = jQDomObj.css('width');
	wid = wid.substring(0, wid.indexOf('p')) * 1;
	if(wid > 480 + (96 * 2)) {
		var childLen = domObj.children.length;
		$(domObj.children[childLen-1]).remove();
		jQDomObj.css('width', wid - 96);
	}
	if(domObj.children.length - 1 > 10){
		// how many over
		var overBy = (domObj.children.length -1) - 12;
		for(var x = 0; x < overBy - 1; x++){
			var childLen = domObj.children.length;
			$(domObj.children[childLen-1]).remove();
			wid = jQDomObj.css('width');
			wid = wid.substring(0, wid.indexOf('p')) * 1;
			jQDomObj.css('width', wid - 96);
		}
	}
}
