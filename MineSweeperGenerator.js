'use strict';

class MinesweeperGenerator {
    rows; columns; noOfMines; generatedArray;
    constructor(r,c,n) {
        this.rows = r;
        this.columns = c;
        this.noOfMines = n;
    }
    
    generate(){
        let mines = {};
        this.generatedArray = [];
        for (let i = 0; i < this.rows; i++) {
            this.generatedArray.push(new Array(this.columns).fill('|'));
        }
        for (let i = 0; i < this.noOfMines; i++) {
            let row;
            let col;

            do{
                row = Math.floor(Math.random()*this.rows);
                col = Math.floor(Math.random()*this.columns);
            } while (mines[''+row+','+col] === 'X');

            mines[''+row+','+col] = 'X';

            let adjecentCells = [''+(row-1)+','+(col-1),
                                ''+(row-1)+','+(col),
                                ''+(row)+','+(col-1) ];

            if (row+1 < this.rows) {
                adjecentCells.push(''+(row+1)+','+(col));
                adjecentCells.push(''+(row+1)+','+(col-1));
            }
            if (col+1 < this.columns) {
                adjecentCells.push(''+(row-1)+','+(col+1));
                adjecentCells.push(''+(row)+','+(col+1));
            }
            if (row+1 < this.rows && col+1 < this.columns) {
                adjecentCells.push(''+(row+1)+','+(col+1));
            }

            for (let j = 0; j < adjecentCells.length; j++) {
                let temp = mines[adjecentCells[j]];
                if (adjecentCells[j].indexOf('-')==-1 && temp !== 'X') {
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
            this.generatedArray[parseInt(num[0])][parseInt(num[1])] = mines[key];
        }

        return this.generatedArray;
    }
}
