((d) => {

    class UIBlock {
        // _element;
        // _btnElement;
        // _content;
        // _flagElement;
        // _logic;
        // _x;
        // _y;

        constructor(logic, block) {
            this.revealBlock = this.revealBlock.bind(this);
            this.checkFlags = this.checkFlags.bind(this);

            this._logic = logic;
            this._x = block.x;
            this._y = block.y;
            this._content = block.val;

            this._element = d.createElement('span');
            this._element.className = 'ground-block';

            this._btnElement = d.createElement('button');
            this._btnElement.innerHTML = '&nbsp;';
            this._btnElement.className = 'block-btn';
            this._btnElement.addEventListener('contextmenu', this.checkFlags, true);
            this._btnElement.addEventListener('click', this.revealBlock, true);
            this._element.appendChild(this._btnElement);
        }

        revealBlock(event) {
            this._logic.reveal(this._x, this._y);
        }

        checkFlags(event) {
            event.preventDefault();
            this._logic.flag(this._x, this._y)
            return false;
        }

        addFlag(){
            this._btnElement.textContent = '🚩';
        }

        removeFlag(){
            this._btnElement.innerHTML = '&nbsp;';
            // this._flagElement.remove();
        }

        getElement(query) {
            if (query) {
                return this._element.querySelector(query);
            }
            return this._element
        }
    }


    class MineSweeper {
        // _rows;
        // _columns;
        // _groundLayout;
        // _logic;
        // _noOfMines;
        // _flagCount;
        
        // _uiLayout;

        constructor(rows, columns, noOfMines) {
            this.onEvent = this.onEvent.bind(this);
            this._firstTime = true;
            this._rows = rows;
            this._columns = columns;
            this._noOfMines = this._flagCount = noOfMines;
            this._logic = new MineSweeperLogic(rows, columns, noOfMines);
            this._logic.onEvent(this.onEvent);
            this.timerText = d.querySelector('#timer');
            this.flagsText = d.querySelector('#flags');
            this.startBtn = d.querySelector('#startNew');
            this.gameMsgs = d.querySelector('#game-messages');
        }

        onEvent(event, data) {
            let btnElement;
            let uiBlock;

            if (data && data.block) {
                uiBlock = this._uiLayout[data.block.x][data.block.y];
                btnElement = uiBlock.getElement('button');
            }
            switch (event) {
                case 'block_reveal':
                        if (!data.block.isflagged) {
                            btnElement.innerHTML = data.block.val;
                            btnElement.removeEventListener('click', uiBlock.revealBlock, true);
                            btnElement.removeEventListener('contextmenu', uiBlock.checkFlags, true);
                            btnElement.disabled = true;
                            btnElement.className += ' block-reveal-btn';

                            if (typeof data.block.val === 'number') {
                                // btnElement.style.fontWeight = '900';
                                switch (data.block.val) {
                                    case 1:
                                        btnElement.style.color = 'darkblue';
                                        break;
                                    case 2:
                                        btnElement.style.color = 'darkgreen';
                                        break;
                                    case 3:
                                        btnElement.style.color = 'red';
                                        break;
                                    case 4:
                                        btnElement.style.color = 'indigo';
                                        break;
                                    default:
                                        break;
                                }
                            }

                        }

                        break;
                case 'game_reset':
                    this.flagsText.textContent = data.flagCount;
                    this.timerText.textContent = data.timerCount;
                    break;
                case 'game_completed':
                case 'game_over':
                        if (btnElement) {
                            btnElement.className += ' game-over-btn';
                        }
                        d.querySelectorAll('.ground-block button').forEach(ele => {
                            ele.disabled = true;
                        });
                    break;
                case 'flag_updated':

                        if (data.isFlagged) {
                            uiBlock.addFlag();
                            btnElement.removeEventListener('click', uiBlock.revealBlock, true);
                            btnElement.className += ' flagged';
                        } else {
                            btnElement.className = 'block-btn';
                            uiBlock.removeFlag();
                            btnElement.addEventListener('click', uiBlock.revealBlock, true);
                        }

                        this.flagsText.textContent = data.flagCount;
                    break;
                case 'timer_start':
                case 'timer_count':
                    this.timerText.textContent = data.timerCount;
                    break;
                default:
                    break;
            }

            switch (event) {
                case 'game_reset':
                        this.startBtn.textContent = '😃'; this.gameMsgs.textContent = ''; break;
                case 'game_completed':
                        this.startBtn.textContent = '😎'; this.gameMsgs.textContent = 'Congratulations!! You have won!'; break;
                case 'game_over':
                        this.startBtn.textContent = '😣'; this.gameMsgs.textContent = 'Game Over! Click on smiley to play again.'; break;             
                default:
                    break;
            }
        }

        createDOMLayout(lm) {
            this._uiLayout = []
            for (let x = 0; x < lm.length; x++) {
                let arr = [];
                let rowTag = d.createElement('div');
                for (let y = 0; y < lm[x].length; y++) {
                    let temp = new UIBlock(this._logic, lm[x][y]);
                    rowTag.appendChild(temp.getElement());
                    arr.push(temp);
                }
                this._groundLayout.appendChild(rowTag);
                this._uiLayout.push(arr);
            }
        }

        start() {
            if (!this._firstTime) {
                this._groundLayout.remove();
                this._logic.resetGame();
            }
            //Create ground tiles
            d.querySelector('.outer-box').innerHTML = '<div class="inner-box" id="groundLayout"></div>';
            this._groundLayout = d.querySelector('#groundLayout');
            this.createDOMLayout(this._logic.getLayout());
            this.flagsText.textContent = this._flagCount;
            this._firstTime = false;
        }
    }

    function init() {
        function startNewGame() {
            mObj.start();
        }
        d.getElementById('startNew').addEventListener('click', startNewGame);
        startNewGame();
    }

    let mObj = new MineSweeper(13, 10, 15);
    init();

})(document)
