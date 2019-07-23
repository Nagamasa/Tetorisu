let BLOCK = [
    [
        [1, 1, 1, 1],
        [0, 0, 0, 0]    // I型
    ],
    [
        [0, 1, 1, 0],
        [0, 1, 1, 0]    // O型
    ],
    [
        [0, 1, 1, 0],
        [1, 1, 0, 0]    // S型
    ],
    [
        [1, 1, 0, 0],
        [0, 1, 1, 0]    // Z型
    ],
    [
        [1, 0, 0, 0],
        [1, 1, 1, 0]    // J型
    ],
    [
        [0, 1, 1, 0],
        [1, 1, 1, 0]    // L型
    ],
    [
        [0, 1, 0, 0],
        [1, 1, 1, 0]    // T型
    ]
]

const COLORS = ['cyan', 'yellow', 'green', 'red', 'blue', 'orange', 'magenta'];

function getTetorisBlock() {
    let num = Math.floor(Math.random() * BLOCK.length);
    let block = [];

    for (let y = 0; y < BLOCK_YLENGTH; y++) {
        block[y] = [];
        for (let x = 0; x < BLOCK_XLENGTH; x++) {
            block[y][x] = 0;
            (isExistBlock(num, x, y)) ? block[y][x] = num + 1 : null;
        }
    }
    return block;
}

// ブロック回転処理
function rotate(block) {
    let rorate = [];

    for (let y = 0; y < BLOCK_YLENGTH; y++) {
        rorate[y] = [];
        for (let x = 0; x <BLOCK_XLENGTH; x++) {
            // 90度回転
            rorate[y][x] = block[x][-y + 3];
        }
    }
    return rorate;
}

function isExistBlock(num, x, y) {
    if (BLOCK[num][y]) {
        if (BLOCK[num][y][x]) {
            return true;
        }
    }
    return false;
}