"use strict";

// All Variables__________________________

let canvas = document.getElementById ("myCanvas");
let ctx = canvas.getContext ('2d');
let widthCanvas = 1336;
let heightCanvas = 596;
let isDrawing = false;
let activeBlocks = false;
let activeFeatures = false;
let mouseX = 0;
let mouseY = 0;
let hitIndex;
let newX;
let newY;
let newBlock;
let newFeature;
let newLink;
let listOfBlocks = [];
let listOfFeatures = [];
let listOfLinks = [];
let listOfHierarchies = [];
let oneClickX;
let oneClickY;
let textWidth ;
let input;
let activeInput = false;

let standartBlock = {
  text:'',
  color: 'aqua',
  centerX: widthCanvas / 2 - 70,
  centerY: heightCanvas / 2 - 20,
  x: widthCanvas / 2 - 70,
  y: heightCanvas / 2 - 20,
  width: 30,
  height: 34,
  r: 10
};

let standartFeature = {
  color: 'aqua',
  x: widthCanvas / 2 - 10,
  y: heightCanvas / 2 - 30,
  width: 20,
  height: 20,
  centerX: 0,
  centerY: 0,
  r: 10
};

let standartLink = {
  index1: 0,
  index2: 0,
  color: 'blue',
  width:  8,
  beginX: 0,
  beginY: 0,
  endX: 0,
  endY: 0,
  v1: 0,
  v2: 0,
  v3: 0,
  v4: 0,
  centerX: 0,
  centerY: 0,
  beginArrowX: 0,
  beginArrowY: 0,
  endArrowX: 0,
  endArrowY: 0
};

// All Functions__________________________

function activationOfElements () {
  if (activeBlocks === false) {
    hitIndex = checkHit(listOfBlocks)
    if (hitIndex !== undefined) {
      activeBlocks = true;
    } else {
      activeBlocks = false;
    };
  } else {
    hitIndex = checkHit(listOfFeatures)
    if (hitIndex !== undefined) {
      activeFeatures = true;
    } else {
      activeFeatures = false;
      hitIndex = checkHit(listOfBlocks)
      if (hitIndex !== undefined) {
        activeBlocks = true;
      } else {
        activeBlocks = false;
      };
    };
  };
};

function checkHit (someBlocks) {
  let result = undefined;
  someBlocks.forEach(function(block, i, someBlocks) {
    if (mouseX > block.x & mouseX < block.x+block.width & mouseY > block.y & mouseY < block.y+block.height) {
      result = i;
    };
  });
  return result;
};

// Drawing Elements__________________________

function clearCanvas () {
  ctx.clearRect(0, 0, widthCanvas, heightCanvas);
};

function doFormat () {
  listOfBlocks.forEach(function(block, i, listOfBlocks) {
    block.width = Math.round(ctx.measureText(block.text).width) + 50;
    block.x = block.centerX - block.width / 2;
    block.y = block.centerY - block.height / 2;
  });
  listOfFeatures.forEach(function(feature, i, listOfFeatures) {
    feature.x = listOfBlocks[i].centerX - feature.width / 2;
    feature.y = listOfBlocks[i].centerY - listOfBlocks[i].height / 2 - feature.height;
    feature.centerX = listOfBlocks[i].centerX;
    feature.centerY = listOfBlocks[i].centerY - listOfBlocks[i].height/2 - feature.height/2;
  });
  listOfLinks.forEach(function(link, i, listOfLinks) {
    link.beginX = listOfBlocks[link.index1].centerX;
    link.beginY = listOfBlocks[link.index1].centerY;
    link.endX = listOfBlocks[link.index2].centerX;
    link.endY = listOfBlocks[link.index2].centerY;

    if (Math.abs(link.beginX - link.endX) > Math.abs(link.beginY - link.endY)) {
      link.v1 = link.beginX;
      link.v2 = link.endY;
      link.v3 = link.endX;
      link.v4 = link.beginY;

      link.centerX = link.beginX + (link.endX - link.beginX) / 2;
      link.centerY = link.beginY + (link.endY - link.beginY) / 2;

      if (link.beginX < link.endX) {
        link.beginArrowX = link.centerX - 10;
      } else {
        link.beginArrowX = link.centerX + 10;
      };
      link.beginArrowY = link.centerY - 5;
      link.endArrowX = link.beginArrowX;
      link.endArrowY = link.centerY + 5;
    } else {
      link.v1 = link.endX;
      link.v2 = link.beginY;
      link.v3 = link.beginX;
      link.v4 = link.endY;

      link.centerX = link.beginX - (link.beginX - link.endX) / 2;
      link.centerY = link.beginY - (link.beginY - link.endY) / 2;

      if (link.beginY < link.endY) {
        link.beginArrowY = link.centerY - 10;
      } else {
        link.beginArrowY = link.centerY + 10;
      };
      link.beginArrowX = link.centerX - 5;
      link.endArrowX = link.centerX + 5;
      link.endArrowY = link.beginArrowY;
    };
  });
};

function drawLinks () {
  listOfLinks.forEach(function(link, i, listOfLinks) {
    ctx.beginPath();
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 3;
    ctx.strokeStyle = link.color;
    ctx.lineWidth = link.width;
    ctx.moveTo(link.beginX, link.beginY);
    ctx.bezierCurveTo(link.v1, link.v2, link.v3, link.v4, link.endX, link.endY);
    ctx.stroke();
    // Drawing Arrow
    ctx.beginPath();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#3c2c3e';
    ctx.lineWidth = 5;
    ctx.moveTo(link.beginArrowX, link.beginArrowY);
    ctx.lineTo(link.centerX, link.centerY);
    ctx.lineTo(link.endArrowX, link.endArrowY);
    ctx.stroke();
  });
};

function drawBlocks () {
  listOfBlocks.forEach(function(block, i, listOfBlocks) {
    if (activeBlocks === true & hitIndex == i) {
      ctx.fillStyle = 'white';
    } else {
      ctx.fillStyle = block.color;
    };
    ctx.beginPath();
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 3;
    ctx.moveTo(block.x + block.r, block.y);
    ctx.arc(block.x + (block.width - block.r), block.y + block.r, block.r, (1.5 * Math.PI), (2 * Math.PI), false);
    ctx.arc(block.x + (block.width - block.r), block.y + (block.height - block.r), block.r, (2 * Math.PI), (0.5 * Math.PI), false);
    ctx.arc(block.x + block.r, block.y + (block.height - block.r), block.r, (0.5 * Math.PI), (Math.PI), false);
    ctx.arc(block.x + block.r, block.y + block.r, block.r, (Math.PI), (1.5 * Math.PI), false);
    ctx.fill();

    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.strokeStyle = '#17706E';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Text
    ctx.beginPath();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '18px Arial';
    ctx.fillText(block.text, block.centerX, block.centerY + 1);
  });
};

function drawFeatures () {
  let f = listOfFeatures[hitIndex];
  // ctx.beginPath();
  // ctx.fillStyle = 'red';
  // ctx.fillRect(f.x, f.y, f.width, f.height);
  // ctx.fill();
  ctx.beginPath();
  ctx.shadowColor = 'black';
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 3;
  ctx.lineWidth = 1;
  ctx.fillStyle = f.color;
  ctx.arc(f.centerX, f.centerY, f.r, 0, 2 * Math.PI, false);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.moveTo(f.centerX - 6, f.centerY)
  ctx.lineTo(f.centerX + 6, f.centerY)
  ctx.moveTo(f.centerX, f.centerY - 6)
  ctx.lineTo(f.centerX, f.centerY + 6)
  // ctx.fillRect(feature.x, feature.y, feature.width, feature.height);
  ctx.stroke();
};

function drawInfo (text1 = undefined, text2 = undefined,) {
  ctx.clearRect(0,0,150,300);
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '20px Arial';
  ctx.fillText('Index: '+ hitIndex, 20, 30);
  ctx.fillText('Feature: '+ activeFeatures, 20, 60);
  ctx.fillText('Block: '+ activeBlocks, 20, 90);
  ctx.fillText(text1, 20, 120);
  ctx.fillText(text2, 20, 150);
  ctx.fill();
};

function drawCanvas () {
  doFormat();
  clearCanvas();
  drawLinks();
  drawBlocks();
  // drawText();
};

// Creating Elements______________________

function createNewBlock (x1, y1) {
  newBlock = Object.assign({}, standartBlock);
  newBlock.centerX = x1;
  newBlock.centerY = y1;
  listOfBlocks.push(newBlock);
};

function createNewFeature () {
  newFeature = Object.assign({}, standartFeature);
  listOfFeatures.push(newFeature);
};

function createNewLink (index = false) {
  newLink = Object.assign({}, standartLink);
  newLink.index1 = hitIndex;
  if (index !== false) {
    newLink.index1 = hitIndex;
    newLink.index2 = index;
  } else {
    newLink.index2 = listOfBlocks.length - 1
  };
  listOfLinks.push(newLink);
};

function createNewElement (x1, y1) {
  createNewBlock(x1, y1);
  createNewLink();
  createNewFeature();
  addHierarchy()
}

// Moving Elements________________________

function moveBlock (x1, y1) {
  let u = false;
  let xxx = listOfBlocks[hitIndex].centerX - x1;
  let yyy = listOfBlocks[hitIndex].centerY - y1;
  listOfHierarchies.forEach(function(branch, i, listOfHierarchies) {
    if (hitIndex == branch[0]) {
      u = true;
      branch.forEach(function(index, i, branch) {
        listOfBlocks[index].centerX -= xxx;
        listOfBlocks[index].centerY -= yyy;
      });
    };
  });
  if (u === false) {
    listOfBlocks[hitIndex].centerX = x1;
    listOfBlocks[hitIndex].centerY = y1;
  }
};

function moveCanvas (x1, y1) {
  listOfBlocks.forEach(function(block, i, listOfBlocks) {
    block.centerX -= mouseX - x1;
    block.centerY -= mouseY - y1;
  });
};

function moveLink (x1, y1) {
  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 5;
  ctx.moveTo(listOfBlocks[hitIndex].centerX, listOfBlocks[hitIndex].centerY);
  ctx.lineTo(x1, y1);
  ctx.stroke();
};

function moveFeature (x1, y1) {
  listOfFeatures[hitIndex].centerX = x1;
  listOfFeatures[hitIndex].centerY = y1;
  listOfFeatures[hitIndex].x = listOfFeatures[hitIndex].centerX - listOfFeatures[hitIndex].width / 2;
  listOfFeatures[hitIndex].y = listOfFeatures[hitIndex].centerY - listOfFeatures[hitIndex].height / 2;
}

// Another Function_______________________

function addHierarchy () {
  let u = false;
  if (listOfHierarchies.length > 0) {
    listOfHierarchies.forEach(function(branch, i, listOfHierarchies) {
      if (hitIndex == branch[0]) {
        branch.push(listOfBlocks.length-1);
        u = true;
      };
      branch.forEach(function(index, i, branch) {
        if (i > 0 & index == hitIndex) {
          branch.push(listOfBlocks.length-1);
        };
      });
    });
    if (u === false) {
      listOfHierarchies.push([hitIndex, listOfBlocks.length-1])
    };
  } else {
    listOfHierarchies.push([hitIndex, listOfBlocks.length-1])
  };
};

// Input Functions________________________

function createInput () {
  if (activeInput === false) {
    activeInput = true;
    document.body.insertAdjacentHTML('afterend', '<input id="input-text" type="text" value="">');
    input = document.getElementById('input-text');
    input.value = listOfBlocks[hitIndex].text;
    textWidth = Math.round(ctx.measureText(listOfBlocks[hitIndex].text).width)
    input.style.width = textWidth + 25 + 'px';
    input.style.position = 'absolute';
    input.style.left = listOfBlocks[hitIndex].centerX - textWidth / 2-1 + 'px';
    input.style.top = listOfBlocks[hitIndex].centerY - 5 +'px';
    input.style.textAlign = "center";
    input.style.fontSize = '18px';
  };
};

function doDynamicInput () {
  if (input.value != listOfBlocks[hitIndex].text) {
    listOfBlocks[hitIndex].text = input.value;
    textWidth = Math.round(ctx.measureText(listOfBlocks[hitIndex].text).width)
    input.style.width = textWidth + 25 + 'px';
    input.style.left = listOfBlocks[hitIndex].centerX - textWidth / 2-1 + 'px';
    drawCanvas();
  };
};

function deleteInput () {
  if (activeInput === true) {
    input.remove();
    activeInput = false;
  }
}

// Event Of Mouse_________________________

canvas.addEventListener('mousedown', e => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  oneClickX = e.offsetX;
  oneClickY = e.offsetY;
  isDrawing = true;
  activationOfElements();
  deleteInput();
});

canvas.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    constructor(e.offsetX, e.offsetY);
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  };
});

canvas.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    isDrawing = false;
    constructor(e.offsetX, e.offsetY);
    mouseX = 0;
    mouseY = 0;
  };
});

document.addEventListener("keyup", e => {
  doDynamicInput();
});

// Constructor____________________________

function constructor (x1, y1) {
  if (activeBlocks === true & activeFeatures === false) {
    // Drawing Features and Blocks
    if (oneClickX == x1 & oneClickY == y1) {
      drawCanvas();
      drawFeatures();
      createInput();
      drawInfo();
    } else {
      // Moving Block
      moveBlock(x1, y1);
      drawCanvas();
      drawFeatures();
      drawInfo();
      deleteInput();
    };
  // Moving Feature
  } else if (activeBlocks === true & activeFeatures === true) {
    if (isDrawing === true) {
      moveFeature(x1, y1);
      clearCanvas();
      moveLink(x1, y1);
      drawLinks();
      drawBlocks();
      drawFeatures();
      drawInfo();
    // Create New Element
    } else {
      activeBlocks = false;
      activeFeatures = false;
      createLinkOrBlock(x1, y1);
      drawCanvas();
      drawInfo();
    };
  // Moving Canvas
  } else {
    moveCanvas(x1, y1);
    drawCanvas();
    drawInfo('click on Canvas');
  };
};

// Start__________________________________

listOfBlocks.push(Object.assign({}, standartBlock));
listOfFeatures.push(Object.assign({}, standartFeature));
drawCanvas();
drawCanvas();

// New Variables__________________________



// New Functions__________________________

function createLinkOrBlock (x1, y1) {
  let hit = checkHit(listOfBlocks);
  if (hit !== undefined) {
    createNewLink(hit);
  } else {
    createNewElement(x1, y1)
  };
};
