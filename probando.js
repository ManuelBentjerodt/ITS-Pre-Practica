function updateViga(viga, shadow) {
    const vigaList = viga.getChildren();
    const shadowList = shadow.getChildren();
    vigaList[1].on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
        viga.moveToTop();
    });

    vigaList[1].on("dragmove", () => {
        const circle1Pos = vigaList[1].getPosition();
        const circle2Pos = vigaList[2].getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        vigaList[0].position(circle1Pos);
        vigaList[0].points([0, 0, circle2Pos.x - circle1Pos.x, circle2Pos.y - circle1Pos.y]);

        vigaList[1].position({x: circle1Pos.x, y: circle1Pos.y});
        shadowList[1].position({
            x: Math.round(circle1Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle1Pos.y / blockSnapSize) * blockSnapSize
        });

        shadowList[0].position(circle2Pos);
        shadowList[0].points([0, 0, shadowCircle1Pos.x - circle2Pos.x, shadowCircle1Pos.y - circle2Pos.y]);
    })

    vigaList[1].on("dragend", () => {
        const circle2Pos = vigaList[2].getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        const newX = circle2Pos.x - shadowCircle1Pos.x;
        const newY = circle2Pos.y - shadowCircle1Pos.y;

        vigaList[0].position(shadowCircle1Pos);
        vigaList[0].points([0, 0, newX, newY]);
        vigaList[1].position({
            x: shadowCircle1Pos.x,
            y: shadowCircle1Pos.y
        });

        shadowList[0].position(vigaList[0].position());
        shadow.hide();
        updateAll();
    });

    vigaList[2].on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
        viga.moveToTop();
    });

    vigaList[2].on("dragmove", () => {
        const linePos = vigaList[0].getPosition();
        const circle2Pos = vigaList[2].getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        vigaList[0].points([0, 0, circle2Pos.x - linePos.x, circle2Pos.y - linePos.y])
        shadowList[0].points([0, 0, newX, newY])

        vigaList[2].position({x: circle2Pos.x, y: circle2Pos.y})
        shadowList[2].position({
            x: Math.round(circle2Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle2Pos.y / blockSnapSize) * blockSnapSize
        });
    });

    vigaList[2].on("dragend", () => {
        const linePos = vigaList[0].getPosition();
        const circle2Pos = vigaList[2].getPosition();
        const shadowCircle2Pos = shadowList[2].getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        vigaList[0].points([0, 0, newX, newY])
        vigaList[2].position({
            x: shadowCircle2Pos.x,
            y: shadowCircle2Pos.y
        });
        shadow.hide();
        updateAll();
    });
}


function createViga(nameViga="viga") {
    let x0 = lastVigaNodeClick.x
    let y0 = lastVigaNodeClick.y
    const y1 = 0;
    const x1 = blockSnapSize * 3;

    let nameShadow = "shadow-viga";
    if (nameViga == "initialViga") {
        x0 = blockSnapSize * 8;
        y0 = blockSnapSize * 8;
        nameShadow = "shadow-initialViga"
    }

    const line = newViga(x0, y0, x1, y1, nameViga);
    const shadowLine = createShadowViga(x0, y0, x1, y1, nameShadow);
    shadowLine.hide();

    layer.add(line, shadowLine);
   

    updateViga(line, shadowLine);
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();
    

    


    return line;
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
        x: x0+3*blockSnapSize,
        y: y0,
        radius: 5,
        fill: "red",
        draggable: true,
        id: idByDate + 2
    });

    
    
    
    group.add(line, circle)
    layer.add(group)

    const node = new Node([x0, y0], id=circle.getAttr("id"));
    const nodeParent = dcl.findNodeById(konvaElement.getAttr("id"))
    node.setKonvaViga(group)

    joinNodes(nodeParent, node)


    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateAll();
    moveVigasToTop();

}