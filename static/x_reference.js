class xReference {
    constructor(_coordinate, id=Date.now()) {
        this.id = id
        this.coordinate = _coordinate;  // array(x, y)
        
        this.childNodes = [],         // node
        this.points = [],
        this.konvaLine = null,
        this.meters = [],
        this.indexes = [],
        this.segmentedLines = [],
        this.segmented = [],
        this.xPosition = heightStage-blockSnapSize
    }

    myCoord(){
        console.log("my coords are: " + this.coordinate);
    }

    createKonvaLine(){
        this.konvaLine = new Konva.Line({
            points: [this.coordinate[0], this.coordinate[1], this.coordinate[0], 1000],
            stroke: 'black',
            strokeWidth: 4,
            name: "xReference",
            id: this.id
        });
        this.drawIndexes();
        //this.drawSegmentedLines();
        return this.konvaLine;
    }

    addNode(node){
        this.childNodes.push(node);
    }

    deleteNode(node){
        this.childNodes = this.childNodes.filter(child => child.id !== node.id);
    }

    addPoint(point){
        this.points.push(point);
        this.createSegmentedLine(point);
        this.updateSegmentedLines();
        this.buildLine();
        this.drawIndexes();

        point.on("dragend", () => {
        this.buildLine();
        this.drawIndexes();
        this.updateSegmentedLines();
        });
    }

    deletePoint(point){
        this.points = this.points.filter(point => point.id !== point.id);
    }

    showPoints(){
        console.log(this.points);
    }

    getPoints(){    
        return this.points;
        }

    getKonvaLine(){
        return this.konvaLine;}
    
    buildLine(){
        

        if (this.points.length > 1){
            let xList = [];
            for (let i = 0; i<this.points.length; i++){
                
                xList.push(this.points[i].getAttr("x"));
            }      

            const xRoundedMin = Math.round(Math.min(...xList)/blockSnapSize)*blockSnapSize;
            const xRoundedMax = Math.round(Math.max(...xList)/blockSnapSize)*blockSnapSize;

            this.konvaLine.setAttr("points",[xRoundedMin,this.xPosition,xRoundedMax,this.xPosition]);
            const xSorted = xList.sort(function(a, b){return a-b});
            this.drawMeters(xSorted);
            
        }
      }


      drawMeters(sortedList){
        const maxValue = Math.max(...sortedList);
        const offSet = 7;

        for (let i=0;i<this.meters.length;i++){
            this.meters[i].destroy();
        }


        for (var i=0;i<sortedList.length;i++){

            if(sortedList[i] != maxValue){
                
                const segmentsAverage = (sortedList[i]+ sortedList[i+1])/2;
                const meters = Math.round((sortedList[i+1]-sortedList[i])/40);  
    
                if (meters != 0){ // esto para que no aparezca un 0m cuando hay dos nodos en la misma linea
                
                const metersText = new Konva.Text({
                    x: segmentsAverage-offSet,
                    y: this.xPosition+10,
                    text: meters+"m",
                    fontSize: 15,
                    fontFamily: "Impact",
                    fill: "black"
                });
                this.meters.push(metersText);
                layer.add(metersText);
              }
            
            } //first if

        }//sec for
      }//function

      drawIndexes(){
        for (let i=0;i<this.indexes.length;i++){
            this.indexes[i].destroy();
        }

        for (let i=0;i<this.points.length;i++){
            const lineLenght = 10;
            const xRounded = Math.round(this.points[i].getAttr("x")/blockSnapSize)*blockSnapSize;
            const line = new Konva.Line({
                id: this.points[i].getAttr("id"),
                x: xRounded,
                y: this.xPosition-lineLenght,
                points:[0,0,0,2*lineLenght],
                stroke: 'black',
                strokeWidth: 6,
                tension: 0
              });
              
            this.indexes.push(line);
            layer.add(line);
        }

      }


    

      createSegmentedLine(point){

        const line = new Konva.Line({
            id: point.getAttr("id"),
            x: point.getAttr("x"),
            y: point.getAttr("y")+nodeRadius,
            points: [0,0,0,this.xPosition-point.getAttr("y")],
            stroke: 'black',
            strokeWidth: 2,
            dash: [10,4],
            visible: true
          });
          this.segmented.push(line);
          layer.add(line);

      }
      updateSegmentedLines(){
        
        for (let i=0;i<this.points.length;i++){
            for (let j=0;j<this.segmented.length;j++){
                if (this.points[i].getAttr("id") == this.segmented[j].getAttr("id")){


                    this.segmented[j].setAttr("x",Math.round(this.points[i].getAttr("x")/blockSnapSize)*blockSnapSize);
                    this.segmented[j].setAttr("y",Math.round( this.points[i].getAttr("y")/blockSnapSize)*blockSnapSize);


                    this.segmented[j].setAttr("points",[0,nodeRadius,0,this.xPosition-Math.round( this.points[i].getAttr("y")/blockSnapSize)*blockSnapSize]);
                    this.segmented[j].setAttr("visible",true);
                }
            }
        }
        //ver cual lineas mostrar
        for (let i=0;i<this.segmented.length;i++){
            for (let j=0;j<this.segmented.length;j++){
            
                if (this.segmented[i].getAttr("x") == this.segmented[j].getAttr("x") && this.segmented[j].getAttr("y") > this.segmented[i].getAttr("y")){
                    this.segmented[i].setAttr("visible",false);
                }
            }
        }



      }

      deletePoint(point){
        for (let i=0;i<this.segmented.length;i++){
            if (this.segmented[i].getAttr("id") == point.getAttr("id")){
                this.segmented[i].destroy();
                this.segmented.splice(i,1);
            }
        }
        
        for (let i=0;i<this.points.length;i++){
            if (this.points[i].getAttr("id") == point.getAttr("id")){
                this.points[i].destroy();
                this.points.splice(i,1);
            }
        }
        
        this.buildLine();
        this.updateSegmentedLines();
        this.drawIndexes();
      }








      hideAll(){
        for (let i=0;i<this.segmented.length;i++){
            this.segmented[i].setAttr("visible",false);
        }
        for (let i=0;i<this.indexes.length;i++){
            this.indexes[i].setAttr("visible",false);
        }
        for (let i=0;i<this.meters.length;i++){
            this.meters[i].setAttr("visible",false);
        }
        this.konvaLine.setAttr("visible",false);
      }
    
        showAll(){
            for (let i=0;i<this.segmented.length;i++){
                this.segmented[i].setAttr("visible",true);
            }
            for (let i=0;i<this.indexes.length;i++){
                this.indexes[i].setAttr("visible",true);
            }
            for (let i=0;i<this.meters.length;i++){
                this.meters[i].setAttr("visible",true);
            }
            this.konvaLine.setAttr("visible",true);
          }


}



