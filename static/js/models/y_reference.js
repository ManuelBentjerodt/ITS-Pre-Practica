class yReference {
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
        this.yPosition = widthStage-blockSnapSize,
        this.visible = false,
        this.unitMeasure = "m",
        this.unitSize = 40
    }

    myCoord(){
        console.log("my coords are: " + this.coordinate);
    }

    createKonvaLine(){
        this.konvaLine = new Konva.Line({
            points: [this.coordinate[0], this.coordinate[1], this.coordinate[0], 500],
            stroke: 'black',
            strokeWidth: 4,
            name: "yReference",
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
        
    roundList(list){
        for (let i=0;i<list.length;i++){
            list[i] = Math.round(list[i]/blockSnapSize)*blockSnapSize;
        }
        return list;
    }

    buildLine(){
        

        if (this.points.length > 1){
            let yList = [];
            for (let i = 0; i<this.points.length; i++){
                
                yList.push(this.points[i].getAttr("y"));
            }      

            const yRoundedMin = Math.round(Math.min(...yList)/blockSnapSize)*blockSnapSize;
            const yRoundedMax = Math.round(Math.max(...yList)/blockSnapSize)*blockSnapSize;

            this.konvaLine.setAttr("points",[this.yPosition, yRoundedMin,this.yPosition,yRoundedMax]);
            const ySorted = yList.sort(function(a, b){return a-b});
            this.drawMeters(this.roundList(ySorted));
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
                const segmentsAverage = (sortedList[i]+ sortedList[i+1])/2
                const meters = Math.round((sortedList[i+1]-sortedList[i])/this.unitSize)  
    
                if (meters != 0){ // esto para que no aparezca un 0m cuando hay dos nodos en la misma linea
                const metersText = new Konva.Text({
                    x: this.yPosition+10,
                    y: segmentsAverage-offSet,
                    text: meters+this.unitMeasure,
                    fontSize: 15,
                    fontFamily: "Impact",
                    fill: "black"
                });
                this.meters.push(metersText);
                layer.add(metersText);
             }
            }
        }
        if (!this.visible){
            for (let i=0;i<this.meters.length;i++){
                this.meters[i].setAttr("visible",false);
            }
        }
      }

      drawIndexes(){
        for (let i=0;i<this.indexes.length;i++){
            this.indexes[i].destroy();
        }

        for (let i=0;i<this.points.length;i++){
            const lineLenght = 10;
            const yRounded = Math.round(this.points[i].getAttr("y")/blockSnapSize)*blockSnapSize;

            const line = new Konva.Line({
                x: this.yPosition-lineLenght,
                y: yRounded,
                points:[0, 0,2*lineLenght,0],
                stroke: 'black',
                strokeWidth: 6,
                tension: 0
              });

            this.indexes.push(line);
            layer.add(line);
        }

        if (!this.visible){
            for (let i=0;i<this.indexes.length;i++){
                this.indexes[i].setAttr("visible",false);
            }
        }
      }



      updateSegmentedLines(){
        
        for (let i=0;i<this.points.length;i++){
            for (let j=0;j<this.segmented.length;j++){
                if (this.points[i].getAttr("id") == this.segmented[j].getAttr("id")){

                    this.segmented[j].setAttr("x",Math.round(this.points[i].getAttr("x")/blockSnapSize)*blockSnapSize);
                    this.segmented[j].setAttr("y",Math.round(this.points[i].getAttr("y")/blockSnapSize)*blockSnapSize);


                    this.segmented[j].setAttr("points",[nodeRadius,0,this.yPosition-Math.round(this.points[i].getAttr("x")/blockSnapSize)*blockSnapSize,0]);
                    this.segmented[j].setAttr("visible",true);
                }
            }
        }
        //ver cual lineas mostrar
        for (let i=0;i<this.segmented.length;i++){
            for (let j=0;j<this.segmented.length;j++){
                if (this.segmented[i].getAttr("y") == this.segmented[j].getAttr("y") && this.segmented[j].getAttr("x") > this.segmented[i].getAttr("x")){
                    this.segmented[i].setAttr("visible",false);
                }
            }
        }


        if (!this.visible){
            for (let i=0;i<this.segmented.length;i++){
                this.segmented[i].setAttr("visible",false);
            }
        }
      }



      createSegmentedLine(point){
        const line = new Konva.Line({
            id: point.getAttr("id"),
            x: point.getAttr("x"),
            y: point.getAttr("y"),
            points: [0,0,this.yPosition-point.getAttr("y"),0],
            stroke: 'black',
            strokeWidth: 2,
            dash: [10,4],
            visible: true
          });
          this.segmented.push(line);
          layer.add(line);

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
        
        this.updateSegmentedLines();
        this.drawIndexes();
        this.buildLine();
        
    }
    
    hideAll(){
        this.visible = false;
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
        this.visible = true;
        for (let i=0;i<this.indexes.length;i++){
            this.indexes[i].setAttr("visible",true);
        }
        for (let i=0;i<this.meters.length;i++){
            this.meters[i].setAttr("visible",true);
        }
        this.konvaLine.setAttr("visible",true);
        this.buildLine();
        this.drawIndexes();
        this.updateSegmentedLines();
    }
    


    newUnitSize(unitSize){
        //aqui se incerta en metros. Si se quiere en cm hay que mandar 0.1
        if (unitSize < 1){
            console.log("unit size is smaller than 1");        
            unitSize = unitSize*100; // ahora esta en cm
            this.unitSize = 40/unitSize;
            this.unitMeasure = "cm";
            console.log(this.unitSize);
        }
        else{
            this.unitSize = 40/unitSize;
            this.unitMeasure = "m";
        }
    }



}





