var dim;
var cellGrid = [];
var mines = [];

function initBoard(m, n) {
    cellGrid = [];
    mines = [];
    var grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (var i = 0; i < m; i++) {
        var row = document.createElement('div');
        row.setAttribute('id', 'row_'+i);
        row.setAttribute('class', 'grid-row');
        var cellGridRow = [];
        for (var j = 0; j < n; j++) {
            var cell = document.createElement('div');
            cell.setAttribute('id', 'cell_'+i+'_'+j);
            cell.setAttribute('class', 'grid-cell');
            var row_num = document.createAttribute('row');
            var col_num = document.createAttribute('column');
            row_num.value = i;
            col_num.value = j;
            cell.setAttributeNode(row_num);
            cell.setAttributeNode(col_num);
            cell.addEventListener('click', clickEventListener);
            var longpress = document.createAttribute('data-long-press-delay');
            longpress.value = 500;
            cell.setAttributeNode(longpress);
            cell.addEventListener('long-press', longPressEventListener);
            var mine = document.createAttribute('mine');
            mine.value = (Math.random() < 0.1);
            if (mine.value == 'true') {
                cell.classList.add('grid-cell-mine');
                mines.push(cell);
            }
            cell.setAttributeNode(mine);
            cell.classList.add('unselectable');
            row.appendChild(cell);
            cellGridRow.push(cell);
        }
        grid.appendChild(row);
        cellGrid.push(cellGridRow);
    }
    cells = document.getElementsByClassName('grid-cell');
    document.getElementById('reset-button-text').classList.remove('glow-red');
    document.getElementById('reset-button-text').classList.remove('glow-green');
    document.getElementById('mine-counter-text').innerHTML = mines.length + ' mines';
    dim = [m, n];
}

function clickEventListener(e) {
    if (e.altKey && !e.target.classList.contains('revealed')) {
        e.target.classList.toggle('flagged');
    } else {
        cellClick(e.target);
    }
    checkWin();
}

function longPressEventListener(e) {
    if (!e.target.classList.contains('revealed')) {
        e.target.classList.toggle('flagged');
        checkWin();
    }
}

function cellClick(cell) {
    if (cell.classList.contains('flagged')) {
        return;
    }
    if (cell.getAttribute('mine') == 'true') {
        lose();
        return;
    }
    cell.classList.add('revealed');
    var r = parseInt(cell.getAttribute('row'));
    var c = parseInt(cell.getAttribute('column'));
    var count = 0;
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var nr = r + i;
            var nc = c + j;
            if (nr < 0 || nc < 0 || nr >= dim[0] || nc >= dim[1]) {
                continue;
            }
            if (cellGrid[nr][nc].getAttribute('mine') == 'true') {
                count++;
            }
        }
    }
    if (count > 0) {
        cell.innerHTML = count;
        return;
    }
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var nr = r + i;
            var nc = c + j;
            if (nr < 0 || nc < 0 || nr >= dim[0] || nc >= dim[1]) {
                continue;
            }
            if (!cellGrid[nr][nc].classList.contains('revealed') &&
                !cellGrid[nr][nc].classList.contains('flagged')) {
                cellClick(cellGrid[nr][nc]);
            }
        }
    }
}

function checkWin() {
    for (var i = 0; i < dim[0]; i++) {
        for (var j = 0; j < dim[1]; j++) {
            cell = cellGrid[i][j];
            if ((cell.classList.contains('flagged') &&
                cell.getAttribute('mine') == 'false') ||
                (!cell.classList.contains('revealed') &&
                cell.getAttribute('mine') == 'false') ||
                (!cell.classList.contains('flagged') &&
                cell.getAttribute('mine') == 'true')) {
                return;
            }
        }
    }
    win();
}

function win() {
    makeAllUnclickable();
    for (var i = 0; i < mines.length; i++) {
        mines[i].innerHTML = '*';
    }
    document.getElementById('reset-button-text').classList.add('glow-green');
}

function lose() {
    makeAllUnclickable();
    for (var i = 0; i < mines.length; i++) {
        mines[i].classList.add('revealed');
        mines[i].innerHTML = '*';
    }
    document.getElementById('reset-button-text').classList.add('glow-red');
}

function makeAllUnclickable() {
    for (var i = 0; i < dim[0]; i++) {
        for (var j = 0; j < dim[1]; j++) {
            cellGrid[i][j].removeEventListener('click', clickEventListener);
            cellGrid[i][j].removeEventListener('long-press', longPressEventListener);
        }
    }
}
