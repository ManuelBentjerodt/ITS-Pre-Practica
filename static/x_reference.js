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
        this.segmented = []
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
        
        point.on("dragmove", () => {
        this.buildLine();
        this.drawIndexes();
        //this.drawSegmentedLines();
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
            this.konvaLine.setAttr("points",[Math.min(...xList),heightStage-5*blockSnapSize,Math.max(...xList),heightStage-5*blockSnapSize]);
            const xSorted = xList.sort(function(a, b){return a-b});
            this.drawMeters(xSorted);
            
        }
      }


      drawMeters(sortedList){
        maxValue = Math.max(...sortedList);
        offSet = 8;

        for (let i=0;i<this.meters.length;i++){
            this.meters[i].destroy();
        }


        for (var i=0;i<sortedList.length;i++){

            if(sortedList[i] != maxValue){
                
                segmentsAverage = (sortedList[i]+ sortedList[i+1])/2
                meters = (sortedList[i+1]-sortedList[i])/40  
    
                if (meters != 0){ // esto para que no aparezca un 0m cuando hay dos nodos en la misma linea
                
                const metersText = new Konva.Text({
                    x: segmentsAverage-offSet,
                    y: heightStage-4*blockSnapSize+10,
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
            lineLenght = 10;
            const line = new Konva.Line({
                id: this.points[i].getAttr("id"),
                x: 0,
                y: 0,
                points:[this.points[i].getAttr("x"),heightStage-5*blockSnapSize+lineLenght,this.points[i].getAttr("x"),heightStage-5*blockSnapSize-lineLenght],
                stroke: 'black',
                strokeWidth: 6,
                tension: 0
              });
              
            this.indexes.push(line);
            layer.add(line);
        }

      }


      drawSegmentedLines(){

        for (let i=0;i<this.segmentedLines.length;i++){
            this.segmentedLines[i].destroy();
        }

        for (let i=0;i<this.points.length;i++){
         
            
            const line = new Konva.Line({
                id: this.points[i].getAttr("id"),
                x: 0,
                y: 0,
                points: [this.points[i].getAttr("x"),this.points[i].getAttr("y"),this.points[i].getAttr("x"),heightStage-5*blockSnapSize],
                stroke: 'black',
                strokeWidth: 3,
                dash: [10,4]
              });
              this.segmentedLines.push(line);
              layer.add(line);

        }//sec for
      }

    //   setAttr("points",[0,0,0,distanceToX]);


      createSegmentedLine(point){
        console.log("id: "+point.getAttr("id"));
        const line = new Konva.Line({
            id: point.getAttr("id"),
            x: point.getAttr("x"),
            y: point.getAttr("y"),
            points: [0,0,0,heightStage-5*blockSnapSize-point.getAttr("y")],
            stroke: 'black',
            strokeWidth: 3,
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
                    this.segmented[j].setAttr("x",this.points[i].getAttr("x"));
                    this.segmented[j].setAttr("y",this.points[i].getAttr("y"));
                    this.segmented[j].setAttr("points",[0,0,0,heightStage-5*blockSnapSize-this.points[i].getAttr("y")]);
                    this.segmented[j].setAttr("visible",true);
                }
            }
        }
        //ver cual lineas mostrar
        for (let i=0;i<this.segmented.length;i++){
            for (let j=0;j<this.segmented.length;j++){
                console.log("segmented uno: ",this.segmented[i].getAttr("x"));
                console.log("segmented dos: ",this.segmented[j].getAttr("y"));
                console.log("\n");
                if (this.segmented[i].getAttr("x") == this.segmented[j].getAttr("x") && this.segmented[j].getAttr("y") > this.segmented[i].getAttr("y")){
                    this.segmented[i].setAttr("visible",false);
                }
            }
        }



      }




    
}



