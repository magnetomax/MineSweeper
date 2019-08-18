class MineSweeperLogic{
    // _rows;
    // _columns;
    // _noOfMines;
    // _layoutMatrix;
    // _flagCount;
    // _timerCount;
    // _timerInterval;
    // _generator;
    // _status;
    // _handlers;
    // _spaceChar;
    // _mineChar;

    constructor(rows,columns,noOfMines) {
        this._spaceChar = '&nbsp;';
        this._mineChar = '💥';
        this._generator = new MinesweeperGenerator(this._mineChar,this._spaceChar);
        this._rows = rows;
        this._columns = columns;
        this._noOfMines = this._flagCount = noOfMines;
        this._timerCount = 0;
        this._layoutMatrix = this._generator.generate(rows, columns, noOfMines);
        this._status = 'created';
        this._handlers = [];
    }

    getLayout(){
        return this._layoutMatrix;
    }

    resetGame(rows,columns,noOfMines) {
        this._stopTimer();
        this._rows = rows || this._rows;
        this._columns = columns || this._columns;
        this._noOfMines = this._flagCount = noOfMines || this._noOfMines;
        this._timerCount = 0;
        this._layoutMatrix = this._generator.generate(rows, columns, noOfMines);
        this._status = 'created';
        this._triggerEvent('game_reset',{flagCount:this._flagCount,timerCount:this._timerCount});
    }

    _startTimer(){
        this._triggerEvent('timer_start',{timerCount:this._timerCount,flagCount:this._flagCount});
        this._timerInterval = setInterval(()=>{
            ++this._timerCount;
            this._triggerEvent('timer_count',{timerCount:this._timerCount});
        },1000);
    }

    _stopTimer(){
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._triggerEvent('timer_stop',{timerCount:this._timerCount});
        }
    }

    _triggerEvent(event,data){
        this._handlers.forEach(handle => {
            handle(event,data);
        });
    }

    onEvent(handler){
        this._handlers.push( handler );
    }

    _revealMines(){
        this._layoutMatrix.forEach( col => col.forEach( block => block.isMine && !block.isRevealed && this.reveal(block.x,block.y) ) );
    }

    reveal(x,y){
        let blck = this._layoutMatrix[x][y];
        if(this._status === 'created'){
            this._startTimer();
            this._status = 'running';
        }
        
        blck.isRevealed = true;
        this._triggerEvent('block_reveal',{block:blck});

        if (blck.isMine && this._status !== 'finished') {
            this._stopTimer();
            this._triggerEvent('game_over',{block:blck});
            this._status = 'finished';
            this._revealMines();
            return;
        }

        switch ( blck.val ) {
            case this._spaceChar:
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
                        if (temp && !temp.isRevealed) {
                            this.reveal(cord[0],cord[1]);
                        }
                    }
                break;
            default:
                break;
        }
    }

    _allFlagsPlacedCorrectly(){
        return this._layoutMatrix.every( col => col.filter( blk => blk.isMine ).every( block => block.isflagged ) );
    }

    flag(x,y){
        let temp = this._layoutMatrix[x][y];
        if (!temp.isflagged && this._flagCount) {
            temp.isflagged = true;
            --this._flagCount;
            this._triggerEvent('flag_updated',{isFlagged:temp.isflagged,flagCount:this._flagCount,block:temp});
            
            if (!this._flagCount && this._allFlagsPlacedCorrectly()) {
                this._triggerEvent('game_completed');
                this._stopTimer();
                this._status = 'finished';
            }

            return;
        }

        if(temp.isflagged){
            temp.isflagged = false;
            ++this._flagCount;
            this._triggerEvent('flag_updated',{isFlagged:temp.isflagged,flagCount:this._flagCount,block:temp});
            
            return;
        }
    }
    
}