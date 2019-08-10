((d)=>{

    class MineFlag{
        _element = document.createElement('span');
        constructor(){
            this._element.style = 'display: table-caption; padding: 4px;';
            this._element.textContent = 'F';
        }
        getElement(){
            return this._element;
        }
    }

    class Block{
        _element;
        _content;
        _flagged = false;
        _flagElement;
        constructor(content){
            this.revealBlock = this.revealBlock.bind(this);
            this.toggleFlagBlock = this.toggleFlagBlock.bind(this);
            this._content = content;
            this._element = d.createElement('span');
            this._element.className = 'ground-block';
            let teps= d.createElement('button');
            // teps.style='position: relative;top: 25%;left:25%;';
            teps.style = 'width: 100%;height: 100%;';
            teps.addEventListener('contextmenu',this.toggleFlagBlock,false);
            teps.addEventListener('click',this.revealBlock,true);
            // teps.textContent = content;
            this._element.appendChild(teps);
        }

        revealBlock(event){
            event.target.textContent = this.content;
        }

        toggleFlagBlock(event){
            event.preventDefault();
            this._flagged = !this._flagged;
            if (this._flagged) {
                this._flagElement = (new MineFlag()).getElement();
                event.target.appendChild(this._flagElement);
                event.target.removeEventListener('click',this.revealBlock,true);
            } else {
                this._flagElement.remove();
                event.target.addEventListener('click',this.revealBlock,true);
            }  
            return false;
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

    let mObj = new MineSweeper(15,15,10);

})(document)