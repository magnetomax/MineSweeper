'use strict';

class Block{
    // val;
    // isflagged;
    // isMine;
    // isRevealed;
    // x;
    // y;
    constructor(x,y,value) {
        this.x = x;
        this.y = y;
        this.val = value;
        this.isflagged = false;
        this.isMine = false;
        this.isRevealed = false;
    }

}

class MinesweeperGenerator {
    // rows;
    // columns; 
    // noOfMines; 
    // generatedArray;
    // _blankSpace;
    // _mine;

    constructor(mine,blankSpace) { 
        this._blankSpace = blankSpace;
        this._mine = mine;
     }

    generateAdjecent(x,y,rows,columns){
        let adjecentCells = [''+(x-1)+','+(y-1),
                                ''+(x-1)+','+(y),
                                ''+(x)+','+(y-1) ];

        if (x+1 < rows) {
            adjecentCells.push(''+(x+1)+','+(y));
            adjecentCells.push(''+(x+1)+','+(y-1));
        }
        if (y+1 < columns) {
            adjecentCells.push(''+(x-1)+','+(y+1));
            adjecentCells.push(''+(x)+','+(y+1));
        }
        if (x+1 < rows && y+1 < columns) {
            adjecentCells.push(''+(x+1)+','+(y+1));
        }

        return adjecentCells;
    }
    
    generate(r,c,n){
        this.rows = r || this.rows;
        this.columns = c || this.columns;
        this.noOfMines = n || this.noOfMines;

        let mines = {};
        this.generatedArray = [];
        for (let i = 0; i < this.rows; i++) {
            let arr = new Array(this.columns).fill(' ');
            arr.forEach((val,index,arra)=>{arra[index] = new Block(i,index,this._blankSpace)});
            this.generatedArray.push(arr);
        }

        for (let i = 0; i < this.noOfMines; i++) {
            let row;
            let col;

            do{
                row = Math.floor(Math.random()*this.rows);
                col = Math.floor(Math.random()*this.columns);
            } while (mines[''+row+','+col] === this._mine);

            mines[''+row+','+col] = this._mine;

            let adjecentCells = this.generateAdjecent(row,col,this.rows,this.columns);

            for (let j = 0; j < adjecentCells.length; j++) {
                let temp = mines[adjecentCells[j]];
                if (adjecentCells[j].indexOf('-')==-1 && temp !== this._mine) {
                    if (typeof temp === 'number') {
                        ++mines[adjecentCells[j]];
                    } else {
                        mines[adjecentCells[j]] = 1;
                    }
                }
            }
        }

        for (const key of Object.keys(mines)) {
            let num = key.split(',');
            let block = this.generatedArray[parseInt(num[0])][parseInt(num[1])];
            block.val = mines[key];
            if (block.val === this._mine) {
                block.isMine = true;
            }
        }

        return this.generatedArray;
    }
}
