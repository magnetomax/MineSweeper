((d) => {

    class MineContent {
        _element = document.createElement('span');
        constructor(content) {
            this._element.style = 'display: table-caption; padding: 4px;';
            this._element.textContent = content;
        }
        getElement() {
            return this._element;
        }
    }

    class Block {
        _element;
        _content;
        _flagged = false;
        _flagElement;
        _layoutMatrix;
        _x;
        _y;
        _blockEvent;
        constructor(layoutMatrix, x, y) {
            this._layoutMatrix = layoutMatrix;
            this._x = x;
            this._y = y;
            this._content = layoutMatrix[x][y];

            this.revealBlock = this.revealBlock.bind(this);
            this.checkFlags = this.checkFlags.bind(this);

            this._element = d.createElement('span');
            this._element.className = 'ground-block';

            let teps = d.createElement('button');
            teps.style = 'width: 100%;height: 100%;';
            teps.addEventListener('contextmenu', this.checkFlags, true);
            teps.addEventListener('click', this.revealBlock, true);

            this._element.appendChild(teps);
        }

        revealBlock(event) {
            event.target.appendChild((new MineContent(this._content)).getElement());
            event.target.removeEventListener('click', this.revealBlock, true);
            event.target.removeEventListener('contextmenu', this.checkFlags, true);
            event.target.disabled = true;
            switch (this._content) {
                case 'X':
                    event.target.style = `
                        width: 100%;
                        color: white;
                        height: 100%;
                        background-color: firebrick;
                        border-style: solid;
                        border-color: firebrick;`;
                    this._blockEvent && this._blockEvent('game_over');
                    break;
                case '|':
                    //Search for adjecent blocks till it gets covered and reveal all of them
                    let x = this._x;
                    let y = this._y;
                    let adjecentBlocks = [
                        [x + 1, y + 1],
                        [x - 1, y - 1],
                        [x + 1, y],
                        [x - 1, y],
                        [x, y + 1],
                        [x, y - 1],
                        [x + 1, y - 1],
                        [x - 1, y + 1]
                    ];
                    for (const cord of adjecentBlocks) {
                        let temp = this._layoutMatrix[cord[0]] && this._layoutMatrix[cord[0]][cord[1]];
                        if (temp) {
                            setTimeout(() => {
                                temp.getElement().firstChild.click();
                            }, 10);
                        }
                    }
                    default:
                        event.target.style = `
                        width: 100%;
                        color: white;
                        height: 100%;
                        background-color: darkgray;
                        border-style: solid;
                        border-color: darkgray;`;
                        break;
            }

        }

        onEvent(fnc) {
            this._blockEvent = fnc;
        }

        checkFlags(event) {
            event.preventDefault();
            let shouldContinue = this._blockEvent('flag_triggered', this._flagged);
            if (shouldContinue) {
                this.toggleFlagBlock(event);
            }
            return false;
        }

        toggleFlagBlock(event) {
            let btnElement = event.target;
            if (event.target.tagName !== 'BUTTON') btnElement = event.target.parentElement;
            this._flagged = !this._flagged;
            if (this._flagged) {
                this._flagElement = (new MineContent('F')).getElement();
                btnElement.appendChild(this._flagElement);
                btnElement.removeEventListener('click', this.revealBlock, true);
                btnElement.className = 'flagged';
            } else {
                btnElement.className = '';
                this._flagElement.remove();
                btnElement.addEventListener('click', this.revealBlock, true);
            }
        }

        getElement() {
            return this._element
        }
    }
    class MineSweeper {
        _rows;
        _columns;
        _groundLayout = d.querySelector('#groundLayout');
        _layoutMatrix;
        _noOfMines;
        _flagCount;

        constructor(rows, columns, noOfMines) {
            this._rows = rows;
            this._columns = columns;
            this._noOfMines = this._flagCount = noOfMines;
            this._layoutMatrix = new MinesweeperGenerator(rows, columns, noOfMines);
            //Create ground tiles
            this.createDOMLayout(this._layoutMatrix.generate());
        }

        createGame() {

        }

        createDOMLayout(lm) {
            for (let x = 0; x < lm.length; x++) {
                let rowTag = d.createElement('div');
                for (let y = 0; y < lm[x].length; y++) {
                    let temp = new Block(lm, x, y);
                    temp.onEvent((event, flagged) => {
                        switch (event) {
                            case 'game_over':
                                d.querySelectorAll('.ground-block button').forEach(ele=>{ele.disabled=true;});
                            break;
                            case 'flag_triggered':
                                if (!flagged) {
                                    if (this._flagCount <= 0) return false;
                                    --this._flagCount;
                                } else {
                                    ++this._flagCount;
                                }
                                d.querySelector('#flags').textContent = this._flagCount;
                                return true;

                            default:
                                break;
                        }
                    });
                    lm[x][y] = temp;
                    rowTag.appendChild(temp.getElement());
                }
                this._groundLayout.appendChild(rowTag);
            }

        }

    }

    function init() {
        let timerInterval;

        function startNewGame(event) {
            if (mObj) {
                clearAll();
            }
            d.querySelector('.outer-box').innerHTML = '<div class="inner-box" id="groundLayout"></div>';
            mObj = new MineSweeper(15, 15, 5, '.outer-box');
            d.querySelector('#flags').textContent = mObj._noOfMines;
            resetTimer();
        }

        function resetTimer() {
            let timerElement = d.querySelector('#timer');
            let count = 0;
            timerInterval = setInterval(() => {
                timerElement.textContent = ++count;
            }, 1000);
        }

        function clearAll() {
            clearInterval(timerInterval);
            d.getElementById('groundLayout').remove();
            delete mObj;
        }

        d.getElementById('startNew').addEventListener('click', startNewGame);
    }

    let mObj;
    init();

})(document)