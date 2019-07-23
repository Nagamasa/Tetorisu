const FIELD_WIDTH = 300,                            // フィールド　幅                   
      FIELD_HEIGHT = 600,                           // フィールド　高さ
      COLS = 10,                                    // 列
      ROWS = 20,                                    // 行
      BLOCK_WIDTH = FIELD_WIDTH / COLS,             // 1ブロック　幅
      BLOCK_HEIGHT = FIELD_HEIGHT / ROWS,           // 1ブロック　高さ
      BLOCK_XLENGTH = 4,                            // ブロック構成　x長
      BLOCK_YLENGTH = 4;                            // ブロック構成　y長
      

let canvas = document.getElementById('game-field');
let ctx = canvas.getContext('2d');
let currentX = 3,                                   // ブロック初期位置　x
    currentY = 0;                                   // ブロック初期位置　y
let currentBlock;                                  // 現在のブロック情報
let field = [];                                     // ゲームフィールドの状態を保持

// フィールド初期情報生成
for (let y = 0; y < ROWS; y++) {
    field[y] = [];
    for (let x = 0; x < COLS; x++) {
        field[y][x] = 0;
    }
}

currentBlock = getTetorisBlock();
render();
setInterval(blockDown, 500);
// フィールド描画処理
function render() {
    // フィールド全体を消去
    ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
    ctx.strokeStyle = 'black';

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            drawBlock(x, y, field[y][x]);
        }
    }

    for (let y = 0; y < BLOCK_YLENGTH; y++) {
        for (let x = 0; x < BLOCK_XLENGTH; x++) {
            drawBlock(currentX + x, currentY + y, currentBlock[y][x]);
        }  
    }
}
// ブロックが下に移動するときの処理
function blockDown() {
    if (canMove(0, 1)) {
        currentY++;
    } else {
        fieldFix();
        clearRows();
        // ブロックが一番下にいったとき、新しいブロックを描画する
        currentBlock = getTetorisBlock();
        currentX = 3;
        currentY = 0;

        if (checkGameOver()) {

        }
    }    
    render();
}
// ブロック描画処理
function drawBlock(x, y, block) {
    if (block) {
        // 色の設定
        ctx.fillStyle = COLORS[block - 1];
        // 塗りつぶす
        ctx.fillRect(x * BLOCK_WIDTH, y * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
        ctx.strokeRect(x * BLOCK_WIDTH, y * BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT); 
    }
}
// ブロックが一番下のラインを超過したかチェックする
function checkLineOver(nextBlock, y, nextY, x, nextX) {
    if (nextBlock) {
        if (nextY + y >= ROWS) {
            return true;
        }
        // 左端を超えていたら
        if (nextX + x < 0) {
            return true;
        }
        // 右端を超えていたら
        if (nextX + x >= COLS) {
            return true;
        }

        if (field[nextY + y][nextX + x]) {
            return true;
        }
    }
    return false;
}
// ブロックが移動できるかどうか判定
function canMove(moveX, moveY, moveBlock) {
    let nextX = currentX + moveX;
    let nextY = currentY + moveY;
    let nextBlock = moveBlock || currentBlock;

    for (let y = 0; y < BLOCK_YLENGTH; y++) {
        for (let x = 0; x < BLOCK_XLENGTH; x++) {
            if (checkLineOver(nextBlock[y][x], y, nextY, x, nextX)) {
                return false;
            }
        }
    }
    return true;
}
// フィールド情報固定
function fieldFix() {
    for (let y = 0; y < BLOCK_YLENGTH; ++y) {
        for(let x = 0; x < BLOCK_XLENGTH; ++x) {
            if (currentBlock[y][x]) {
                field[currentY + y][currentX + x] = currentBlock[y][x];
            }
        }
    }
}
// そろった行を消す
function clearRows() {
    for (let y = ROWS - 1; y >= 0; y--) {
        let fill = true;
        
        for (let x = 0; x <= COLS; x++) {
            if (field[y][x] === 0) {
                fill = false;
                break;
            }
        }

        if (fill) {
            for (let i = y - 1; i >= 0; i--) {
                for (let x = 0; x < COLS; x++) {
                    field[i + 1][x] = field[i][x];
                }
            }
            y++;
        }
    }
}

// ゲームオーバーかどうかチェック
function checkGameOver() {
    let existBlock = [];

    for (let y = 0; y < BLOCK_YLENGTH; y++) {
        for (let x = 0; x < BLOCK_XLENGTH; x++) {
            if (currentBlock[y][x]) {
                existBlock[y] = 1;
                break;
            }
        }
    }
    
    if(existBlock[0] > 0 && existBlock[1] > 0) {
        if(field[1][3]) {
            window.location.href = './gameover.html';
        }
    }

    if(existBlock[0] > 0) {
        if(field[0][3]) {
            window.location.href = './gameover.html';
        }
    }
}
// キーボード操作処理
document.body.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            // left
            if (canMove(-1, 0, null)) {
                currentX--;
            }
            break;
        case 39:
            // right
            if (canMove(1, 0, null)) {
                currentX++;
            }
            break;
        case 40:
            // down
            if (canMove(0, 1, null)) {
                currentY++;
            }
            break;
        case 38:
            // rotate
            block = rotate(currentBlock);
            if (canMove(0, 0, block)) {
                currentBlock = block;
            }
            break;
    }
    render();
}