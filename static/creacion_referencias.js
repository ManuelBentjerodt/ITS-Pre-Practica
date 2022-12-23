




x_reference = new xReference([0,heightStage-5*blockSnapSize]);
y_reference = new yReference([widthStage-5*blockSnapSize,0]);


points = [[200,100],[200,200],[300,250],[500,70]]; //x,y


for (let i = 0; i <points.length; i++){
    konvaCircle = new Konva.Circle({
        id:Math.random(),
        x: points[i][0],
        y:points[i][1],
        radius: 10,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true,
        
    }
    );
    
    x_reference.addPoint(konvaCircle);
    y_reference.addPoint(konvaCircle);
    layer.add(konvaCircle);
}

x_reference.createKonvaLine();
y_reference.createKonvaLine();

x_reference.buildLine();
y_reference.buildLine();

layer.add(x_reference.getKonvaLine());
layer.add(y_reference.getKonvaLine());