((d)=>{
    class BombShell{}
    class Flag{}
    class Block{
        _element;
        constructor(content){
            this._element = d.createElement('span');
            this._element.className = 'ground-block';
            let teps= d.createElement('span');
            teps.style='position: relative;top: 25%;left:25%;';
            teps.textContent = content;
            this._element.appendChild(teps); 
        }

        getElement(){
            return this._element
        }
    }
    class MineSweeper{
        _rows;
        _columns;
        _groundLayout = d.querySelector('#groundLayout');
        _layoutMatrix;
        _noOfMines;

        constructor(rows,columns,noOfMines){
            this._rows = rows;
            this._columns = columns;
            this._noOfMines = noOfMines;
            this._layoutMatrix = new MinesweeperGenerator(rows,columns,noOfMines);
            //Create ground tiles
            this.createDOMLayout(this._layoutMatrix.generate());
        }

        createDOMLayout(lm){
            for (let x = 0; x < lm.length; x++) {
                let rowTag = d.createElement('div');
                for (let y = 0; y < lm[x].length; y++) {
                    let temp = new Block(lm[x][y]);
                    rowTag.appendChild(temp.getElement());        
                }
                this._groundLayout.appendChild(rowTag);
            }
            
        }

    }

    let mObj = new MineSweeper(10,10,10);

})(document)