"use strict";

// Block piece constants.
var blocks = [];
//////////////////////  S
const BLOCK_0 = {
  color: COL[0], size: 3, depth: 3, height: 3, width: 3,
  grid: [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ]
};
blocks.push(BLOCK_0);
////////////////////// I
const BLOCK_1 = {
  color: COL[1], size: 3, depth: 3, height: 3, width: 3,
  grid: [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ]
};
blocks.push(BLOCK_1);
////////////////////// I
const BLOCK_11 = {
  color: COL[7], size: 3, depth: 3, height: 3, width: 3,
  grid: [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ]
};
blocks.push(BLOCK_11);
////////////////////// J
const BLOCK_2 = {
  color: COL[2], size: 3, depth: 3, height: 3, width: 3,
  grid: [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ]
};
blocks.push(BLOCK_2);
////////////////////// T
const BLOCK_3 = {
  color: COL[3], size: 3, depth: 3, height: 3, width: 3,
  grid: [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ]
};
blocks.push(BLOCK_3);
//////////////////////  T
const BLOCK_4 = {
  color: COL[4], size: 3, depth: 3, height: 3, width: 3,
  grid: [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ]
};
blocks.push(BLOCK_4);
//////////////////////
const BLOCK_5 = {
  color: COL[5], size: 2, depth: 2, height: 2, width: 2,
  grid: [
    [
      [1, 0],
      [1, 1]
    ],
    [
      [0, 0],
      [1, 0]
    ]
  ]
};
blocks.push(BLOCK_5);
//////////////////////
const BLOCK_6 = {
  color: COL[6], size: 2, depth: 2, height: 2, width: 2,
  grid: [
    [
      [1, 0],
      [1, 1]
    ],
    [
      [1, 0],
      [0, 0]
    ]
  ]
};
blocks.push(BLOCK_6);
//////////////////////
const BLOCK_7 = {
  color: COL[7], size: 2, depth: 2, height: 2, width: 2,
  grid: [
    [
      [1, 0],
      [1, 1]
    ],
    [
      [0, 0],
      [0, 1]
    ]
  ]
};
blocks.push(BLOCK_7);
////////////////////// L
const BLOCK_8 = {
  color: COL[8], size: 2, depth: 2, height: 2, width: 2,
  grid: [
    [
      [1, 0],
      [1, 1]
    ],
    [
      [0, 0],
      [0, 0]
    ]
  ]
};
blocks.push(BLOCK_7);
////////////////////// ■
const BLOCK_9 = {
  color: COL[9], size: 2, depth: 2, height: 2, width: 2,
  grid: [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [0, 0],
      [0, 0]
    ]
  ]
};
blocks.push(BLOCK_9);
