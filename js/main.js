function setup() {
  createCanvas(500, 500);
}

function draw() {
  background('#7CA5B8');
  noStroke();
  ellipseMode(CENTER);
  // SINK
  fill('#E3F5DF');
  rect(0, 0, 500, 50);
  rect(0, 450, 500, 50);
  rect(0, 0, 50, 500);
  rect(450, 0, 50, 500);
  //TAP
  fill('#787987');
  rect(235, 0, 30, 100);
  circle(220, 15, 45);
  circle(280, 15, 45);
  //ENTRANCE
  fill('#6B8AB1');
  rect(440, 200, 60, 100);
  rect(0, 200, 60, 100);
  rect(200, 440, 100, 60);
}

function keyPressed() {
    switch (keyCode) {
        case LEFT_ARROW:
            console.log("left");
            break;
        case RIGHT_ARROW:
            console.log("right");
            break;
        case UP_ARROW:
            console.log("up");
            break;
        case DOWN_ARROW:
            console.log("down");
            break;
        case 87:
            console.log("w");
            break;
        case 65:
            console.log("a");
            break;
        case 83:
            console.log("s");
            break;
        case 68:
            console.log("d");
            break;
    }
}