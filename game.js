kaboom({
  fullscreen: true,
  clearColor: [0.2, 0.7, 1, 1], //rgba
  global: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("ground", "block.png");
loadSprite("spongebob", "spongebob.png");
loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("loop", "loop.png");
loadSprite("princes", "princes.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("pipe_up", "pipe_up.png");

loadSound("jump", "jumpSound.mp3");
loadSound("gamesound", "gameSound.mp3");

let score = 0;

scene("game", () => {
  play("gamesound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                                                                                        ",
    "                                                                                                                                                        ",
    "                                    g                                      g                                                                            ",
    "                                                                                                                                                        ",
    "                             g              g                       g               g                      g                                            ",
    "                                                                                                                                                        ",
    "                                                                                    r                                      r                            ",
    "                           =!!!=    $        ====                 =!!!=    $        ====                 =!!!=    $        ====                         ",
    "                                    u                                      u                                      u                                     ",
    "                                                $$$                                    $$$                                    $$$                       ",
    "                       $                        ===           $                       ===           $ e                      ===                        ",
    "                       ===b=                                  ===b=                                  ===b=                                              ",
    "                                                                                 r                                                                      ",
    "                                u                                                                                                                       ",
    "                                      =!b!=                                  =!b!=                                  =!b!=                               ",
    "                           $$ $$                                  $$ $$                                  $$ $$                                          ",
    "                           ==b==                                  ==b==                                  ==b==                                          ",
    "                                    $ $ $ $ $                              $ $ $ $ $                              $ $ $ $ $                             ",
    "                     $$$            =!=!=b=!=               $$$            =!=!=b=!=               $$$            =!=!=b=!=                             ",
    "                     ===                                    ===                                    ===                                                  ",
    "                ==                                     ==                                     ==                                                        ",
    "            =          e                                      e                          r                                                          P   ",
    "=================================================================================  ============================================ ======================= ",
  ];

  const mapsymbols = {
    width: 20,
    height: 20,

    "=": [sprite("ground"), solid()],
    $: [sprite("coin"), "coins"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    g: [sprite("surprise"), solid(), "loop-surprise"],
    b: [sprite("surprise"), solid(), "mushroom-surprise"],
    "!": [sprite("surprise"), solid(), "coin-surprise"],
    m: [sprite("mushroom"), solid(), "cool-mushroom", body()],
    l: [sprite("loop"), solid()],
    p: [sprite("pipe_up"), solid(), "pipe"],
    e: [sprite("evil_mushroom"), "evil_mushroom", body()],
    r: [sprite("evil_mushroom"), "evil_mushroom2", body()],
  };

  const gamelevel = addLevel(map, mapsymbols);

  const player = add([
    sprite("spongebob"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scorelabel = add([text("score: " + score)]);

  const moveSpeed = 200;

  keyDown("right", () => {
    player.move(moveSpeed, 0);
  });

  keyDown("left", () => {
    player.move(-moveSpeed, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(400);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("$", obj.gridPos.sub(0, 1));
    }

    if (obj.is("mushroom-surprise")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("m", obj.gridPos.sub(0, 1));
    }

    if (obj.is("loop-surprise")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("l", obj.gridPos.sub(0, 1));
    }

    if (obj.is("princes-surprise")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("p", obj.gridPos.sub(0, 1));
    }
  });
  action("cool-mushroom", (obj) => {
    obj.move(20, 0);
  });

  action("evil_mushroom", (obj) => {
    obj.move(50, 0);
  });

  action("evil_mushroom2", (obj) => {
    obj.move(-50, 0);
  });

  player.collides("coins", (obj) => {
    score += 5;
    destroy(obj);
  });

  player.collides("cool-mushroom", (obj) => {
    destroy(obj);
    //bigger player
    player.biggify(15);
  });

  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });

  const FALL_DOWN = 1024;

  player.action(() => {
    camPos(player.pos);
    scorelabel.pos = player.pos.sub(400, 200);
    scorelabel.text = "score: " + score;
    //DIE WHEN FALLING
    if (player.pos.y >= FALL_DOWN) {
      go("lose");
    }
  });

  let isjumping = false;

  player.collides("evil_mushroom", (obj) => {
    if (isjumping) {
      destroy(obj);
    } else {
      go("lose");
    }
  });

  player.collides("evil_mushroom2", (obj) => {
    if (isjumping) {
      destroy(obj);
    } else {
      go("lose");
    }
  });

  player.action(() => {
    isjumping = !player.grounded();
  });

  //scene end
});

scene("lose", () => {
  score = 0;
  add([
    text("Game Over \n try again", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  add([
    text(" Press Space To Restart", 20),
    origin("center"),
    pos(width() / 2, height() / 2 + 200),
  ]);

  keyDown("space", () => {
    go("game");
  });

  //scene lose end
});

scene("win", () => {
  add([
    text("you won ! \n great job", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

start("game");
