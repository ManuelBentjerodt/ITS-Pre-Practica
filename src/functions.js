function createShadowViga(x0, y0, x1, y1, nameShadow="shadow-viga") {
    const group = new Konva.Group({name: nameShadow});
    const line = new Konva.Line({
        name: "subElementoViga",
        x: x0,
        y: y0,
        points: [0, 0, x1, y1],
        strokeWidth: 5,
        stroke: "#FF7B17",
        dash: [10, 4]
    });

    const circle1 = new Konva.Circle({
        name: "subElementoViga",
        x: x0,
        y: y0,
        radius: nodeRadius,
        fill: "#CF6412",
        draggable: true
    });

    const circle2 = circle1.clone({
        name: "subElementoViga",
        x: x0+(x1),
        y: y0+(y1)
    });

    group.add(line, circle1, circle2);
    layer.add(group);      

    return group
}


//------------------------------------------------------Viga-----------------------------------------------//

function newViga(x0, y0, x1, y1, nameViga="viga") { //parte en el punto (x0, y0) y se desplaza x1 horizontalmente ^ y1 verticalmente ( no va al punto (x1, y1))
    let colorCircle = "red";
    let dragg = true;
    if(nameViga == "initialViga") {
        colorCircle = "green";
        // dragg = false;
    }
    const idByDate = Date.now();
    const group = new Konva.Group({draggable: false, name: nameViga, id: idByDate});
    const line = new Konva.Line({
        name: "subElementoVigaLinea",
        x: x0,
        y: y0,
        points: [0, 0, x1, y1],
        strokeWidth: 5,
        stroke: "black",
        id: idByDate + 1
    });

    const circle1 = new Konva.Circle({
        name: "subElementoVigaCirculo1",
        x: x0,
        y: y0,
        radius: 5,
        fill: colorCircle,
        draggable: dragg,
        id: idByDate + 2
    });

    const circle2 = new Konva.Circle({
        name: "subElementoVigaCirculo2",
        x: x0 + x1,
        y: y0 + y1,
        radius: 5,
        fill: "red",
        draggable: true,
        id: idByDate + 3
    });

    group.add(line, circle1, circle2);

    paintIfMouseOver(line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"));
    paintIfMouseOver(circle1, "#00FF00", nstrokec, circle1.getAttr("fill"), circle1.getAttr("stroke"));
    paintIfMouseOver(circle2, nfillc, nstrokec, circle2.getAttr("fill"), circle2.getAttr("stroke"));
    
    return group;
}

function createViga(nameViga="viga") {
    let x0 = lastVigaNodeClick.x
    let y0 = lastVigaNodeClick.y
    const x1 = blockSnapSize * 3;
    const y1 = 0;

    let nameShadow = "shadow-viga";
    if (nameViga == "initialViga") {
        x0 = blockSnapSize * 8;
        y0 = blockSnapSize * 8;
        nameShadow = "shadow-initialViga"
    }

    const line = newViga(x0, y0, x1, y1, nameViga);
    // const shadowLine = createShadowViga(x0, y0, x1, y1, nameShadow);
    // shadowLine.hide();

    layer.add(line);
   
    const originNode = new Node([x0, y0], id=line.getChildren()[1].getAttr("id"))
    const secondNode = new Node([x0, y0], id=line.getChildren()[2].getAttr("id"))
    originNode.konvaObjects.circle = line.getChildren()[1];
    secondNode.konvaObjects.circle = line.getChildren()[2];
    secondNode.setKonvaViga(line)
    joinNodes(originNode, secondNode)

    
    // listenNodeMovement(line, shadowLine, "initialViga")
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    
    return [originNode, line];
}

function createViga2() {
    const konvaElement = lastNodeClick;
    const [x0, y0] = getElementPos(konvaElement);

    const idByDate = Date.now();

    const group = new Konva.Group({name: "viga2", id: idByDate});
    const line = new Konva.Line({
        name: "subElementoVigaLinea",
        x: x0,
        y: y0,
        points: [0, 0, 3*blockSnapSize, 0],
        strokeWidth: 5,
        stroke: "black",
        id: idByDate + 1
    });

    const circle = new Konva.Circle({
        name: "subElementoVigaCirculo",
        x: x0+3*blockSnapSize, // se crea al final de la viga
        y: y0,
        radius: 7,
        fill: "red",
        draggable: true,
        id: idByDate + 2
    });
 
    group.add(line, circle)
   
    paintIfMouseOver(line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"));
    paintIfMouseOver(circle, nfillc, nstrokec, circle.getAttr("fill"), circle.getAttr("stroke"));
    // paintIfMouseOver(line)

    const shadowLine = createShadowViga(x0, y0, 3*blockSnapSize, 0, "shadowViga2");
    shadowLine.hide()

    layer.add(group, shadowLine)

    const node = new Node([x0, y0], id=circle.getAttr("id"));
    const nodeParent = dcl.findNodeById(konvaElement.getAttr("id"))
    node.setKonvaViga(group)
    node.konvaObjects.shadowViga = shadowLine
    // nodeParent.konvaObjects.shadowViga = shadowLine
    node.konvaObjects.circle = circle;
    joinNodes(nodeParent, node)

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    
    listenNodeMovement(group, shadowLine, "viga2")
    moveVigasToTop();

    return group;
}

function moveElementsAttached(element, newPosition){
    if (element.konvaObjects.vinculo){
        element.konvaObjects.vinculo.position(newPosition);
    }
    if (element.konvaObjects.fuerzas.length){
        element.konvaObjects.fuerzas.forEach(fuerza => {
            fuerza.position(newPosition);
        })   
    }
    if (element.konvaObjects.momentos.length){
        element.konvaObjects.momentos.forEach(momento => {
            momento.position(newPosition);
        })   
    }
}
function listenNodeMovement(konvaViga, shadow, typeOfViga){
    let shadowList;
    let vigaLine;
    let vigaCircle;
    let otherCircle;

    if (typeOfViga === "viga2"){
        shadowList = shadow.getChildren();
        vigaLine = konvaViga.getChildren()[0];
        vigaCircle = konvaViga.getChildren()[1];
        otherCircle = dcl.findNodeById(vigaCircle.getAttr("id")).parent.konvaObjects.circle;

    } else {
        shadowList = shadow.getChildren();
        vigaLine = konvaViga.getChildren()[0];
        vigaCircle = konvaViga.getChildren()[2];
        otherCircle = konvaViga.getChildren()[1];
    }


    const nodeVigaCircle = dcl.findNodeById(vigaCircle.getAttr("id"));
    const nodeOtherCircle = dcl.findNodeById(otherCircle.getAttr("id"));

    otherCircle.on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
    });

    otherCircle.on("dragmove", () => {
        const circle1Pos = otherCircle.getPosition();
        const circle2Pos = vigaCircle.getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        vigaLine.position(circle1Pos);
        vigaLine.points([0, 0, circle2Pos.x - circle1Pos.x, circle2Pos.y - circle1Pos.y]);

        otherCircle.position({x: circle1Pos.x, y: circle1Pos.y});
        shadowList[1].position({
            x: Math.round(circle1Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle1Pos.y / blockSnapSize) * blockSnapSize
        });

        shadowList[0].position(circle2Pos);
        shadowList[0].points([0, 0, shadowCircle1Pos.x - circle2Pos.x, shadowCircle1Pos.y - circle2Pos.y]);
       
        moveElementsAttached(nodeOtherCircle, otherCircle.position());
    })

    otherCircle.on("dragend", () => {
        const circle2Pos = vigaCircle.getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        const newX = circle2Pos.x - shadowCircle1Pos.x;
        const newY = circle2Pos.y - shadowCircle1Pos.y;

        vigaLine.position(shadowCircle1Pos);
        vigaLine.points([0, 0, newX, newY]);
        otherCircle.position({
            x: shadowCircle1Pos.x,
            y: shadowCircle1Pos.y
        });

        const newNodePos = [shadowCircle1Pos.x, shadowCircle1Pos.y];
        dcl.findNodeById(otherCircle.getAttr("id")).setCoordinate(newNodePos);
        shadowList[0].position(vigaLine.position());
        shadow.hide();

        moveElementsAttached(nodeOtherCircle, otherCircle.position());
        
    });

    vigaCircle.on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
        
    });

    vigaCircle.on("dragmove", () => {
        const linePos = vigaLine.getPosition();
        const circle2Pos = vigaCircle.getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        vigaLine.points([0, 0, circle2Pos.x - linePos.x, circle2Pos.y - linePos.y])
        shadowList[0].points([0, 0, newX, newY])

        vigaCircle.position({x: circle2Pos.x, y: circle2Pos.y})
        shadowList[2].position({
            x: Math.round(circle2Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle2Pos.y / blockSnapSize) * blockSnapSize
        });

        moveElementsAttached(nodeVigaCircle, vigaCircle.position());
    });

    vigaCircle.on("dragend", () => {
        const linePos = vigaLine.getPosition();
        const circle2Pos = vigaCircle.getPosition();
        const shadowCircle2Pos = shadowList[2].getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        vigaLine.points([0, 0, newX, newY])
        vigaCircle.position({
            x: shadowCircle2Pos.x,
            y: shadowCircle2Pos.y
        });

        const newNodePos = [shadowCircle2Pos.x, shadowCircle2Pos.y];
        dcl.findNodeById(vigaCircle.getAttr("id")).setCoordinate(newNodePos);
        shadow.hide();

        moveElementsAttached(nodeVigaCircle, vigaCircle.position());
       
    });
}






//------------------------------------------------------Vinculos externos-----------------------------------------------//
function createEmpotrado(shadow=false) {
    let colorStroke;
    if (shadow){
        colorStroke = shadowStroke;
    }
    colorStroke = "black"

    const konvaElement = lastNodeClick;
    const idKonvaElement = konvaElement.getAttr("id")
    const nodeParent = dcl.findNodeById(idKonvaElement);

    const x0 = lastVigaNodeClick.x;
    const y0 = lastVigaNodeClick.y;
    const large = blockSnapSize;

    const group = new Konva.Group({id: idKonvaElement, name: "empotrado", x: x0, y: y0});
    const base = new Konva.Line({
        name: "subElemento Empotrado",
        x: 0,
        y: 0,
        points: [-large/2, 0, large/2, 0],
        strokeWidth: 5,
        stroke: colorStroke
    });

    const l1 = new Konva.Line({name: "subElemento Empotrado", x: -large/2, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke});
    const l2 = new Konva.Line({name: "subElemento Empotrado",x: -large/2 + 12.5, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke});
    const l3 = new Konva.Line({name: "subElemento Empotrado",x: -large/2 + 25, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke});
    //const l4 = new Konva.Line({name: "subElemento Empotrado",x: -large/2 +37.5, y: 0, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke});
    
    group.add(base, l1, l2, l3);

    paintIfMouseOver(base, nfillc, nstrokec, base.getAttr("fill"), base.getAttr("stroke"), paintGroup=true);
    paintIfMouseOver(l1, nfillc, nstrokec, l1.getAttr("fill"), l1.getAttr("stroke"), paintGroup=true);
    paintIfMouseOver(l2, nfillc, nstrokec, l2.getAttr("fill"), l2.getAttr("stroke"), paintGroup=true);
    paintIfMouseOver(l3, nfillc, nstrokec, l3.getAttr("fill"), l3.getAttr("stroke"), paintGroup=true);

    if(nodeParent.vinculo === null) {
        nodeParent.setVinculo("empotrado");
        nodeParent.setKonvaVinculo(group)
   
    } else {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        return;
    }

    layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group;    
}


function createApoyoDeslizante() {
    countApoyoDeslizante += 1;
    
    const konvaElement = lastNodeClick;
    const idKonvaElement = konvaElement.getAttr("id")
    const nodeParent = dcl.findNodeById(idKonvaElement);

    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y
    const large = 20; //blockSnapSize / 2;

    const group = new Konva.Group({id: idKonvaElement, name: "apoyoDeslizante", x: x0, y: y0});
    const triangle = new Konva.RegularPolygon({    
        name: "subElemento ApoyoDeslizante",
        x: 0,
        y: 0 + large,
        sides: 3,
        radius: large,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4,
    });

    const base = new Konva.Line({
        name: "subElemento ApoyoDeslizante",
        x: 0,
        y: 0 + 2*large ,
        points: [-large, 0, large, 0],
        strokeWidth: 5,
        stroke: "black",
    });

    group.add(triangle, base);

    paintIfMouseOver(triangle, nfillc, nstrokec, triangle.getAttr("fill"), triangle.getAttr("stroke"), paintGroup=true);
    paintIfMouseOver(base, nfillc, nstrokec, triangle.getAttr("fill"), base.getAttr("stroke"), paintGroup=true);

    
    if(nodeParent.vinculo === null) {
        nodeParent.setVinculo("apoyoDeslizante");
        nodeParent.setKonvaVinculo(group)
    } else {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        return;
    }
    
    layer.add(group);
    
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group;
}


function createApoyoNoDeslizante() {
    countpoyoNoDeslizante += 1;
    
    const konvaElement = lastNodeClick;
    const idKonvaElement = konvaElement.getAttr("id")
    const nodeParent = dcl.findNodeById(idKonvaElement);

    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y
    const large = 20; //blockSnapSize / 2;

    const group = new Konva.Group({id: idKonvaElement, name: "apoyoNoDeslizante", x: x0, y: y0});
    const triangle = new Konva.RegularPolygon({
        name: "subElemento ApoyoNoDeslizante",
        x: 0,
        y: 0 + large,
        sides: 3,
        radius: large,
        fill: "#00F210",
        stroke: "black",
        strokeWidth: 4,
    });

    group.add(triangle);

    paintIfMouseOver(triangle, nfillc, nstrokec, triangle.getAttr("fill"), triangle.getAttr("stroke"), paintGroup=false);

    if(nodeParent.vinculo === null) {
        nodeParent.setVinculo("apoyoNoDeslizante");
        nodeParent.setKonvaVinculo(group)
    } else {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        return;
    }

    layer.add(group);
    
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    
}


//------------------------------------------------------Vinculos internos-----------------------------------------------//
function createRotula() {
    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y

    const konvaElement = lastNodeClick;
    const idKonvaElement = konvaElement.getAttr("id")
    const nodeParent = dcl.findNodeById(idKonvaElement);

    const group = new Konva.Group({id: idKonvaElement, name: "rotula", x: x0, y: y0});
    const circle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 8,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        name: "subElement Rotula"
    });

    group.add(circle);

    paintIfMouseOver(circle, nfillc, nstrokec, circle.getAttr("fill"), circle.getAttr("stroke"), paintGroup=false);

    if(nodeParent.vinculo === null) {
        nodeParent.setVinculo("rotula");
        nodeParent.setKonvaVinculo(group)
    } else {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        return;
    }
    
    layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group;
}


function createBiela() {
    const x0 = lastVigaNodeClick.x
    const y0 = lastVigaNodeClick.y
    
    const konvaElement = lastNodeClick;
    const idKonvaElement = konvaElement.getAttr("id")
    const nodeParent = dcl.findNodeById(idKonvaElement);
    

    const group = new Konva.Group({id: idKonvaElement, name: "biela", x: x0, y: y0});
    const large = blockSnapSize;
    const line = new Konva.Line({
        name: "subElemento Biela",
        x: 0,
        y: 0,
        points: [0, 0, large, 0],
        strokeWidth: 5,
        stroke: "black"
    });
    const circle1 = new Konva.Circle({
        name: "subElemento Biela",
        x: 0,
        y: 0,
        radius: 7,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
    });
    const circle2 = circle1.clone({
        x: 0+large,
        y: 0
    });

    group.add(line, circle1, circle2);

    paintIfMouseOver(line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"), paintGroup=false);
    paintIfMouseOver(circle1, nfillc, nstrokec, circle1.getAttr("fill"), circle1.getAttr("stroke"), paintGroup=true);
    paintIfMouseOver(circle2, nfillc, nstrokec, circle2.getAttr("fill"), circle2.getAttr("stroke"), paintGroup=true);
    
    if(nodeParent.vinculo === null) {
        nodeParent.setVinculo("biela");
        nodeParent.setKonvaVinculo(group)

    } else {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        return;
    }
    
    layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    return group
}


//------------------------------------------------------Fuerzas y momentos-----------------------------------------------//
function createFuerza(valMagnitud, valAngle, color="black", x0=0, y0=0, layerForPaint=layer, aux="aux") {
    let x0lastPos = lastVigaNodeClick.x
    let y0lasPos = lastVigaNodeClick.y
    
    let magnitud = valMagnitud;
    let angle = valAngle;
    let txt = magnitud + " N" + ", " + angle + " °";

    const large = blockSnapSize * 2;
    const lx = large * Math.cos(angle * Math.PI / 180)
    const ly = large * Math.sin(angle * Math.PI / 180)

    if (color != "black") {
        x0lastPos = x0;
        y0lasPos = y0;
        txt = valMagnitud
    }
  
    const group = new Konva.Group({tension: [magnitud, angle], name: "fuerza", x: x0lastPos, y: y0lasPos});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: [lx, -ly, 0, 0],
        pointerLength: 15,
        pointerWidth: 15,
        fill: color,
        stroke: color,
        strokeWidth: 4
    });

    const magnitudValue = new Konva.Text({
        x: lx+4,
        y: -ly,
        text: txt,
        fontSize: 15,
        fontFamily: "Impact",
        fill: color
    });

    group.add(arrow, magnitudValue);
    layerForPaint.add(group);

    paintIfMouseOver(arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup=true);
    paintIfMouseOver(magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup=true);
    
    if (color == "black") {
        const konvaElement = lastNodeClick;
        const nodeParent = dcl.findNodeById(konvaElement.getAttr("id"));
        nodeParent.addFuerza(parseFloat(magnitud), parseFloat(angle));
        nodeParent.addKonvaFuerza(group)
        group.setAttr("id", konvaElement.getAttr("id"))    
    }

    // layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateEquations();
    // updateScorePanel();
    moveVigasToTop();
    return group;
}

function createMomento(val, color="black", x0=0, y0=0, layerForPaint=layer, forEmpotrado=false) {
    let x0lastPos = lastVigaNodeClick.x
    let y0lastPos = lastVigaNodeClick.y

    let magnitud = val;
    let txt = magnitud + " Nm";

    if (color != "black") {
        x0lastPos = x0;
        y0lastPos = y0;
    }

    let listOfPoints;
    const positiveList = [17.68, 17.68, 18.63, 16.67, 19.53, 15.61, 20.36, 14.5, 21.14, 13.35, 21.85, 12.15, 22.49, 10.92, 23.06, 9.66, 23.56, 8.36, 23.99, 7.04, 24.34, 5.7, 24.62, 4.34, 24.82, 2.97, 24.95, 1.59, 25.0, 0.2, 24.97, -1.19, 24.87, -2.57, 24.69, -3.95, 24.43, -5.31, 24.1, -6.66, 23.69, -7.99, 23.21, -9.29, 22.66, -10.57, 22.04, -11.81, 21.35, -13.01, 20.59, -14.18, 19.77, -15.3, 18.89, -16.37, 17.96, -17.39, 16.96, -18.36, 15.92, -19.28, 14.82, -20.13, 13.68, -20.92, 12.5, -21.65, 11.28, -22.31, 10.02, -22.9, 8.74, -23.42, 7.42, -23.87, 6.09, -24.25, 4.73, -24.55, 3.36, -24.77, 1.98, -24.92, 0.59, -24.99, -0.79, -24.99, -2.18, -24.9, -3.56, -24.75, -4.93, -24.51, -6.28, -24.2, -7.61, -23.81, -8.92, -23.35, -10.2, -22.82, -11.46, -22.22, -12.67, -21.55, -13.85, -20.81, -14.98, -20.01, -16.07, -19.15, -17.11, -18.23, -18.09, -17.25, -19.02, -16.22, -19.89, -15.14, -20.7, -14.01, -21.45, -12.84, -22.13, -11.63, -22.74, -10.39, -23.28, -9.11, -23.75, -7.8, -24.15, -6.47, -24.47, -5.12, -24.72, -3.75, -24.89, -2.38, -24.98, -0.99, -25.0, 0.4, -24.94, 1.78, -24.8, 3.16, -24.58, 4.54, -24.3, 5.89, -23.93, 7.23, -23.49, 8.55, -22.98, 9.84, -22.4, 11.1, -21.75, 12.33, -21.03, 13.52, -20.25, 14.66, -19.4, 15.76, -18.5, 16.82, -17.54, 17.82, -16.52, 18.76, -15.45, 19.65, -14.34, 20.48, -13.18, 21.24, -11.98, 21.94, -10.74, 22.57, -9.48, 23.13, -8.18, 23.63, -6.85, 24.04, -5.51, 24.39, -4.15, 24.65, -2.77, 24.85, -1.39, 24.96, -0.0, 25.0]
    const negativeList = [-17.68, 17.68, -18.63, 16.67, -19.53, 15.61, -20.36, 14.5, -21.14, 13.35, -21.85, 12.15, -22.49, 10.92, -23.06, 9.66, -23.56, 8.36, -23.99, 7.04, -24.34, 5.7, -24.62, 4.34, -24.82, 2.97, -24.95, 1.59, -25.0, 0.2, -24.97, -1.19, -24.87, -2.57, -24.69, -3.95, -24.43, -5.31, -24.1, -6.66, -23.69, -7.99, -23.21, -9.29, -22.66, -10.57, -22.04, -11.81, -21.35, -13.01, -20.59, -14.18, -19.77, -15.3, -18.89, -16.37, -17.96, -17.39, -16.96, -18.36, -15.92, -19.28, -14.82, -20.13, -13.68, -20.92, -12.5, -21.65, -11.28, -22.31, -10.02, -22.9, -8.74, -23.42, -7.42, -23.87, -6.09, -24.25, -4.73, -24.55, -3.36, -24.77, -1.98, -24.92, -0.59, -24.99, 0.79, -24.99, 2.18, -24.9, 3.56, -24.75, 4.93, -24.51, 6.28, -24.2, 7.61, -23.81, 8.92, -23.35, 10.2, -22.82, 11.46, -22.22, 12.67, -21.55, 13.85, -20.81, 14.98, -20.01, 16.07, -19.15, 17.11, -18.23, 18.09, -17.25, 19.02, -16.22, 19.89, -15.14, 20.7, -14.01, 21.45, -12.84, 22.13, -11.63, 22.74, -10.39, 23.28, -9.11, 23.75, -7.8, 24.15, -6.47, 24.47, -5.12, 24.72, -3.75, 24.89, -2.38, 24.98, -0.99, 25.0, 0.4, 24.94, 1.78, 24.8, 3.16, 24.58, 4.54, 24.3, 5.89, 23.93, 7.23, 23.49, 8.55, 22.98, 9.84, 22.4, 11.1, 21.75, 12.33, 21.03, 13.52, 20.25, 14.66, 19.4, 15.76, 18.5, 16.82, 17.54, 17.82, 16.52, 18.76, 15.45, 19.65, 14.34, 20.48, 13.18, 21.24, 11.98, 21.94, 10.74, 22.57, 9.48, 23.13, 8.18, 23.63, 6.85, 24.04, 5.51, 24.39, 4.15, 24.65, 2.77, 24.85, 1.39, 24.96, 0.0, 25.0]
    
    if (magnitud < 0) {
        listOfPoints = negativeList;

    } else if (magnitud > 0) {
        listOfPoints = positiveList;

    } else {
        if (color != "black") {
            x0lastPos = x0;
            y0lastPos = y0;
            listOfPoints = positiveList;
        }
    
    }


    const group = new Konva.Group({name: "momento", tension: magnitud, x: x0lastPos, y: y0lastPos});
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: listOfPoints,
        pointerLength: 10,
        pointerWidth: 10,
        fill: color,
        stroke: color,
        strokeWidth: 4,
        name: "subElemento",
    });

    const magnitudValue = new Konva.Text({
        x: 0 - blockSnapSize,
        y: 0 - blockSnapSize,
        text: txt,
        fontSize: 15,
        fontFamily: "Impact",
        fill: color,
    });

    group.add(arrow, magnitudValue)

    paintIfMouseOver(arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup=true);
    paintIfMouseOver(magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup=true);

    if (color == "black") {
        const konvaElement = lastNodeClick;
        const nodeParent = dcl.findNodeById(konvaElement.getAttr("id"));
        nodeParent.addMomento(parseFloat(magnitud)); 
        nodeParent.addKonvaMomento(group);
        group.setAttr("id", konvaElement.getAttr("id"));
    }

    layerForPaint.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateEquations();
    // updateScorePanel();
    return group;
}


//------------------------------------------------------Funcionalidades-----------------------------------------------//
function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}


//------------------------------------------------------Panel Herramientas-----------------------------------------------//
function createButton(widthPanel, heightPanel, idNameText, btnText, execFunction, valMagnitud=0, valAngle=0, element=0,image) {
    const btn = document.createElement("button");
    btn.type = "button";
    // btn.style.backgroundColor = "yellow";
    // btn.style.background =  "url(prueba.png)";
    btn.style.backgroundImage = image;
    console.log("widdth boton es: "+ widthPanel)
    console.log("alto boton: "+heightPanel)
    btn.style.width = widthPanel + "px";
    btn.style.height = heightPanel  + "px";
    btn.style.backgroundSize = "cover"; // todo en button
    btn.id = idNameText;
    
    // btn.innerText = btnText;
    btn.addEventListener("dblclick", () => {

        if (idNameText == "vigaBtn") {
            execFunction();
        } else if (idNameText == "fuerzaBtn") {
            execFunction(valMagnitud.value, valAngle.value);
        } else if(idNameText == "momentoBtn") {
            execFunction(valMagnitud.value)
        } else if(idNameText == "deleteElementBtn") {
            execFunction(element);
        } else {
            execFunction();
        }
        //updateAll();
    });
    return btn;
}


function createInputMagnitud(idParam, widthPanel, heightPanel) {
    const input = document.createElement("input");
    input.type = "number";
    input.setAttribute("id", idParam);
    input.value = "1"
    input.style.width = widthPanel / 4 + "px";
    input.style.height = heightPanel -6  +"px";

    return input;
}


function createInputAngle(idParam, widthPanel, heightPanel) {
    const input = document.createElement("input");
    input.type = "number";
    input.setAttribute("id", idParam);
    input.min = "0";
    input.max = "359";
    input.value = "90"
    input.style.width = widthPanel / 4 + "px";
    input.style.height = heightPanel  -6 + "px";

    return input;
}


function createContainer(list) {
    const container= document.createElement("div");
    container.style.display = "flex";
    list.forEach(element => {
        container.appendChild(element);
    });

    return container;
}


function createPanel(x0, y0) {
    const widthPanel = 240;
    const heightPanel = 150;
    // const widthPanel = 350;
    // const heightPanel = 200;
    const colorPanel = "#DDDDDD";

    const heightPanelElement = heightPanel / 5;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + y0 +"px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel +"px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "hidden";
    panel.style.zIndex = "1000";
    
    
    // panel.style.visibility = "visible";

    const inputCreateFuerzaMagnitud = createInputMagnitud("input-create-fuerza", widthPanel, heightPanelElement);
    const inputCreateFuerzaAngle = createInputAngle("input-create-fuerza-angle", widthPanel, heightPanelElement);

    const inputCreateMomento = createInputMagnitud("input-create-momento", widthPanel*2, heightPanelElement); // *2 porque en la funcion input se divide por 4 y porque 


    const imgApoyoDesilzante = "url(fotos/apoyodeslizante.png)"
    const imgApoyo = "url(fotos/apoyo.png)"
    const imgBiela = "url(fotos/biela.png)"
    const imgRotula= "url(fotos/rotula.png)"
    const imgApMomento = "url(fotos/momento.png)"
    const imgFuerza = "url(fotos/fuerza.png)"
    const imgEmpotrado = "url(fotos/empotrado.png)"
    const imgViga = "url(fotos/vigaFoto.png)"
    // const imgDelete = "url(delete.png)" usado en otra funcion de delete

    const btnViga = createButton(widthPanel/2, heightPanelElement, "vigaBtn", "Viga", createViga, null);
    const btnApoyoDeslizante = createButton(widthPanel/2, heightPanelElement, "apoyoDeslizanteBtn", "Apoyo deslizante", createApoyoDeslizante,null,null,null,imgApoyoDesilzante ); 
    const btnApoyoNoDeslizante = createButton(widthPanel/2, heightPanelElement, "apoyoNoDeslizanteBtn", "Apoyo no deslizante", createApoyoNoDeslizante,null,null,null, imgApoyo); 
    const btnEmpotrado = createButton(widthPanel/2, heightPanelElement, "empotradoBtn", "Empotrado", createEmpotrado,null,null,null, imgEmpotrado); 
    const btnRotula = createButton(widthPanel/2, heightPanelElement, "rotulaBtn", "Rotula", createRotula,null,null,null, imgRotula);
    const btnBiela = createButton(widthPanel/2, heightPanelElement, "bielaBtn", "Biela", createBiela,null,null,null, imgBiela); 
    const btnFuerza = createButton(widthPanel/2, heightPanelElement, "fuerzaBtn", "Fuerza", createFuerza, inputCreateFuerzaMagnitud, inputCreateFuerzaAngle,null,imgFuerza); 
    const btnMomento = createButton(widthPanel/2, heightPanelElement, "momentoBtn", "Momento", createMomento, inputCreateMomento,null,null, imgApMomento);
    const btnViga2 = createButton(widthPanel/2, heightPanelElement, "viga2btn", "Viga", createViga2, null,null,null,imgViga);

    const containerFuerza = createContainer([btnFuerza, inputCreateFuerzaMagnitud, inputCreateFuerzaAngle]);
    const containerCreateMomento = createContainer([btnMomento, inputCreateMomento]);

    const topOfPanel = document.createElement("div");
    topOfPanel.style.width = widthPanel;
    topOfPanel.style.height = heightPanelElement;
    topOfPanel.style.backgroundColor = colorPanel;
    topOfPanel.style.border = "2px";
    topOfPanel.style.borderBlockColor = "black";
    topOfPanel.innerText = "Elementos ";
    topOfPanel.align = "center";

    panel.appendChild(topOfPanel);
    // panel.appendChild(btnViga);
    panel.appendChild(btnViga2)
    panel.appendChild(btnApoyoDeslizante);
    panel.appendChild(btnApoyoNoDeslizante)
    panel.appendChild(btnEmpotrado);
    panel.appendChild(btnRotula);
    panel.appendChild(btnBiela);
    panel.appendChild(containerFuerza);
    panel.appendChild(containerCreateMomento);

    return panel;
}


function listenPanelMovement(panel) {
    let mousePosition;
    let isDown = false;
    let offset = [0, 0];

    panel.addEventListener("mousedown", (e) => {
        isDown = true;
        offset = [
            panel.offsetLeft - e.clientX,
            panel.offsetTop - e.clientY
        ];
    });

    document.addEventListener("mouseup", function() {
        isDown = false;
    });

    document.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if (isDown) {
            mousePosition = {
                x : e.clientX,
                y : e.clientY
            };
            panel.style.left = (mousePosition.x + offset[0]) + "px";
            panel.style.top  = (mousePosition.y + offset[1]) + "px";
        }
    });

    return mousePosition;
}


function movePanelTo(panelParam, x, y) {
    if (panelParam == panel) {
        panelParam.style.left = getOffset(divKonvaContainer).left + x + "px";
        panelParam.style.top  = getOffset(divKonvaContainer).top + y + "px";
    } else if (panelParam == delPanel) {
        panelParam.style.left = getOffset(divKonvaContainer).left + x - panelParam.offsetWidth + "px";
        panelParam.style.top  = getOffset(divKonvaContainer).top + y + "px";
    }

}


function getXY() {
    const mouseXY = stage.getPointerPosition();
    if (mouseXY) {
        return {x: mouseXY.x, y: mouseXY.y};
    } else {
        console.log("Fallo en getXY()");
        return {x: 800, y:800};
    }
}


function roundXY(mouseXY) {
    const {x, y} = mouseXY;
    const X = Math.round(x / blockSnapSize) * blockSnapSize;
    const Y = Math.round(y / blockSnapSize) * blockSnapSize;
    return {x: X, y: Y};
}


//------------------------------------------------------Puntaje-----------------------------------------------//
function createScorePanel(x0, y0) {
    const widthPanel = 240;
    const heightPanel = 40;
    const colorPanel = "#DDDDDD";

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel +"px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "visible"; // hidden or visible
    panel.style.display = "flex";

    const categoryText = document.createElement("h4")
    categoryText.id = "categoryText";
    categoryText.innerText = "Categoria: ";

    const valueCategory = document.createElement("h4");
    valueCategory.id = "valueCategory";
    valueCategory.innerText = "1";

    const containerCategory = document.createElement("div");
    containerCategory.style.display = "flex";
    containerCategory.appendChild(categoryText);
    containerCategory.appendChild(valueCategory);
    
    const scoreText = document.createElement("h4");
    scoreText.id = "scoreText";
    scoreText.innerText = "Puntaje: ";

    const valueScore = document.createElement("h4");
    valueScore.id = "valueScore";
    valueScore.innerText = "0";

    const containerScore = document.createElement("div");
    containerScore.style.display = "flex";
   
    containerScore.appendChild(scoreText);
    containerScore.appendChild(valueScore);
    
    panel.appendChild(containerCategory);
    panel.appendChild(containerScore);

    return panel;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}


function listenCreateElement() {
    stage.on("dblclick", (e) => {
        if (e.target != stage && e.target) {
            const mouseXY = roundXY(getXY());
            lastVigaNodeClick.x = mouseXY.x;
            lastVigaNodeClick.y = mouseXY.y;
            lastNodeClick = e.target;
            const nodeParent = dcl.findNodeById(lastNodeClick.getAttr("id"))
            console.log(nodeParent)
            console.log(e.target.getParent())
            // console.log(lastNodeClick)
            if (e.target.name() == "subElementoVigaCirculo1") {
                panel.style.visibility = "visible";
                movePanelTo(panel, mouseXY.x, mouseXY.y);

                const parent = e.target.getParent();
                const otherNode = parent.getChildren((node) => {return node.name() === "subElementoVigaCirculo2"})[0];
                const otherNodePosition =  getElementPos(otherNode);
                
            } else if (e.target.name() == "subElementoVigaCirculo2") {
                panel.style.visibility = "visible";
                movePanelTo(panel, mouseXY.x, mouseXY.y);

                const parent = e.target.getParent();
                const otherNode = parent.getChildren((node) => {return node.name() === "subElementoVigaCirculo1"})[0]
                const otherNodePosition =  getElementPos(otherNode);
                
            } else if (e.target.name() == "subElementoVigaCirculo") {
                panel.style.visibility = "visible";
                movePanelTo(panel, mouseXY.x, mouseXY.y);

            
            }
    
            // console.log(dcl)

            
        }
    });
}


function destroyAttachedKonvaElements(node){
    if(node.konvaObjects.viga) node.konvaObjects.viga.destroy();
    if(node.konvaObjects.vinculo) node.konvaObjects.vinculo.destroy();
    if(node.konvaObjects.shadowViga) node.konvaObjects.shadowViga.destroy();
    
    node.konvaObjects.fuerzas.forEach(fuerza => {
        fuerza.destroy();
    })
    node.konvaObjects.momentos.forEach(momento => {
        momento.destroy();
    })
}

function deleteElement(element) {
    if (element.name() === "viga2") {
        const node = dcl.findNodeById(element.getAttr("id")+2) //element es el group del objeto, 
        const parentNode = node.parent
        const idx = parentNode.childreanNodes.findIndex(child => {
            child.id === node.id
        })
        parentNode.childreanNodes.splice(idx, 1)

        node.getAllDecendents().forEach(decendent => {
            destroyAttachedKonvaElements(decendent);
            delete decendent;
        })

        destroyAttachedKonvaElements(node);
        delete node;

    } else {
        const node = dcl.findNodeById(element.getAttr("id"))
        const apoyos = new Set(["apoyoDeslizante", "apoyoNoDeslizante", "empotrado", "rotula", "biela"]);

        if (apoyos.has(element.name())) {
            node.deleteVinculo();

        } else if (element.name() === "fuerza"){
            const tuple = element.getAttr("tension")
            const floatTuple = [parseFloat(tuple[0]), parseFloat(tuple[1])];
            const idx = idxForceInNode(node.fuerzas, floatTuple)
            node.fuerzas.splice(idx, 1)

        } else if (element.name() === "momento"){
            const val = parseFloat(element.getAttr("tension"))
            const idx = node.momentos.indexOf(val)
            node.momentos.splice(idx, 1)
        }
    }

    element.destroy();
    delete element;
}


function listenDeleteElement() {
    stage.on("dblclick", (e) => {
        if (e.target && e.target.getParent()) {
            const element = e.target.getParent();
            const name = element.name();
            if (name == "viga"                  ||
                name == "apoyoDeslizante"       ||
                name == "apoyoNoDeslizante"     ||
                name == "empotrado"             ||
                name == "rotula"                ||
                name == "biela"                 ||
                name == "fuerza"                ||
                name == "momento"               ||
                name == "viga2") {
                    const mouseXY = roundXY(getXY());
                    lastElementClick = element;
                    delPanel.style.visibility = "visible";
                    movePanelTo(delPanel, mouseXY.x, mouseXY.y);
                }
        } 
    });
}


function listenHiddePanels() {
    stage.on("click", () => {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
    });
}


function updateAll() {
    if (!resolvingTask) {
        // updateEquations();
        // updateScorePanel();
        replaceApoyos();
    } 
}


function replaceApoyos() {
    if (!resolvingTask) {
        stage2 = Konva.Node.create(JSON.parse(stage.clone({name: "stage2"}).toJSON()), 'container2');

        let layer2 = stage2.find(element => {
            return element.name() == "layer";
        })[0];
    
        const apoyosDeslizantes = layer2.find(element => {
            return element.name() == "apoyoDeslizante";
        });
        apoyosDeslizantes.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createFuerza(`F${item.getAttr("id")}_y`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        })
    
        const apoyosNoDeslizantes = layer2.find(element => {
            return element.name() == "apoyoNoDeslizante";
        });
        apoyosNoDeslizantes.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createFuerza(`F${item.getAttr("id")}_y`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            createFuerza(`F${item.getAttr("id")}_x`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        })
    
        const empotrados = layer2.find(element => {
            return element.name() == "empotrado";
        });
        empotrados.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createFuerza(`F${item.getAttr("id")}_y `, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            createFuerza(`F${item.getAttr("id")}_x `, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            createMomento(`M${item.getAttr("id")}`, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        })
    
        const fuerzas = layer2.find(element => {
            return element.name() == "fuerza";
        });
        fuerzas.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            const magnitud = item.getAttr("tension")[0];
            const angle = item.getAttr("tension")[1];
            const angleRad = angle * Math.PI / 180;
        
            if(0 == angle) { //
                createFuerza(`${magnitud} N`, 0, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (0 < angle && angle < 90) { //
                createFuerza(`${magnitud}*cos(${angle}) N`, 0, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${angle}) N`, 90, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (90 == angle) { //
                createFuerza(`${magnitud} N`, 90, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (90 < angle && angle < 180) {
                createFuerza(`${magnitud}*cos(${angle - 90}) N`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${angle - 90}) N`, 90, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (180 == angle) { //
                createFuerza(`${magnitud} N`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (180 < angle && angle < 270) {
                createFuerza(`${magnitud}*cos(${angle - 180}) N`, 180, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${angle - 180}) N`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (270 == angle) { //
                createFuerza(`${magnitud} N`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            } else if (270 < angle && angle < 360) {
                createFuerza(`${magnitud}*cos(${360 - angle}) N`, 0, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                createFuerza(`${magnitud}*sin(${360 - angle}) N`, 270, color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
                item.destroy();
            }
        });

        const momentos = layer2.find(element => {
            return element.name() == "momento";
        });

        momentos.forEach((item) => {
            const posXY = {x: item.getAttr("x"), y: item.getAttr("y")}
            createMomento(item.getAttr("tension"), color="green", x0=posXY.x, y0=posXY.y, layerForPaint=layer2);
            item.destroy();
        });
    }

}


function updateCounts() {
    stage.find( (element) => { 
       if (element.name() == "empotrado") countEmpotrado += 1;
       else if (element.name() == "apoyoDeslizante") countApoyoDeslizante += 1;
       else if (element.name() == "empotrado") countEmpotrado += 1;
    });
}


function moveVigasToTop() {
    // const vigas = layer.getChildren(element => {
    //     return element.name() == "viga";
    // });

    // const initialViga = layer.getChildren(element => {
    //     return element.name() == "initialViga";
    // })[0];
    // vigas.push(initialViga);
    // vigas.forEach(viga => {
    //     viga.moveToTop();
    // });
}

//------------------------------------------------------Delete panel-----------------------------------------------//
function delElement() {
    deleteElement(lastElementClick);
    delPanel.style.visibility = "hidden";
    panel.style.visibility = "hidden";
}

function createDelPanel(x0=0, y0=0) {
    const widthPanel = 120;
    const heightPanel = 30;
    const colorPanel = "#DDDDDD";
    const imgDelete = "url(fotos/delete.png)";

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + y0 +"px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel +"px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "hidden";
    panel.style.zIndex = "1001";

    const deleteElementBtn = createButton(widthPanel, heightPanel, "delElementBtn", "eliminar", delElement,null,null,null,imgDelete);

    panel.appendChild(deleteElementBtn);


    return panel;
}


function createHashElements(stage) {
    const hash = {
        initialViga: [],
        vigas: [],
        apoyosDeslizantes: [],
        apoyosNoDeslizantes: [],
        empotrados: [],
        bielas: [],
        rotulas: [],
        fuerzas: [],
        momentosPositivos: [],
        momentosNegativos: []
    }

    const layer = stage.find(element => {
        return element.name() == "layer";
    })[0];

    layer.getChildren().forEach(element => {
        if (element.name() == "initialViga") {
            hash.initialViga.push(element);

        } else if (element.name() == "viga") {
            hash.vigas.push(element);

        } else if (element.name() == "apoyoDeslizante") {
            hash.apoyosDeslizantes.push(element);

        } else if (element.name() == "apoyoNoDeslizante") {
            hash.apoyosNoDeslizantes.push(element);

        } else if (element.name() == "empotrado") {
            hash.empotrados.push(element);

        } else if (element.name() == "biela") {
            hash.bielas.push(element);

        } else if (element.name() == "rotula") {
            hash.rotulas.push(element);

        } else if (element.name() == "fuerza") {
            hash.fuerzas.push(element);

        } else if (element.name() == "momento-positivo") {
            hash.momentosPositivos.push(element);

        } else if (element.name() == "momento-negativo") {
            hash.momentosNegativos.push(element);
        }
    });

    return hash;
}

function getStartEndViga(viga) {
    const circle1 = viga.getChildren()[1];
    const circle2 = viga.getChildren()[2];
    const c1x = circle1.getAttr("x");
    const c1y = circle1.getAttr("y");
    const c2x = circle2.getAttr("x");
    const c2y = circle2.getAttr("y");

    return {start: [c1x, c1y], end: [c2x, c2y]};
}

function getElementPos(element) {
    const X = element.getAttr("x");
    const Y = element.getAttr("y");

    return [X, Y];
    return {x: X, y: Y};
}

function comparePositions(list1, list2) {
    console.log("ACA en compare position")
    console.log(list1)
    console.log(list2)
    return JSON.stringify(list1) === JSON.stringify(list2);
}

function comparefuerzas(tension1, tension2) {
    return JSON.stringify(tension1) === JSON.stringify(tension2);
}

function hashOfErros() {
    return {
        ERRORinitialViga: new Set(),
        ERRORvigas: new Set(),
        ERRORapoyosDeslizantes: new Set(),
        ERRORapoyosNoDeslizantes: new Set(),
        ERRORempotrados: new Set(),
        ERRORbielas: new Set(),
        ERRORrotulas: new Set(),
        ERRORfuerzas: new Set(),
        ERRORmomentosPositivos: new Set(),
        ERRORmomentosNegativos: new Set()
    }

}

function compare(stage1, stage2) { //stage1 student  stage2 solution
    ERRORS = hashOfErros();

    const hashElementsStage1 = createHashElements(stage1);
    const hashElementsStage2 = createHashElements(stage2);

    const initViga1 = hashElementsStage1.initialViga[0];
    const initViga2 = hashElementsStage2.initialViga[0];

    const initViga1Pos = getStartEndViga(initViga1);
    const initViga2Pos = getStartEndViga(initViga2);

    let verifyedInitialViga = true;
    if (comparePositions(initViga1Pos.end, initViga2Pos.end)) { //comparamos que la viga inicial este bien posicionada
        console.log("Viga inicial bien posicionada!");
    } else {
        console.log("Viga inicial mal posicionada!");
        verifyedInitialViga = false;
        ERRORS.ERRORinitialViga.add("OJO: Atencion con la viga inicial");
    }

    let verifyedVigas = hashElementsStage1.vigas.length == hashElementsStage2.vigas.length;
    if (!verifyedVigas) ERRORS.ERRORvigas.add("OJO: Atencion con la cantidad de vigas (no iniciales)");
    hashElementsStage1.vigas.forEach(viga1 => {
        let viga1Pos = getStartEndViga(viga1);
        let verify = false;
        hashElementsStage2.vigas.forEach(viga2 => {
            let viga2Pos = getStartEndViga(viga2);
            if (comparePositions(viga1Pos.start, viga2Pos.start) && comparePositions(viga1Pos.end, viga2Pos.end)) {
                console.log("LOL Estoy dentro de la condicion")
                verify = true;
            }
        });
        verifyedVigas &&= verify; 
    });
    if (!verifyedVigas) ERRORS.ERRORvigas.add("OJO: Atencion con la posicion de alguna viga");

    let verifyedAD = hashElementsStage1.apoyosDeslizantes.length == hashElementsStage2.apoyosDeslizantes.length;  
    if (!verifyedAD) ERRORS.ERRORapoyosDeslizantes.add("OJO: Atencion con la cantidad de apoyos deslizantes");
    hashElementsStage1.apoyosDeslizantes.forEach(ad1 => {
        let ad1Pos = getElementPos(ad1);
        let verify = false;
        hashElementsStage2.apoyosDeslizantes.forEach(ad2 => {
            let ad2Pos = getElementPos(ad2);
            if (comparePositions(ad1Pos, ad2Pos)) {
                verify = true;
            }
        });
        verifyedAD &&= verify;
    });
    if (!verifyedAD) ERRORS.ERRORapoyosDeslizantes.add("OJO: Atencion con la posicion de algun apoyo deslizante");

    let verifyedAND = hashElementsStage1.apoyosNoDeslizantes.length == hashElementsStage2.apoyosNoDeslizantes.length;
    if (!verifyedAND) ERRORS.ERRORapoyosNoDeslizantes.add("OJO: Atencion con la cantidad de apoyos no deslizantes");
    hashElementsStage1.apoyosNoDeslizantes.forEach(and1 => {
        let and1Pos = getElementPos(and1);
        let verify = false;
        hashElementsStage2.apoyosNoDeslizantes.forEach(and2 => {
            let and2Pos = getElementPos(and2);
            if (comparePositions(and1Pos, and2Pos)) {
                verify = true;
            }
        });
        verifyedAND &&= verify;
    });
    if (!verifyedAND) ERRORS.ERRORapoyosNoDeslizantes.add("OJO: Atencion con la posicion de algun apoyo no deslizante");

    let verifyedEmpotrados = hashElementsStage1.empotrados.length == hashElementsStage2.empotrados.length;
    if (!verifyedEmpotrados) ERRORS.ERRORempotrados.add("OJO: Atencion con la cantidad de empotrados");
    hashElementsStage1.empotrados.forEach(e1 => {
        let e1Pos = getElementPos(e1);
        let verify = false;
        hashElementsStage2.empotrados.forEach(e2 => {
            let e2Pos = getElementPos(e2);
            if (comparePositions(e1Pos, e2Pos)) {
                verify = true;
            }
        });
        verifyedEmpotrados &&= verify;
    });
    if (!verifyedEmpotrados) ERRORS.ERRORempotrados.add("OJO: Atencion con la posicion de algun empotrado");

    let verifyedRotulas = hashElementsStage1.rotulas.length == hashElementsStage2.rotulas.length;
    if (!verifyedRotulas) ERRORS.ERRORrotulas.add("OJO: Atencion con la cantidad de rotulas");
    hashElementsStage1.rotulas.forEach(r1 => {
        let r1Pos = getElementPos(r1);
        let verify = false;
        hashElementsStage2.rotulas.forEach(r2 => {
            let r2Pos = getElementPos(r2);
            if (comparePositions(r1Pos, r2Pos)) {
                verify = true;
            }
        });
        verifyedRotulas &&= verify;
    });
    if (!verifyedRotulas) ERRORS.ERRORrotulas.add("OJO: Atencion con la posicion de alguna rotula");

    let verifyedBielas = hashElementsStage1.bielas.length == hashElementsStage2.bielas.length;
    if (!verifyedBielas) ERRORS.ERRORbielas.add("OJO: Atencion con la cantidad de bielas");
    hashElementsStage1.bielas.forEach(b1 => {
        let b1Pos = getElementPos(b1);
        let verify = false;
        hashElementsStage2.bielas.forEach(b2 => {
            let b2Pos = getElementPos(b2);
            if (comparePositions(b1Pos, b2Pos)) {
                verify = true;
            }
        });
        verifyedBielas &&= verify;
    });
    if (!verifyedBielas) ERRORS.ERRORrotulas.add("OJO: Atencion con la posicion de alguna biela");

    let verifyedMN = hashElementsStage1.momentosNegativos.length == hashElementsStage2.momentosNegativos.length;
    if (!verifyedMN) ERRORS.ERRORmomentosNegativos.add("OJO: Atencion con la cantidad de momentos negativos");
    hashElementsStage1.bielas.forEach(mn1 => {
        let mn1Pos = getElementPos(mn1);
        let verify = false;
        let aux = false;
        hashElementsStage2.bielas.forEach(mn2 => {
            let mn2Pos = getElementPos(mn2);
            if (comparePositions(mn1Pos, mn2Pos)) {
                if (mn1.getAttr("tension") == mn2.getAttr("tension")) {
                    verify = true;
                } else {
                    ERRORS.ERRORmomentosNegativos.add("OJO: Atencion con la magnitud de algun momento negativo");
                    aux = true;
                }
            } 
        });
        verifyedMN &&= verify;
        if (!verify && !aux) ERRORS.ERRORmomentosNegativos.add("OJO: Atencion con la posicion de algun momento negativo");
    });

    let verifyedMP = hashElementsStage1.momentosPositivos.length == hashElementsStage2.momentosPositivos.length;
    if (!verifyedMP) ERRORS.ERRORmomentosPositivos.add("OJO: Atencion con la cantidad de momentos positivos");
    hashElementsStage1.momentosPositivos.forEach(mp1 => {
        let mp1Pos = getElementPos(mp1);
        let verify = false;
        let aux = false;
        hashElementsStage2.momentosPositivos.forEach(mp2 => {
            let mp2Pos = getElementPos(mp2);
            if (comparePositions(mp1Pos, mp2Pos)) {
                if (mp1.getAttr("tension") == mp2.getAttr("tension")) {
                    verify = true;
                } else {
                    ERRORS.ERRORmomentosPositivos.add("OJO: Atencion con la magnitud de algun momento positivo");
                    aux = true;
                }
            } 
        });
        verifyedMP &&= verify;
        if (!verify && !aux) ERRORS.ERRORmomentosPositivos.add("OJO: Atencion con la posicion de algun momento positivo");
    });

    let verifyedFuerzas = hashElementsStage1.fuerzas.length == hashElementsStage2.fuerzas.length;  
    if (!verifyedFuerzas) ERRORS.ERRORfuerzas.add("OJO: Atencion con la cantidad de fuerzas");
    hashElementsStage1.fuerzas.forEach(f1 => {
        let f1Pos = getElementPos(f1);
        let verify = false;
        let aux = false;
        hashElementsStage2.fuerzas.forEach(f2 => {
            let f2Pos = getElementPos(f2);
            if (comparePositions(f1Pos, f2Pos)) {
                if (comparefuerzas(f1.getAttr("tension"), f2.getAttr("tension"))) {
                    verify = true;
                } else {
                    ERRORS.ERRORfuerzas.add("OJO: Atencion con la magnitud o angulo de algun fuerza");
                    aux = true;
                }
            } 
        });
        verifyedFuerzas &&= verify;
        if (!verify && !aux) ERRORS.ERRORfuerzas.add("OJO: Atencion con la posicion de alguna fuerza");
    });
    

    console.log("verificaciones")
    const listOfConditions = [verifyedInitialViga, verifyedVigas, verifyedAD, verifyedAND, verifyedEmpotrados, verifyedRotulas, verifyedBielas, verifyedMP, verifyedMN, verifyedFuerzas]
    console.log(listOfConditions)
    taskResolvedSuccefully = true
    listOfConditions.forEach(element => {
        taskResolvedSuccefully &&= element
    })
    console.log(taskResolvedSuccefully)
    // console.clear();
    console.log(ERRORS);

}

function showHints() {
    compare(stage, stageSolution);
    let txt = "";
    console.log(ERRORS)
    Object.values(ERRORS).forEach((value) => {
        value.forEach(hint => {
            txt += hint + "\n";
        });
    })
    alert(txt);
}

function joinNodes(parent, child) {
    parent.addChild(child);
    child.setParent(parent);
}

function idxForceInNode(nodeForces, myForce){
    for(let i = 0; i < nodeForces.length; i++){
        if(nodeForces[i][0] == myForce[0] && nodeForces[i][1] == myForce[1]){
            return i;
        }
    }
    console.log("index not found")
    return;
}

function removeAttributesForJSON(node){
    delete node.parent;
    delete node.konvaObjects;

}

function generateJSON(dclStructure){
    // const copy = Object.assign(Object.create(Object.getPrototypeOf(dclStructure)), dclStructure)
    const copy = dclStructure.clone()
    copy.getAllDecendents().forEach(descendent => {
        removeAttributesForJSON(descendent);
    });
    removeAttributesForJSON(copy);

    return JSON.stringify(copy);
}


function paintElement(element, fillc, strokec, paintGroup){
    if (element.getAttr("fill")) element.setAttr("fill", fillc)
    if (element.getAttr("stroke")) element.setAttr("stroke", strokec)

    if (paintGroup){
        element.getParent().getChildren().forEach(e => {
            if (e.getAttr("fill")) e.setAttr("fill", fillc)
            if (e.getAttr("stroke")) e.setAttr("stroke", strokec)
        })
    }
}

function paintIfMouseOver(element, nfillc, nstrokec, ofillc, ostrokec, paintGroup=false){
    element.on("mouseenter", () => {
        paintElement(element, nfillc, nstrokec, paintGroup)
    })

    element.on("mouseleave", () => {
        paintElement(element, ofillc, ostrokec, paintGroup)
    })
}
