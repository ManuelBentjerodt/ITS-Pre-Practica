function createShadowBeam(x0, y0, x1, y1, nameShadow = "shadow-beam") {
    const group = new Konva.Group({ name: nameShadow });
    const line = new Konva.Line({
        name: "subelementBeam",
        x: x0,
        y: y0,
        points: [0, 0, x1, y1],
        strokeWidth: 5,
        stroke: "#FF7B17",
        dash: [10, 4]
    });

    const circle1 = new Konva.Circle({
        name: "subelementBeam",
        x: x0,
        y: y0,
        radius: nodeRadius,
        fill: "#CF6412",
        draggable: true
    });

    const circle2 = circle1.clone({
        name: "subelementBeam",
        x: x0 + (x1),
        y: y0 + (y1)
    });

    group.add(line, circle1, circle2);
    layer.add(group);

    return group
}

//------------------------------------------------------Beam-----------------------------------------------//

function newBeam(x0, y0, x1, y1, nameBeam = "beam", _id) { //parte en el punto (x0, y0) y se desplaza x1 horizontalmente ^ y1 verticalmente ( no va al punto (x1, y1))

    let dragg = true;
    let idByDate;

    if (_id) {
        idByDate = _id + -3 //-3 pq ya tiene sumado los 3 del circulo, no hay q suamrl odenuevo, es decir restar y sumar
    } else {
        idByDate = Date.now();
    }

    const group = new Konva.Group({ draggable: false, name: nameBeam, id: idByDate });
    const line = new Konva.Line({
        name: "subelementBeamLine",
        x: x0,
        y: y0,
        points: [0, 0, x1, y1],
        strokeWidth: 5,
        stroke: "black",
        id: idByDate + 1
    });

    const circle1 = new Konva.Circle({
        name: "subElementBeamCircle1",
        x: x0,
        y: y0,
        radius: nodeRadius,
        fill: originColor,
        draggable: dragg,
        id: idByDate + 2
    });

    const circle2 = new Konva.Circle({
        name: "subElementBeamCircle2",
        x: x0 + x1,
        y: y0 + y1,
        radius: nodeRadius,
        fill: nodeColor,
        draggable: true,
        id: idByDate + 3
    });

    group.add(line, circle1, circle2);

    // paintIfMouseOver(line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"));
    // paintIfMouseOver(circle1, nfillc, nstrokec, circle1.getAttr("fill"), circle1.getAttr("stroke"));
    // paintIfMouseOver(circle2, nfillc, nstrokec, circle2.getAttr("fill"), circle2.getAttr("stroke"));

    return group;
}

function createBeam(nameBeam = "beam", _id = null, coordinates = null, _node = null) {
    let x0 = lastBeamNodeClick.x
    let y0 = lastBeamNodeClick.y
    let x1 = blockSnapSize * 3;
    let y1 = 0;

    if (nameBeam == "initialBeam") {
        x0 = blockSnapSize * 8;
        y0 = blockSnapSize * 8;
    }

    if (_id) {
        [x0, y0] = coordinates[0];
        [x1, y1] = coordinates[1];
    }

    const line = newBeam(x0, y0, x1, y1, nameBeam, _id = _id);
    layer.add(line);

    let originNode;
    let secondNode;
    if (_node) {
        secondNode = _node;
        originNode = _node.parent;
    } else {
        originNode = new Node([x0, y0], id = line.getChildren()[1].getAttr("id"));
        secondNode = new Node([x0 + x1, y0 + y1], id = line.getChildren()[2].getAttr("id"));
        joinNodes(originNode, secondNode);
    }

    originNode.setKonvaCircle(line.getChildren()[1]);
    secondNode.setKonvaCircle(line.getChildren()[2]);
    secondNode.setKonvaBeam(line);

    x_reference.addPoint(line.getChildren()[1]);
    x_reference.addPoint(line.getChildren()[2]);

    y_reference.addPoint(line.getChildren()[1]);
    y_reference.addPoint(line.getChildren()[2]);


    hideAllPanels();

    return [originNode, line];
}

function createBeam2(_node = null, _parent = null) {
    const konvaElement = lastNodeClick;
    let [x0, y0] = [];
    let idByDate;
    let pointsLine;
    let posXCircle, posYCircle;
    let posXLine, posYLine;
    let x0shadow, y0shadow, x1shadow, y1shadow;

    if (_node) {
        [x0, y0] = _parent.coordinate;
        [x1, y1] = _node.coordinate;

        const diffX = x1 - x0;
        const diffY = y1 - y0;
        const angle = Math.atan2(diffY, diffX);

        idByDate = _node.id - 2;
        pointsLine = [nodeRadius * Math.cos(angle), nodeRadius * Math.sin(angle), x1 - x0, y1 - y0];
        posXLine = x0;
        posYLine = y0;
        posXCircle = x1
        posYCircle = y1;
        x0shadow = x0
        y0shadow = y0
        x1shadow = x1 - x0
        y1shadow = y1 - y0

    } else {
        [x0, y0] = getElementPos(konvaElement);
        idByDate = Date.now();
        pointsLine = [nodeRadius, 0, 3 * blockSnapSize, 0];
        posXLine = x0;
        posYLine = y0;
        posXCircle = x0 + 3 * blockSnapSize;
        posYCircle = y0;
        x0shadow = x0
        y0shadow = y0
        x1shadow = 3 * blockSnapSize
        y1shadow = 0
    }

    const group = new Konva.Group({ name: "beam2", id: idByDate });
    const line = new Konva.Line({
        name: "subElementBeamLine",
        x: posXLine,
        y: posYLine,
        points: pointsLine,
        strokeWidth: 5,
        stroke: "black",
        id: idByDate + 1
    });

    const circle = new Konva.Circle({
        name: "subElementBeamCircle",
        x: posXCircle,
        y: posYCircle,
        radius: nodeRadius,
        fill: "red",
        draggable: true,
        id: idByDate + 2
    });

    group.add(line, circle)

    paintIfMouseOver(line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"));
    paintIfMouseOver(circle, nfillc, nstrokec, circle.getAttr("fill"), circle.getAttr("stroke"));

    const shadowLine = createShadowBeam(x0shadow, y0shadow, x1shadow, y1shadow, "shadowBeam2");
    shadowLine.hide();

    layer.add(group, shadowLine);

    let node, nodeParent;

    if (_node) {
        node = _node

    } else {
        node = new Node([posXCircle, posYCircle], id = circle.getAttr("id"));
        nodeParent = dcl.findNodeById(konvaElement.getAttr("id"))
        joinNodes(nodeParent, node)
    }

    node.setKonvaBeam(group);
    node.setKonvaShadowBeam(shadowLine);
    node.setKonvaCircle(circle);


    x_reference.addPoint(circle);
    y_reference.addPoint(circle);

    hideAllPanels();

    listenNodeMovement(group, shadowLine, "beam2");
    calculateEquations();

    return group;
}

function changePosWithSetAttr(element, x, y) {
    element.setAttr("x", x);
    element.setAttr("y", y);
}


function moveElementsAttached(element, newPosition, distanceToY, distanceToX) {
    if (element.konvaObjects.link) {
        element.konvaObjects.link.position(newPosition);
    }
    if (element.konvaObjects.forces.length) {
        element.konvaObjects.forces.forEach(force => {
            force.position(newPosition);
        })
    }
    if (element.konvaObjects.moments.length) {
        element.konvaObjects.moments.forEach(moment => {
            moment.position(newPosition);
        })
    }

    if (element.konvaObjects.segmentedLineX) {
        element.konvaObjects.segmentedLineX.position(newPosition);
        element.konvaObjects.segmentedLineX.setAttr("points", [0, 0, distanceToY, 0]);
    }

    if (element.konvaObjects.segmentedLineY) {
        element.konvaObjects.segmentedLineY.position(newPosition);
        element.konvaObjects.segmentedLineY.setAttr("points", [0, 0, 0, distanceToX]);
    }
}

function listenNodeMovement(konvaBeam, shadow, typeOfBeam) {
    let shadowList;
    let beamLine;
    let beamCircle;
    let otherCircle;

    if (typeOfBeam === "beam2") {
        shadowList = shadow.getChildren();
        beamLine = konvaBeam.getChildren()[0];
        beamCircle = konvaBeam.getChildren()[1];
        otherCircle = dcl.findNodeById(beamCircle.getAttr("id")).parent.konvaObjects.circle;

    } else {
        shadowList = shadow.getChildren();
        beamLine = konvaBeam.getChildren()[0];
        beamCircle = konvaBeam.getChildren()[2];
        otherCircle = konvaBeam.getChildren()[1];
    }

    const nodeBeamCircle = dcl.findNodeById(beamCircle.getAttr("id"));
    const nodeOtherCircle = dcl.findNodeById(otherCircle.getAttr("id"));

    otherCircle.on("dragstart", () => {
        if (!turnToRealDCLFlag) {
            shadow.show();
            shadow.moveToTop();
        }
    });

    otherCircle.on("dragmove", () => {
        if (!turnToRealDCLFlag) {
            const circle1Pos = otherCircle.getPosition();
            const circle2Pos = beamCircle.getPosition();
            const shadowCircle1Pos = shadowList[1].getPosition();

            const newX = shadowCircle1Pos.x - circle2Pos.x
            const newY = shadowCircle1Pos.y - circle2Pos.y
            const angle = Math.atan2(newY, newX);

            beamLine.position(circle1Pos);
            beamLine.points([-nodeRadius * Math.cos(angle), -nodeRadius * Math.sin(angle), circle2Pos.x - circle1Pos.x, circle2Pos.y - circle1Pos.y]);

            otherCircle.position({ x: circle1Pos.x, y: circle1Pos.y });
            shadowList[1].position({
                x: Math.round(circle1Pos.x / blockSnapSize) * blockSnapSize,
                y: Math.round(circle1Pos.y / blockSnapSize) * blockSnapSize
            });

            shadowList[0].position(circle2Pos);
            shadowList[0].points([0, 0, newX, newY]);

            moveElementsAttached(nodeOtherCircle, otherCircle.position());
        }
        const circle1Pos = otherCircle.getPosition();
        const circle2Pos = beamCircle.getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        const newX = shadowCircle1Pos.x - circle2Pos.x
        const newY = shadowCircle1Pos.y - circle2Pos.y
        const angle = Math.atan2(newY, newX);

        beamLine.position(circle1Pos);
        beamLine.points([-nodeRadius * Math.cos(angle), -nodeRadius * Math.sin(angle), circle2Pos.x - circle1Pos.x, circle2Pos.y - circle1Pos.y]);

        otherCircle.position({ x: circle1Pos.x, y: circle1Pos.y });
        shadowList[1].position({
            x: Math.round(circle1Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle1Pos.y / blockSnapSize) * blockSnapSize
        });

        shadowList[0].position(circle2Pos);
        shadowList[0].points([0, 0, newX, newY]);
        const distanceToX = widthStage - blockSnapSize - circle1Pos.x;
        const distanceToY = heightStage - blockSnapSize - circle1Pos.y;

        moveElementsAttached(nodeOtherCircle, otherCircle.position(), distanceToX, distanceToY);
    })

    otherCircle.on("dragend", () => {
        if (!turnToRealDCLFlag) {
            const circle2Pos = beamCircle.getPosition();
            const shadowCircle1Pos = shadowList[1].getPosition();

            const newX = circle2Pos.x - shadowCircle1Pos.x;
            const newY = circle2Pos.y - shadowCircle1Pos.y;
            const angle = Math.atan2(newY, newX);

            beamLine.position(shadowCircle1Pos);
            beamLine.points([nodeRadius * Math.cos(angle), nodeRadius * Math.sin(angle), newX, newY]);
            otherCircle.position({
                x: shadowCircle1Pos.x,
                y: shadowCircle1Pos.y
            });

            const newNodePos = [shadowCircle1Pos.x, shadowCircle1Pos.y];
            dcl.findNodeById(otherCircle.getAttr("id")).setCoordinate(newNodePos);
            shadowList[0].position(beamLine.position());
            shadow.hide();

            const distanceToX = widthStage - blockSnapSize - otherCircle.getAttr("x");
            const distanceToY = heightStage - blockSnapSize - otherCircle.getAttr("y");

            moveElementsAttached(nodeOtherCircle, otherCircle.position(), distanceToX, distanceToY);
            updateEquations();
            calculateDifPro();
        }

    });

    beamCircle.on("dragstart", () => {
        if (!turnToRealDCLFlag) {
            shadow.show();
            shadow.moveToTop();
        }
    });

    beamCircle.on("dragmove", () => {
        if (!turnToRealDCLFlag) {
            const linePos = beamLine.getPosition();
            const circle2Pos = beamCircle.getPosition();

            const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
            const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize
            const angle = Math.atan2(newY, newX);

            beamLine.points([nodeRadius * Math.cos(angle), nodeRadius * Math.sin(angle), circle2Pos.x - linePos.x, circle2Pos.y - linePos.y])
            shadowList[0].points([0, 0, newX, newY])

            beamCircle.position({ x: circle2Pos.x, y: circle2Pos.y })
            shadowList[2].position({
                x: Math.round(circle2Pos.x / blockSnapSize) * blockSnapSize,
                y: Math.round(circle2Pos.y / blockSnapSize) * blockSnapSize
            });

            moveElementsAttached(nodeBeamCircle, beamCircle.position());
        }
    });

    beamCircle.on("dragend", () => {
        if (!turnToRealDCLFlag) {
            const linePos = beamLine.getPosition();
            const circle2Pos = beamCircle.getPosition();
            const shadowCircle2Pos = shadowList[2].getPosition();

            const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
            const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize
            const angle = Math.atan2(newY, newX);

            beamLine.points([nodeRadius * Math.cos(angle), nodeRadius * Math.sin(angle), newX, newY])
            beamCircle.position({
                x: shadowCircle2Pos.x,
                y: shadowCircle2Pos.y
            });

            const newNodePos = [shadowCircle2Pos.x, shadowCircle2Pos.y];
            dcl.findNodeById(beamCircle.getAttr("id")).setCoordinate(newNodePos);
            shadow.hide();

            const distanceToX = widthStage - blockSnapSize - circle2Pos.x;
            const distanceToY = heightStage - blockSnapSize - circle2Pos.y;

            moveElementsAttached(nodeBeamCircle, beamCircle.position(), distanceToX, distanceToY);
            updateEquations();
            calculateDifPro();
        }


    });
}

//------------------------------------------------------Links externos-----------------------------------------------//

function createFixedSupport(_node = null, rotation) {
    const colorStroke = "black"

    let x0;
    let y0;

    if (_node) {
        ID = _node.id;
        [x0, y0] = _node.coordinate;
        nodeParent = _node;
    } else {
        konvaElement = lastNodeClick;
        ID = konvaElement.getAttr("id");
        nodeParent = dcl.findNodeById(ID);
        x0 = lastBeamNodeClick.x
        y0 = lastBeamNodeClick.y

    }
    const large = blockSnapSize;
    const strokeVal = 5;

    const group = new Konva.Group({ id: ID, name: "fixedSupport", x: x0, y: y0 });
    const base = new Konva.Line({
        name: "subelement FixedSupport",
        x: 0,
        y: nodeRadius + strokeVal / 2,
        points: [-large / 2, 0, large / 2, 0],
        strokeWidth: 5,
        stroke: colorStroke
    });

    const l1 = new Konva.Line({ name: "subelement FixedSupport", x: -large / 2, y: nodeRadius + strokeVal / 2, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke });
    const l2 = new Konva.Line({ name: "subelement FixedSupport", x: -large / 2 + 12.5, y: nodeRadius + strokeVal / 2, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke });
    const l3 = new Konva.Line({ name: "subelement FixedSupport", x: -large / 2 + 25, y: nodeRadius + strokeVal / 2, points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke });
    //const l4 = new Konva.Line({name: "subelement FixedSupport",x: -large/2 +37.5, y: nodeRadius + strokeVal/2points: [0, 12.5, 12.5, 0], strokeWidth: 5, stroke: colorStroke});

    group.add(base, l1, l2, l3);

    paintIfMouseOver(base, nfillc, nstrokec, base.getAttr("fill"), base.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(l1, nfillc, nstrokec, l1.getAttr("fill"), l1.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(l2, nfillc, nstrokec, l2.getAttr("fill"), l2.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(l3, nfillc, nstrokec, l3.getAttr("fill"), l3.getAttr("stroke"), paintGroup = true);

    hideAllPanels();

    if (nodeParent.link === null) {
        nodeParent.setLink("fixedSupport");
        nodeParent.setKonvaLink(group);
        nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
        nodeParent.setLinkRotation(rotation);
        nodeNameList[indexOfNodeNames][1] = nodeParent.id;

    } else {

        if (_node) {
            nodeParent.setKonvaLink(group);
            nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
            nodeNameList[indexOfNodeNames][1] = nodeParent.id;
        } else {
            return;
        }
    }

    layer.add(group);


    indexOfNodeNames += 1;
    updateEquations();
    calculateDifPro();
    rotateKonvaObject(group, rotation);
    return group;
}

function createRollerSupport(_node = null, rotation) {
    let ID;
    let nodeParent;
    let x0;
    let y0;

    if (_node) {
        ID = _node.id;
        [x0, y0] = _node.coordinate;
        nodeParent = _node;
    } else {
        konvaElement = lastNodeClick;
        ID = konvaElement.getAttr("id");
        nodeParent = dcl.findNodeById(ID);
        x0 = lastBeamNodeClick.x
        y0 = lastBeamNodeClick.y

    }
    const large = 20; //blockSnapSize / 2;
    const strokeVal = 4;

    const group = new Konva.Group({ id: ID, name: "rollerSupport", x: x0, y: y0 });
    const triangle = new Konva.RegularPolygon({
        name: "subelement RollerSupport",
        x: 0,
        y: large + nodeRadius + strokeVal,
        sides: 3,
        radius: large,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4,
    });

    const base = new Konva.Line({
        name: "subelement RollerSupport",
        x: 0,
        y: 2 * large + nodeRadius + strokeVal,
        points: [-large, 0, large, 0],
        strokeWidth: 5,
        stroke: "black",
    });

    group.add(triangle, base);

    paintIfMouseOver(triangle, nfillc, nstrokec, triangle.getAttr("fill"), triangle.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(base, nfillc, nstrokec, triangle.getAttr("fill"), base.getAttr("stroke"), paintGroup = true);

    hideAllPanels();

    if (nodeParent.link === null) {
        nodeParent.setLink("rollerSupport");
        nodeParent.setKonvaLink(group);
        nodeParent.setLinkRotation(rotation);
        nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
        nodeNameList[indexOfNodeNames][1] = nodeParent.id;

    } else {

        if (_node) {
            nodeParent.setKonvaLink(group);
            nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
            nodeNameList[indexOfNodeNames][1] = nodeParent.id;
        } else {
            return;
        }
    }

    layer.add(group);

    indexOfNodeNames += 1;
    updateEquations();
    calculateDifPro();

    rotateKonvaObject(group, rotation);
    return group;
}

function createPinnedSupport(_node = null, rotation) {
    let ID;
    let nodeParent;
    let x0;
    let y0;

    if (_node) {
        ID = _node.id;
        [x0, y0] = _node.coordinate;
        nodeParent = _node;

    } else {
        konvaElement = lastNodeClick;
        ID = konvaElement.getAttr("id");
        nodeParent = dcl.findNodeById(ID);
        x0 = lastBeamNodeClick.x
        y0 = lastBeamNodeClick.y

    }

    const large = 20; //blockSnapSize / 2;
    const strokeVal = 4;

    const group = new Konva.Group({ id: ID, name: "pinnedSupport", x: x0, y: y0 });
    const triangle = new Konva.RegularPolygon({
        name: "subelement PinnedSupport",
        x: 0,
        y: large + nodeRadius + strokeVal,
        sides: 3,
        radius: large,
        fill: "#00F210",
        stroke: "black",
        strokeWidth: strokeVal,
    });

    group.add(triangle);

    paintIfMouseOver(triangle, nfillc, nstrokec, triangle.getAttr("fill"), triangle.getAttr("stroke"), paintGroup = false);

    hideAllPanels();

    if (nodeParent.link === null) {
        nodeParent.setLink("pinnedSupport");
        nodeParent.setKonvaLink(group);
        nodeParent.setLinkRotation(rotation);
        nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
        nodeNameList[indexOfNodeNames][1] = nodeParent.id;
    } else {

        if (_node) {
            nodeParent.setKonvaLink(group);
            nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
            nodeNameList[indexOfNodeNames][1] = nodeParent.id;
        } else {
            return;
        }
    }

    layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";

    indexOfNodeNames += 1;
    updateEquations();
    calculateDifPro();

    rotateKonvaObject(group, rotation);
    return group;
}

//------------------------------------------------------Links internos-----------------------------------------------//

function createBallJoint(_node = null) {
    let ID;
    let nodeParent;
    let x0;
    let y0;

    if (_node) {
        ID = _node.id;
        [x0, y0] = _node.coordinate;
        nodeParent = _node;
    } else {
        konvaElement = lastNodeClick;
        ID = konvaElement.getAttr("id");
        nodeParent = dcl.findNodeById(ID);
        x0 = lastBeamNodeClick.x
        y0 = lastBeamNodeClick.y

    }

    const group = new Konva.Group({ id: ID, name: "ballJoint", x: x0, y: y0 });
    const circle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: nodeRadius * 1.5,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        name: "subElement BallJoint"
    });

    group.add(circle);

    paintIfMouseOver(circle, nfillc, nstrokec, circle.getAttr("fill"), circle.getAttr("stroke"), paintGroup = false);

    if (nodeParent.link === null) {
        nodeParent.setLink("ballJoint");
        nodeParent.setKonvaLink(group);
        nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
        nodeNameList[indexOfNodeNames][1] = nodeParent.id;
    } else {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        if (_node) {
            nodeParent.setKonvaLink(group);
            nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
            nodeNameList[indexOfNodeNames][1] = nodeParent.id;
        } else {
            return;
        }
    }

    layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";

    indexOfNodeNames += 1;
    updateEquations();
    calculateDifPro();
    return group;
}

function createConnectingRod(_node = null) {
    let ID;
    let nodeParent;
    let x0;
    let y0;

    if (_node) {
        ID = _node.id;
        [x0, y0] = _node.coordinate;
        nodeParent = _node;
    } else {
        konvaElement = lastNodeClick;
        ID = konvaElement.getAttr("id");
        nodeParent = dcl.findNodeById(ID);
        x0 = lastBeamNodeClick.x
        y0 = lastBeamNodeClick.y

    }
    const group = new Konva.Group({ id: ID, name: "connectingRod", x: x0, y: y0 });
    const large = blockSnapSize;
    const line = new Konva.Line({
        name: "subelement ConnectingRod",
        x: 0,
        y: 0,
        points: [0, 0, large, 0],
        strokeWidth: 5,
        stroke: "black"
    });
    const circle1 = new Konva.Circle({
        name: "subelement ConnectingRod",
        x: 0,
        y: 0,
        radius: nodeRadius * 1.5,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
    });
    const circle2 = circle1.clone({
        x: 0 + large,
        y: 0
    });

    group.add(line, circle1, circle2);

    paintIfMouseOver(line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"), paintGroup = false);
    paintIfMouseOver(circle1, nfillc, nstrokec, circle1.getAttr("fill"), circle1.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(circle2, nfillc, nstrokec, circle2.getAttr("fill"), circle2.getAttr("stroke"), paintGroup = true);

    if (nodeParent.link === null) {
        nodeParent.setLink("connectingRod");
        nodeParent.setKonvaLink(group);
        nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
        nodeNameList[indexOfNodeNames][1] = nodeParent.id;

    } else {
        panel.style.visibility = "hidden";
        delPanel.style.visibility = "hidden";
        if (_node) {
            nodeParent.setKonvaLink(group);
            nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
            nodeNameList[indexOfNodeNames][1] = nodeParent.id;
        } else {
            return;
        }
    }

    layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";

    indexOfNodeNames += 1;
    updateEquations();
    calculateDifPro();

    return group;
}

//------------------------------------------------------Forces y moments-----------------------------------------------//

function createForce(valMagnitud, valAngle, color = "black", x0 = 0, y0 = 0, layerForPaint = layer, aux = "aux",typeForce) {
    let x0lastPos = lastBeamNodeClick.x
    let y0lasPos = lastBeamNodeClick.y

    let magnitud = valMagnitud;
    let angle = valAngle;
    
    let txt = magnitud + " " +typeForce+ ", " + angle + " °";

    let dragg = true;
    

    const large = largeForce;
    const strokeVal = strokeForce

    const lx = large * Math.cos(angle * Math.PI / 180)
    const ly = large * Math.sin(degToRad(angle))

    if (color != "black") {
        x0lastPos = x0;
        y0lasPos = y0;
        txt = valMagnitud;
        dragg = false;
    }

    const group = new Konva.Group({ tension: [magnitud, angle], name: "force", x: x0lastPos, y: y0lasPos });
    const arrow = new Konva.Arrow({
        x: (nodeRadius + strokeVal) * Math.cos(degToRad(angle)),
        y: -(nodeRadius + strokeVal) * Math.sin(degToRad(angle)),
        points: [lx, -ly, 0, 0],
        pointerLength: 15,
        pointerWidth: 15,
        fill: color,
        stroke: color,
        strokeWidth: strokeVal,
        draggable: dragg,
    });

    const magnitudValue = new Konva.Text({
        x: lx + 4,
        y: -ly,
        text: txt,
        fontSize: 15,
        fontFamily: "Impact",
        fill: color
    });

    group.add(arrow, magnitudValue);
    layerForPaint.add(group);

    paintIfMouseOver(arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);

    if (color == "black") {
        const konvaElement = lastNodeClick;
        const nodeParent = dcl.findNodeById(konvaElement.getAttr("id"));
        nodeParent.addForce(parseFloat(magnitud), parseFloat(angle));
        nodeParent.addTypeForce(typeForce);
        nodeParent.addKonvaForce(group);
        group.setAttr("id", konvaElement.getAttr("id"))
    }

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    modalForce.style.visibility = "hidden";

    forceMovement(group, 2 * blockSnapSize, strokeVal,typeForce)
    updateEquations();
    calculateDifPro();
    return group;
}

function forceMovement(group, large, strokeVal,typeForce) {
    const arrow = group.getChildren()[0];
    const magnitud = group.getChildren()[1];
    const magnitudVal = parseFloat(group.getAttr("tension")[0]);
    let angleVal = parseInt(group.getAttr("tension")[1]);

    let newAngle;
    arrow.on("dragmove", () => {
        if (!turnToRealDCLFlag) {
            const mouseXY = getXY();

            const x = mouseXY.x - group.getAttr("x");
            const y = mouseXY.y - group.getAttr("y");

            const a = Math.sqrt(large ** 2 / ((x) ** 2 + (y) ** 2));
            arrow.points([a * x, a * y, 0, 0]);

            newAngle = Math.round(radToDeg(Math.atan2(-y, x)));

            arrow.setAttr("x", (nodeRadius + strokeVal) * Math.cos(degToRad(newAngle)));
            arrow.setAttr("y", -(nodeRadius + strokeVal) * Math.sin(degToRad(newAngle)));

        arrow.setAttr("x", (nodeRadius + strokeVal) * Math.cos(degToRad(newAngle)))
        arrow.setAttr("y", -(nodeRadius + strokeVal) * Math.sin(degToRad(newAngle)))

        newAngle = prettyDeg(newAngle);

        let txt = magnitudVal + " " +typeForce+ ", " + newAngle  + " °";
        magnitud.setAttr("text", txt)
        magnitud.setAttr("x", a*x+10)
        magnitud.setAttr("y", a*y+10)

        }
    })

    arrow.on("dragend", () => {
        if (!turnToRealDCLFlag) {
            group.setAttr("tension", [magnitudVal, newAngle]);

            const node = dcl.findNodeById(group.getAttr("id"));

            const force = node.forces.find(force => {
                return force[0] == prettyDeg(magnitudVal) && force[1] == angleVal;
            })

            angleVal = newAngle;
            force[1] = newAngle;
            updateEquations();
            calculateDifPro();
        }
    })
}

function createMoment(val, color = "black", x0 = 0, y0 = 0, layerForPaint = layer, forFixedSupport = false,typeMoment) {
    let x0lastPos = lastBeamNodeClick.x
    let y0lastPos = lastBeamNodeClick.y

    let magnitud = val;
    let txt = magnitud + " " +typeMoment;

    if (color != "black") {
        x0lastPos = x0;
        y0lastPos = y0;
    }

    let listOfPoints;
    const positiveList = [17.68, 17.68, 18.63, 16.67, 19.53, 15.61, 20.36, 14.5, 21.14, 13.35, 21.85, 12.15, 22.49, 10.92, 23.06, 9.66, 23.56, 8.36, 23.99, 7.04, 24.34, 5.7, 24.62, 4.34, 24.82, 2.97, 24.95, 1.59, 25.0, 0.2, 24.97, -1.19, 24.87, -2.57, 24.69, -3.95, 24.43, -5.31, 24.1, -6.66, 23.69, -7.99, 23.21, -9.29, 22.66, -10.57, 22.04, -11.81, 21.35, -13.01, 20.59, -14.18, 19.77, -15.3, 18.89, -16.37, 17.96, -17.39, 16.96, -18.36, 15.92, -19.28, 14.82, -20.13, 13.68, -20.92, 12.5, -21.65, 11.28, -22.31, 10.02, -22.9, 8.74, -23.42, 7.42, -23.87, 6.09, -24.25, 4.73, -24.55, 3.36, -24.77, 1.98, -24.92, 0.59, -24.99, -0.79, -24.99, -2.18, -24.9, -3.56, -24.75, -4.93, -24.51, -6.28, -24.2, -7.61, -23.81, -8.92, -23.35, -10.2, -22.82, -11.46, -22.22, -12.67, -21.55, -13.85, -20.81, -14.98, -20.01, -16.07, -19.15, -17.11, -18.23, -18.09, -17.25, -19.02, -16.22, -19.89, -15.14, -20.7, -14.01, -21.45, -12.84, -22.13, -11.63, -22.74, -10.39, -23.28, -9.11, -23.75, -7.8, -24.15, -6.47, -24.47, -5.12, -24.72, -3.75, -24.89, -2.38, -24.98, -0.99, -25.0, 0.4, -24.94, 1.78, -24.8, 3.16, -24.58, 4.54, -24.3, 5.89, -23.93, 7.23, -23.49, 8.55, -22.98, 9.84, -22.4, 11.1, -21.75, 12.33, -21.03, 13.52, -20.25, 14.66, -19.4, 15.76, -18.5, 16.82, -17.54, 17.82, -16.52, 18.76, -15.45, 19.65, -14.34, 20.48, -13.18, 21.24, -11.98, 21.94, -10.74, 22.57, -9.48, 23.13, -8.18, 23.63, -6.85, 24.04, -5.51, 24.39, -4.15, 24.65, -2.77, 24.85, -1.39, 24.96, -0.0, 25.0]
    const negativeList = [-17.68, 17.68, -18.63, 16.67, -19.53, 15.61, -20.36, 14.5, -21.14, 13.35, -21.85, 12.15, -22.49, 10.92, -23.06, 9.66, -23.56, 8.36, -23.99, 7.04, -24.34, 5.7, -24.62, 4.34, -24.82, 2.97, -24.95, 1.59, -25.0, 0.2, -24.97, -1.19, -24.87, -2.57, -24.69, -3.95, -24.43, -5.31, -24.1, -6.66, -23.69, -7.99, -23.21, -9.29, -22.66, -10.57, -22.04, -11.81, -21.35, -13.01, -20.59, -14.18, -19.77, -15.3, -18.89, -16.37, -17.96, -17.39, -16.96, -18.36, -15.92, -19.28, -14.82, -20.13, -13.68, -20.92, -12.5, -21.65, -11.28, -22.31, -10.02, -22.9, -8.74, -23.42, -7.42, -23.87, -6.09, -24.25, -4.73, -24.55, -3.36, -24.77, -1.98, -24.92, -0.59, -24.99, 0.79, -24.99, 2.18, -24.9, 3.56, -24.75, 4.93, -24.51, 6.28, -24.2, 7.61, -23.81, 8.92, -23.35, 10.2, -22.82, 11.46, -22.22, 12.67, -21.55, 13.85, -20.81, 14.98, -20.01, 16.07, -19.15, 17.11, -18.23, 18.09, -17.25, 19.02, -16.22, 19.89, -15.14, 20.7, -14.01, 21.45, -12.84, 22.13, -11.63, 22.74, -10.39, 23.28, -9.11, 23.75, -7.8, 24.15, -6.47, 24.47, -5.12, 24.72, -3.75, 24.89, -2.38, 24.98, -0.99, 25.0, 0.4, 24.94, 1.78, 24.8, 3.16, 24.58, 4.54, 24.3, 5.89, 23.93, 7.23, 23.49, 8.55, 22.98, 9.84, 22.4, 11.1, 21.75, 12.33, 21.03, 13.52, 20.25, 14.66, 19.4, 15.76, 18.5, 16.82, 17.54, 17.82, 16.52, 18.76, 15.45, 19.65, 14.34, 20.48, 13.18, 21.24, 11.98, 21.94, 10.74, 22.57, 9.48, 23.13, 8.18, 23.63, 6.85, 24.04, 5.51, 24.39, 4.15, 24.65, 2.77, 24.85, 1.39, 24.96, 0.0, 25.0]

    if (magnitud < 0) {
        listOfPoints = negativeList;
        txt += " Nm";

    } else if (magnitud > 0) {
        listOfPoints = positiveList;
        txt += " Nm";

    } else {

        if (color != "black") {

            x0lastPos = x0;
            y0lastPos = y0;
            listOfPoints = positiveList;
            txt = magnitud;
        } else {
            return;
        }
    }


    const group = new Konva.Group({ name: "moment", tension: magnitud, x: x0lastPos, y: y0lastPos });
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: listOfPoints,
        pointerLength: 10,
        pointerWidth: 10,
        fill: color,
        stroke: color,
        strokeWidth: 4,
        name: "subelement",
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

    paintIfMouseOver(arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);

    if (color == "black") {
        const konvaElement = lastNodeClick;
        const nodeParent = dcl.findNodeById(konvaElement.getAttr("id"));
        nodeParent.addMoment(parseFloat(magnitud));
        nodeParent.addTypeMoment(typeMoment);
        nodeParent.addKonvaMoment(group);
        group.setAttr("id", konvaElement.getAttr("id"));
    }

    layer.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    modalMoment.style.visibility = "hidden";
    updateEquations();
    calculateDifPro();
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

function createButton(widthPanel, heightPanel, idNameText, btnText, efunction, image, inputMagnitud, inputAngle, element, selectObj, modal,selectType) {
    const btn = document.createElement("button");
    btn.type = "button";

    if (image) {
        btn.style.backgroundImage = image;
    }

    btn.style.width = widthPanel + "px";
    btn.style.height = heightPanel + "px";
    btn.style.backgroundSize = "cover"; // todo en button
    btn.id = idNameText;

    if (idNameText == "changeOriginBtn" || idNameText == "modalRotationBtn") {
        btn.style.backgroundColor = "#99D9EA";
        btn.innerText = btnText;
    }
    btn.addEventListener("dblclick", () => {

        if (idNameText == "beamBtn") {
            efunction();
        } else if (idNameText == "forceBtn") {
            efunction(inputMagnitud.value, inputAngle.value,"black",0,0,layer,"aux",selectType.value);
        } else if (idNameText == "momentBtn") {
            efunction(inputMagnitud.value,"black",0,0,layer,"aux",selectType.value)
        } else if (idNameText == "deleteElementBtn") {
            efunction(element);
        } else if (idNameText == "modalRotationBtn") {
            efunction(null, rotation = selectObj.value);
        } else if (idNameText == "modalBtn") {
            efunction(modal);
        } else if (idNameText == "AngleBtn") {
            efunction();
        } else  {
            efunction();
        }

    });
    return btn;
}

function createSelectTypeForce(idParam, widthPanel, heightPanel) {
    const select = document.createElement("select");
    select.style.width = widthPanel/3 + "px";
    select.style.height = heightPanel + "px";
    select.setAttribute("id", idParam);

    const optionNewtons = document.createElement("option");
    const optionKips = document.createElement("option");
    const optionKiloNewtons = document.createElement("option");
    
    optionNewtons.value = "N";
    optionKips.value = "kip";
    optionKiloNewtons.value = "kN";
    
    optionNewtons.innerText = "Newtons (N)";
    optionKips.innerText ="KIPS (kip)" ;
    optionKiloNewtons.innerText = "Kilo Newtons (kN)";
    
    select.appendChild(optionKips);
    select.appendChild(optionKiloNewtons);
    select.appendChild(optionNewtons);
    return select;
}

function createSelectTypeMoment(idParam, widthPanel, heightPanel){

    const select = document.createElement("select");
    select.style.width = widthPanel/1.5 + "px";
    select.style.height = heightPanel + "px";
    select.setAttribute("id", idParam);

    const optionNewtons = document.createElement("option");
    const optionKips = document.createElement("option");
    const optionKiloNewtons = document.createElement("option");
    
    optionNewtons.value = "N-m";
    optionKips.value = "kip-ft";
    optionKiloNewtons.value = "kN-m";
    
    optionNewtons.innerText = "Newtons-meters (N-m)";
    optionKips.innerText ="KIPS-feet (kip-ft)" ;
    optionKiloNewtons.innerText = "Kilo Newtons-meters (kN-m)";
    
    select.appendChild(optionKips);
    select.appendChild(optionKiloNewtons);
    select.appendChild(optionNewtons);
    return select;
}



function createInputMagnitud(idParam, widthPanel, heightPanel) {
    const input = document.createElement("input");
    input.type = "number";
    input.setAttribute("id", idParam);
    input.value = "1"
    input.style.width = widthPanel / 7 + "px";
    input.style.height = heightPanel - 6 + "px";

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
    input.style.height = heightPanel - 6 + "px";

    return input;
}

function createContainer(list) {
    const container = document.createElement("div");
    container.style.display = "flex";
    list.forEach(element => {
        container.appendChild(element);
    });

    return container;
}

function createPanel(x0, y0) {
    const widthPanel = 240;
    const heightPanel = 120;
    const colorPanel = "#DDDDDD";

    const heightPanelElement = heightPanel / 4;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + y0 + "px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "hidden";
    panel.style.zIndex = "1000";

    const imgRollerSupport = "url(images/rollerSupport.png)";
    const imgPinnedSupport = "url(images/pinnedSupport.png)";
    const imgConnectingRod = "url(images/connectingRod.png)";
    const imgBallJoint = "url(images/ballJoint.png)";
    const imgMoment = "url(images/moment.png)";
    const imgForce = "url(images/force.png)";
    const imgFixedSupport = "url(images/fixedSupport.png)";
    const imgBeam = "url(images/beam.png)";

    const btnRollerSupport = createButton(widthPanel / 2, heightPanelElement, "modalBtn", "Roller support ", showModal, image = imgRollerSupport, null, null, null, null, modal = modalRollerSupport);
    const btnPinnedSupport = createButton(widthPanel / 2, heightPanelElement, "modalBtn", "Pinned support", showModal, image = imgPinnedSupport, null, null, null, null, modal = modalPinnedSupport);
    const btnFixedSupport = createButton(widthPanel / 2, heightPanelElement, "modalBtn", "Fixed support", showModal, image = image = imgFixedSupport, null, null, null, null, modal = modalFixedSupport);
    const btnBallJoint = createButton(widthPanel / 2, heightPanelElement, "ballJointBtn", "Ball joint", createBallJoint, image = imgBallJoint);
    const btnConnectingRod = createButton(widthPanel / 2, heightPanelElement, "connectingRodBtn", "Connecting rod", createConnectingRod, image = imgConnectingRod);
    const btnForce = createButton(widthPanel / 2, heightPanelElement, "modalBtn", "Force", showModal, image = imgForce, null, null, null, null, modalForce);
    const btnMoment = createButton(widthPanel / 2, heightPanelElement, "modalBtn", "Moment", showModal, image = imgMoment, null, null, null, null, modalMoment);
    const btnBeam2 = createButton(widthPanel / 2, heightPanelElement, "beam2btn", "Beam", createBeam2, image = imgBeam);
    const btnChangeOrigin = createButton(widthPanel / 2, heightPanelElement, "changeOriginBtn", "Nuevo origen", changeOrigin);

    const topOfPanel = document.createElement("div");
    topOfPanel.style.width = widthPanel;
    topOfPanel.style.height = heightPanelElement;
    topOfPanel.style.backgroundColor = colorPanel;
    topOfPanel.style.border = "2px";
    topOfPanel.style.borderBlockColor = "black";
    topOfPanel.innerText = "Elementos ";
    topOfPanel.align = "center";

    panel.appendChild(topOfPanel);
    panel.appendChild(btnBeam2)
    panel.appendChild(btnRollerSupport);
    panel.appendChild(btnPinnedSupport)
    panel.appendChild(btnFixedSupport);
    panel.appendChild(btnBallJoint);
    panel.appendChild(btnConnectingRod);
    panel.appendChild(btnForce);
    panel.appendChild(btnMoment);
    panel.appendChild(btnChangeOrigin)

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

    document.addEventListener("mouseup", function () {
        isDown = false;
    });

    document.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if (isDown) {
            mousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            panel.style.left = (mousePosition.x + offset[0]) + "px";
            panel.style.top = (mousePosition.y + offset[1]) + "px";
        }
    });

    return mousePosition;
}

function movePanelTo(panelParam, x, y) {
    if (panelParam != delPanel) {
        panelParam.style.left = getOffset(divKonvaContainer).left + x + "px";
        panelParam.style.top = getOffset(divKonvaContainer).top + y + "px";

    } else {
        panelParam.style.left = getOffset(divKonvaContainer).left + x - panelParam.offsetWidth + "px";
        panelParam.style.top = getOffset(divKonvaContainer).top + y + "px";

    }

}

function getXY() {
    const mouseXY = stage.getPointerPosition();
    if (mouseXY) {
        return { x: mouseXY.x, y: mouseXY.y };

    } else {
        console.log("Fallo en getXY()");
        return { x: 800, y: 800 };
    }
}

function roundXY(mouseXY) {
    const { x, y } = mouseXY;
    const X = Math.round(x / blockSnapSize) * blockSnapSize;
    const Y = Math.round(y / blockSnapSize) * blockSnapSize;
    return { x: X, y: Y };
}

//------------------------------------------------------Puntaje-----------------------------------------------//

function createScorePanel(x0, y0) {
    const widthPanel = 240;
    const heightPanel = 40;
    const colorPanel = "#DDDDDD";

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
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

function radToDeg(rad) {
    return rad / Math.PI * 180;
}

function prettyDeg(deg) {
    if (deg < 0) {
        return 360 + deg;
    }

    return deg;
}

function listenCreateElement() {
    stage.on("dblclick", (e) => {
        if (e.target != stage && e.target && !turnToRealDCLFlag) {
            const mouseXY = roundXY(getXY());
            lastBeamNodeClick.x = mouseXY.x;
            lastBeamNodeClick.y = mouseXY.y;
            lastNodeClick = e.target;
            const nodeParent = dcl.findNodeById(lastNodeClick.getAttr("id"))
            console.log(nodeParent)
            console.log(e.target.getParent())

            if (e.target.name() == "subElementBeamCircle1") {
                panel.style.visibility = "visible";
                movePanelTo(panel, mouseXY.x, mouseXY.y);

            } else if (e.target.name() == "subElementBeamCircle2") {
                panel.style.visibility = "visible";
                movePanelTo(panel, mouseXY.x, mouseXY.y);

            } else if (e.target.name() == "subElementBeamCircle") {
                panel.style.visibility = "visible";
                movePanelTo(panel, mouseXY.x, mouseXY.y);

            }

        }
    });
}

function destroyAttachedKonvaElements(node) {
    if (node.konvaObjects.beam) node.konvaObjects.beam.destroy();
    if (node.konvaObjects.shadowBeam) node.konvaObjects.shadowBeam.destroy();
    if (node.konvaObjects.link) node.konvaObjects.link.destroy();
    if (node.konvaObjects.circle) node.konvaObjects.circle.destroy();

    node.konvaObjects.forces.forEach(force => {
        force.destroy();
    })
    node.konvaObjects.moments.forEach(moment => {
        moment.destroy();
    })
}

function deleteElement(element) {
    if (element.name() === "beam2") {
        const node = dcl.findNodeById(element.getAttr("id") + 2) //element es el group del objeto, 
        const parentNode = node.parent
        const idx = parentNode.childNodes.findIndex(child => {
            child.id === node.id
        })
        parentNode.childNodes.splice(idx, 1);

        x_reference.deletePoint(node.konvaObjects.circle)
        y_reference.deletePoint(node.konvaObjects.circle)

        node.getAllDecendents().forEach(decendent => {
            destroyAttachedKonvaElements(decendent);
            x_reference.deletePoint(decendent.konvaObjects.circle);
            y_reference.deletePoint(decendent.konvaObjects.circle);
       
            delete decendent;
        })

      

        destroyAttachedKonvaElements(node);
        delete node;

    } else {
        const node = dcl.findNodeById(element.getAttr("id"))
        const supports = new Set(["rollerSupport", "pinnedSupport", "fixedSupport", "ballJoint", "connectingRod"]);

        if (supports.has(element.name())) {
            node.deleteLink();

        } else if (element.name() === "force") {
            const tuple = element.getAttr("tension");
            const floatTuple = [parseFloat(tuple[0]), parseFloat(tuple[1])];
            const idx = idxForceInNode(node.forces, floatTuple)
            node.forces.splice(idx, 1)

        } else if (element.name() === "moment") {
            const val = parseFloat(element.getAttr("tension"))
            const idx = node.moments.indexOf(val)
            node.moments.splice(idx, 1)
        }


    }

    element.destroy();
    delete element;

    recalculateNodeNames();
    updateEquations();
    calculateDifPro();
}



function listenAngleReference(){
    stage.on("dblclick", (e) => {
        if (e.target && e.target.getParent()) {
            const element = e.target.getParent();
            const name = element.name();
            if (name == "force" ) {
                
                const mouseXY = roundXY(getXY());
                lastElementClick = element;
                anglePanel.style.visibility = "visible";
                movePanelTo(anglePanel, mouseXY.x-240, mouseXY.y+15);

            }
        }
    });

}




function listenDeleteElement() {
    stage.on("dblclick", (e) => {
        if (e.target && e.target.getParent() && !turnToRealDCLFlag) {
            const element = e.target.getParent();
            const name = element.name();
            if (name == "beam" ||
                name == "rollerSupport" ||
                name == "pinnedSupport" ||
                name == "fixedSupport" ||
                name == "ballJoint" ||
                name == "connectingRod" ||
                name == "force" ||
                name == "moment" ||
                name == "beam2") {

                const mouseXY = roundXY(getXY());
                lastElementClick = element;
                delPanel.style.visibility = "visible";
                movePanelTo(delPanel, mouseXY.x, mouseXY.y+15);
            }
        }
    });
}

function hideAllPanels() {
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    modalForce.style.visibility = "hidden";
    modalMoment.style.visibility = "hidden";
    modalFixedSupport.style.visibility = "hidden";
    modalRollerSupport.style.visibility = "hidden";
    modalPinnedSupport.style.visibility = "hidden";
    anglePanel.style.visibility = "hidden";
}

function listenHiddePanels() {
    stage.on("click", () => {
        hideAllPanels();
    });
}

function updateCounts() {
    stage.find((element) => {
        if (element.name() == "fixedSupport") countFixedSupport += 1;
        else if (element.name() == "rollerSupport") countRollerSupport += 1;
        else if (element.name() == "fixedSupport") countFixedSupport += 1;
    });
}

//------------------------------------------------------Delete panel-----------------------------------------------//
function delElement() {
    deleteElement(lastElementClick);
    hideAllPanels();
}
function listenAngleCreated(konvaArc){
    stage.on("click", () => {
        if (konvaArc) {
            konvaArc.destroy();
        }
      });

    }

function listenArrowRotation(konvaArc,arrow){
    console.log("olassdfdsfk");
    arrow.on("dragend", () => {
        konvaArc.clockwise(true);
        if (arrow.getAttr("tension")[1] > 180 && arrow.getAttr("tension")[1]) {
            konvaArc.clockwise(false);
          }
        konvaArc.angle(360-arrow.getAttr("tension")[1]);
        
      });
}
function createAngleReference(){
    
    console.log(lastElementClick.getAttr("tension")[1]);
    const forceObject = lastElementClick
    angle = forceObject.getAttr("tension")[1];




    var arc = new Konva.Arc({
        x: forceObject.getAttr("x"),
        y: forceObject.getAttr("y"),
        innerRadius: 45,
        outerRadius: 50,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
        angle: 360-angle,
        rotation: 0,
        clockwise: true
      });
      if (angle > 180) {
        arc.clockwise(false);
      }



      layer.add(arc);
      
    anglePanel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    listenArrowRotation(arc,forceObject);
    listenAngleCreated(arc);
}



function createDelPanel(x0 = 0, y0 = 0) {
    const widthPanel = 120;
    const heightPanel = 30;
    const colorPanel = "#DDDDDD";
    const imgDelete = "url(images/delete.png)";

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + y0 + "px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "hidden";
    panel.style.zIndex = "1001";

    const deleteElementBtn = createButton(widthPanel, heightPanel, "delElementBtn", "Delete", delElement, image = imgDelete);

    panel.appendChild(deleteElementBtn);

    return panel;
}

function createAngleReferencePanel(x0 = 0, y0 = 0){
    const widthPanel = 120;
    const heightPanel = 30;
    const colorPanel = "#DDDDDD";
    const imgDelete = "url(images/referenceAngle.png)";

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + y0 + "px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "hidden";
    panel.style.zIndex = "1001";

    const angleElementBtn = createButton(widthPanel, heightPanel, "AngleBtn", "AngleReference", createAngleReference, image=imgDelete);

    panel.appendChild(angleElementBtn);

    return panel;
}






function createHashElements(stage) {
    const hash = {
        initialBeam: [],
        beams: [],
        rollerSupports: [],
        pinnedSupports: [],
        fixedSupports: [],
        connectingRods: [],
        ballJoints: [],
        forces: [],
        momentsPositivos: [],
        momentsNegativos: []
    }

    const layer = stage.find(element => {
        return element.name() == "layer";
    })[0];

    layer.getChildren().forEach(element => {
        if (element.name() == "initialBeam") {
            hash.initialBeam.push(element);

        } else if (element.name() == "beam") {
            hash.beams.push(element);

        } else if (element.name() == "rollerSupport") {
            hash.rollerSupports.push(element);

        } else if (element.name() == "pinnedSupport") {
            hash.pinnedSupports.push(element);

        } else if (element.name() == "fixedSupport") {
            hash.fixedSupports.push(element);

        } else if (element.name() == "connectingRod") {
            hash.connectingRods.push(element);

        } else if (element.name() == "ballJoint") {
            hash.ballJoints.push(element);

        } else if (element.name() == "force") {
            hash.forces.push(element);

        } else if (element.name() == "moment-positivo") {
            hash.momentsPositivos.push(element);

        } else if (element.name() == "moment-negativo") {
            hash.momentsNegativos.push(element);
        }
    });

    return hash;
}

function getStartEndBeam(beam) {
    const circle1 = beam.getChildren()[1];
    const circle2 = beam.getChildren()[2];
    const c1x = circle1.getAttr("x");
    const c1y = circle1.getAttr("y");
    const c2x = circle2.getAttr("x");
    const c2y = circle2.getAttr("y");

    return { start: [c1x, c1y], end: [c2x, c2y] };
}

function getElementPos(element) {
    const X = element.getAttr("x");
    const Y = element.getAttr("y");

    return [X, Y];
    return { x: X, y: Y };
}

function comparePositions(list1, list2) {
    return JSON.stringify(list1) === JSON.stringify(list2);
}

function compareforces(tension1, tension2) {
    return JSON.stringify(tension1) === JSON.stringify(tension2);
}

function hashOfErros() {
    return {
        ERRORinitialBeam: new Set(),
        ERRORbeams: new Set(),
        ERRORrollerSupports: new Set(),
        ERRORpinnedSupports: new Set(),
        ERRORfixedSupports: new Set(),
        ERRORconnectingRods: new Set(),
        ERRORballJoints: new Set(),
        ERRORforces: new Set(),
        ERRORmomentsPositivos: new Set(),
        ERRORmomentsNegativos: new Set()
    }

}

function showHints() {
    compare(stage, stageSolution);
    let txt = "";
    console.log(ERRORS);
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

function idxForceInNode(nodeForces, myForce) {
    for (let i = 0; i < nodeForces.length; i++) {
        if (nodeForces[i][0] == myForce[0] && nodeForces[i][1] == myForce[1]) {
            return i;
        }
    }
    console.log("index not found")
    return;
}

function removeAttributesForJSON(node) {
    delete node.parent;
    delete node.konvaObjects;

}

function paintElement(element, fillc, strokec, paintGroup) {
    if (element.getAttr("fill")) element.setAttr("fill", fillc);
    if (element.getAttr("stroke")) element.setAttr("stroke", strokec);

    if (paintGroup) {
        element.getParent().getChildren().forEach(e => {
            if (e.getAttr("fill")) e.setAttr("fill", fillc);
            if (e.getAttr("stroke")) e.setAttr("stroke", strokec);
        })
    }
}

function paintIfMouseOver(element, nfillc, nstrokec, ofillc, ostrokec, paintGroup = false) {

    element.on("mouseenter", () => {
        let nfillcDef = nfillc;
        let nstrokecDef = nstrokec;

        if (element.name() === "subElementBeamCircle" || element.name() === "subElementBeamCircle1" || element.name() === "subElementBeamCircle2") {
            const NODE = dcl.findNodeById(element.getAttr("id"))

            if (NODE.isOrigin) {
                nfillcDef = originColorMouseOver;
                nstrokecDef = originColorMouseOver;

            } else {
                nfillcDef = nfillc;
                nstrokecDef = nstrokec;
            }
        }
        paintElement(element, nfillcDef, nstrokecDef, paintGroup);
        stage.container().style.cursor = 'pointer';
    })

    element.on("mouseleave", () => {
        let ofillcDef = ofillc;
        let ostrokecDef = ostrokec;

        if (element.name() === "subElementBeamCircle" || element.name() === "subElementBeamCircle1" || element.name() === "subElementBeamCircle2") {
            const NODE = dcl.findNodeById(element.getAttr("id"))

            if (NODE.isOrigin) {
                ofillcDef = originColor;
                ostrokecDef = originColor;

            } else {
                ofillcDef = nodeColor;
                ostrokecDef = nodeColor;
            }
        }

        paintElement(element, ofillcDef, ostrokecDef, paintGroup);
        stage.container().style.cursor = 'default';
    })
}

function generateGrid(layer) {
    for (let i = 0; i <= widthStage / blockSnapSize; i++) {
        layer.add(new Konva.Line({
            name: "horizontalLine",
            points: [Math.round(i * blockSnapSize) + 0.5, 0, Math.round(i * blockSnapSize) + 0.5, heightStage],
            stroke: "#777777",
            strokeWidth: 1,
        }));
    }

    for (let j = 0; j <= heightStage / blockSnapSize; j++) {
        layer.add(new Konva.Line({
            name: "verticalLine",
            points: [0, Math.round(j * blockSnapSize), widthStage, Math.round(j * blockSnapSize)],
            stroke: "#7777777",
            strokeWidth: 0.5,
        }));
    }
}

function createModalForce(x0, y0) {

    const widthModal = 150;
    const heightModal = 100;

    const colorModal = "#DDDDDD";

    const heightModalElement = heightModal / 3;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    modal.style.top = divKonvaContainer.getBoundingClientRect().left + y0 + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = colorModal;
    modal.style.borderColor = "black";
    modal.style.border = "40px";
    modal.style.visibility = "hidden";
    modal.style.zIndex = "1000";

    const inputCreateForceMagnitud = createInputMagnitud("input-create-force", widthModal, heightModalElement);
    const inputCreateForceAngle = createInputAngle("input-create-force-angle", widthModal, heightModalElement);
    const selectTypeForce = createSelectTypeForce("select-type-force",widthModal, heightModalElement);
   

    const btnForce = createButton(widthModal / 2, heightModalElement, "forceBtn", "Force", createForce,null, inputMagnitud=inputCreateForceMagnitud, inputAngle=inputCreateForceAngle,null,null,null,selectTypeForce);
    
    
    const newtons = document.createElement("b");
    newtons.innerText = selectTypeForce.value;
    newtons.type = "number";
    newtons.style.width = widthModal / 4 + "px";
    newtons.style.height = heightModal - 6 + "px";

    const grados = document.createElement("b");
    grados.innerText = "º";
    grados.type = "number";
    grados.style.width = widthModal / 4 + "px";
    grados.style.height = heightModal - 6 + "px";
    
    const containerForce = createContainer([selectTypeForce,inputCreateForceMagnitud, inputCreateForceAngle, grados]);
    
    const topOfModal = document.createElement("div");
    topOfModal.style.width = widthModal;
    topOfModal.style.height = heightModalElement;
    topOfModal.style.backgroundColor = colorModal;
    topOfModal.style.border = "2px";
    topOfModal.style.borderBlockColor = "black";
    topOfModal.innerText = "Fuerza";
    topOfModal.align = "center";

    btnForce.innerText = "Crear";
    modal.appendChild(topOfModal);
    modal.appendChild(containerForce);
    //modal.appendChild(select);
    modal.appendChild(btnForce);

    return modal;
}

function createModalMoment(x0, y0) {

    const widthModal = 150;
    const heightModal = 100;

    const colorModal = "#DDDDDD";

    const heightModalElement = heightModal / 3;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    modal.style.top = divKonvaContainer.getBoundingClientRect().left + y0 + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = colorModal;
    modal.style.borderColor = "black";
    modal.style.border = "40px";
    modal.style.visibility = "hidden";
    modal.style.zIndex = "1000";

    const inputCreateMoment = createInputMagnitud("input-create-moment", widthModal * 2, heightModalElement); // width panel*2
    const selectTypeMoment = createSelectTypeMoment("select-type-moment", widthModal, heightModalElement);


    const btnMoment = createButton(widthModal / 2, heightModalElement, "momentBtn", "Moment", createMoment,null, inputMagnitude=inputCreateMoment,null,null,null,null,selectTypeMoment);

    const newtonsMetro = document.createElement("b");
    newtonsMetro.innerText = "Nm";
    newtonsMetro.type = "number";
    newtonsMetro.style.width = widthModal / 4 + "px";
    newtonsMetro.style.height = heightModal - 6 + "px";

    const containerForce = createContainer([selectTypeMoment,inputCreateMoment]);

    const topOfModal = document.createElement("div");
    topOfModal.style.width = widthModal;
    topOfModal.style.height = heightModalElement;
    topOfModal.style.backgroundColor = colorModal;
    topOfModal.style.border = "2px";
    topOfModal.style.borderBlockColor = "black";
    topOfModal.innerText = "Momento";
    topOfModal.align = "center";

    btnMoment.innerText = "Crear";
    modal.appendChild(topOfModal);
    modal.appendChild(containerForce);
    modal.appendChild(btnMoment);

    return modal;
}

function jsonToObject(json) {
    const object = JSON.parse(json);
    return object;
}

function createNodeWithObject(object, _id) {
    const node = new Node(null, id = _id);
    node.setIsOrigin(true);
    node.setNodeWithObject(object, node.id);
    return node;
}

function recreateDcl(json) {
    const object = jsonToObject(json);
    const newDCL = createNodeWithObject(object, object.id);
    return newDCL;
}

function getDate() {
    const d = new Date;
    const dmy = [
        d.getDate(),
        d.getMonth() + 1,
        d.getFullYear()
    ];

    const hms = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ]

    const date = dmy.join('/') + ' ' + hms.join(':');
    return date;
}

function drawLink(node) {
    const rotation = parseInt(node.linkRotation);
    if (node.link === "rollerSupport") {
        createRollerSupport(node, rotation);
    } else if (node.link === "pinnedSupport") {
        createPinnedSupport(node, rotation);
    } else if (node.link === "fixedSupport") {
        createFixedSupport(node, rotation);
    } else if (node.link === "ballJoint") {
        createBallJoint(node), rotation;
    } else if (node.link === "connectingRod") {
        createConnectingRod(node, rotation);
    }
}

function drawForces(node) {
    node.forces.forEach(force=>{
        if (force !=null){
        createForceEditTask(force[0],force[1],"black",0,0,node,layer,"aux",node.typeForce);
        }
    })

}

function drawMoments(node) {

    node.moments.forEach(moment => {
        if (moment != null) {
            createMomentEditTask(moment, "black", node.coordinate[0], node.coordinate[1], node);
        }
    })

}


function calculateDificulty(force,moment,reactions) {
    // .getAttr("tension")[1] angulo de la fuerza
    // se le pasa la fuerza ya calculada con su tipo de fuerza
    return force + 0.05*moment + 3*reactions;
}

function calculateDifPro(){
    let forcesSum = 0;
    let momentsSum = 0;
    let linkSum = 0;

    const allNodes = [dcl, ...dcl.getAllDecendents()]
    const nodesInitialBeam = allNodes.slice(0, 2)
    const otherNodes = allNodes.slice(2)

    originNodeY = nodesInitialBeam[0].coordinate[1];
    nodesInitialBeam.forEach(node => {
        
        // contando fuerzas, apoyos y momentos
        node.forces.forEach(force=>{
            if ((force[1]%90) !=0){
                forcesSum += 0.3;
                
                
            }
            else{
                forcesSum +=0.1;

            }
            if(originNodeY-node.coordinate[1]!=0){
                forcesSum += 0.3;
            }
        })

         node.moments.forEach(force=>{
           
            momentsSum += 1;
        })

        if(node.konvaObjects.link){
            linkSum++;
        }
    })
    

    otherNodes.forEach(node => {
        // contando fuerzas, apoyos y momentos
        node.forces.forEach(force=>{
            
            if ((force[1]%90) !=0){
                forcesSum += 0.3;
            }
            else{
                forcesSum +=0.1;

            }
            if(originNodeY-node.coordinate[1]!=0){
                forcesSum += 0.3;
            }
        })

         node.moments.forEach(moment=>{
           
            momentsSum += 1;
        })

        if(node.konvaObjects.link){
            if (node.link === "pinnedSupport") {
                linkSum+=2
            }
            if (node.link === "fixedSupport") {
                linkSum+=3
            }
            if (node.link === "rollerSupport") {
                linkSum+=1
            }
        }
    })
    const dificulty =  calculateDificulty(forcesSum,momentsSum,linkSum);
    console.log("PROPROROROOR: " + dificulty);
    const pDificulty = document.querySelector("#dificultad");
 
    pDificulty.innerText = "Dificultad: " + dificulty;
    
   
    
    
    

}



function drawDCL() {


    const allNodes = [dcl, ...dcl.getAllDecendents()]

    const nodesInitialBeam = allNodes.slice(0, 2)
    const otherNodes = allNodes.slice(2)

    let [x0, y0] = nodesInitialBeam[0].coordinate;
    let [x1, y1] = nodesInitialBeam[1].coordinate;

    const initialBeam = createBeam(
        nameBeam = "initialBeam",
        _id = nodesInitialBeam[1].id,
        coordinates = [
            [x0, y0],
            [x1 - x0, y1 - y0]
        ],
        _node = nodesInitialBeam[1]
    )[1];

    
    initialBeam.getChildren()[1].setAttr("fill", nodeColor);
    
    const shadowBeam = createShadowBeam(x0, y0, x1 - x0, y1 - y0);
    shadowBeam.hide();
    listenNodeMovement(initialBeam, shadowBeam, "initialBeam");
    
    drawLink(nodesInitialBeam[0]);
    drawLink(nodesInitialBeam[1]);


    nodesInitialBeam.forEach(node => {
        drawForces(node);
        drawMoments(node);

    })


    otherNodes.forEach(node => {
        createBeam2(node, node.parent)
        drawLink(node);
        drawForces(node);
        drawMoments(node);
    })

    
    

    dcl.findOriginNode().konvaObjects.circle.setAttr("fill", originColor);

    //creacion de linea grande horizontal de metros//
    const HorizontalLinePlace = Math.max(...yCoord) + 100;
    const horizontalLine = new Konva.Line({
        x: 0,
        y: 0,
        points: [Math.min(...xCoord), heightStage - blockSnapSize, Math.max(...xCoord), heightStage - blockSnapSize],
        stroke: 'red',
        strokeWidth: 6,
        tension: 0
    });


    const group = new Konva.Group({ name: "meters", tension: 0, x: 0, y: 0 });
    group.add(horizontalLine);
    layer.add(group);
    ///////

    //creacion de linea grande vertical de metros//
    const verticalLine = new Konva.Line({
        x: 0,
        y: 0,
        points: [widthStage - blockSnapSize, Math.min(...yCoord), widthStage - blockSnapSize, Math.max(...yCoord)],
        stroke: 'red',
        strokeWidth: 6,
        tension: 0
    });

    layer.add(verticalLine);
    ///////

    const xCoordSorted = xCoord.sort(function (a, b) { return a - b });
    const yCoordSorted = yCoord.sort(function (a, b) { return a - b });
    drawHorizontalMeters(xCoordSorted);
    drawVerticalMeters(yCoordSorted);

}

function drawVerticalLinesIndexes(xCoordinate) {
    lineLenght = 10;
    const line = new Konva.Line({
        x: 0,
        y: 0,
        points: [xCoordinate, heightStage - blockSnapSize + lineLenght, xCoordinate, heightStage - blockSnapSize - lineLenght],
        stroke: 'red',
        strokeWidth: 6,
        tension: 0
    });


    const group = new Konva.Group({ name: "meters", tension: 0, x: 0, y: 0 });
    group.add(line);
    layer.add(group);

}

function drawHorizontalLinesIndexes(yCoordinate) {
    lineLenght = 10;
    const line = new Konva.Line({
        x: 0,
        y: 0,
        points: [widthStage - blockSnapSize + lineLenght, yCoordinate, widthStage - blockSnapSize - lineLenght, yCoordinate],
        stroke: 'red',
        strokeWidth: 6,
        tension: 0
    });


    const group = new Konva.Group({ name: "meters", tension: 0, x: 0, y: 0 });
    group.add(line);
    layer.add(group);

}

function drawSegmentedLinesHorizontal(node) {
    const line = new Konva.Line({
        id: node.id,
        x: node.coordinate[0],
        y: node.coordinate[1],
        points: [0, 0, widthStage - blockSnapSize - node.coordinate[0], 0],
        stroke: 'red',
        strokeWidth: 2,
        dash: [10, 4]
    });

    layer.add(line);
    return line;

}

function drawSegmentedLinesVertical(node) {

    const line = new Konva.Line({
        id: node.id,
        x: node.coordinate[0],
        y: node.coordinate[1],
        points: [0, 0, 0, heightStage - blockSnapSize - node.coordinate[1]],
        stroke: 'red',
        strokeWidth: 2,
        dash: [10, 4]
    });

    layer.add(line);
    return line;


}

function drawHorizontalMeters(xCoordSorted) {
    const maxValue = Math.max(...xCoordSorted);
    const offSet = 8;
    for (var i = 0; i < xCoordSorted.length; i++) {


        if (xCoordSorted[i] != maxValue) {
            const segmentsAverage = (xCoordSorted[i] + xCoordSorted[i + 1]) / 2
            const meters = (xCoordSorted[i + 1] - xCoordSorted[i]) / 40
            if (meters != 0) {
                const metersText = new Konva.Text({
                    x: segmentsAverage - offSet,
                    y: heightStage - blockSnapSize + 10,
                    text: meters + "m",
                    fontSize: 15,
                    fontFamily: "Impact",
                    fill: "black"
                });
                layer.add(metersText);
            }
        }
    }
}

function drawVerticalMeters(yCoordSorted) {
    const maxValue = Math.max(...yCoordSorted);
    const offSet = 8;
    for (var i = 0; i < yCoordSorted.length; i++) {


        if (yCoordSorted[i] != maxValue) {
            const segmentsAverage = (yCoordSorted[i] + yCoordSorted[i + 1]) / 2
            const meters = (yCoordSorted[i + 1] - yCoordSorted[i]) / 40

            if (meters != 0) { // esto para que no aparezca un 0m cuando hay dos nodos en la misma linea
                const metersText = new Konva.Text({
                    x: widthStage - blockSnapSize + 10,
                    y: segmentsAverage - offSet,
                    text: meters + "m",
                    fontSize: 15,
                    fontFamily: "Impact",
                    fill: "black"
                });
                layer.add(metersText);
            }
        }
    }
}

function createForceEditTask(valMagnitud, valAngle, color = "black", x0 = 0, y0 = 0,nodeId, layerForPaint = layer, aux = "aux",typeForce) {
    let x0lastPos = nodeId.coordinate[0];
    let y0lasPos = nodeId.coordinate[1];



    let magnitud = valMagnitud;
    let angle = valAngle;
    let txt = magnitud + " " + typeForce + ", " + angle + " °";

    const large = blockSnapSize * 2;
    const strokeVal = 4;

    const lx = large * Math.cos(angle * Math.PI / 180)
    const ly = large * Math.sin(degToRad(angle))

    if (color != "black") {
        x0lastPos = x0;
        y0lasPos = y0;
        txt = valMagnitud
    }

    const group = new Konva.Group({ tension: [magnitud, angle], name: "force", x: x0lastPos, y: y0lasPos });
    const arrow = new Konva.Arrow({
        x: (nodeRadius + strokeVal) * Math.cos(degToRad(angle)),
        y: -(nodeRadius + strokeVal) * Math.sin(degToRad(angle)),
        points: [lx, -ly, 0, 0],
        pointerLength: 15,
        pointerWidth: 15,
        fill: color,
        stroke: color,
        strokeWidth: strokeVal,
        draggable: true
    });

    const magnitudValue = new Konva.Text({
        x: lx + 4,
        y: -ly,
        text: txt,
        fontSize: 15,
        fontFamily: "Impact",
        fill: color
    });

    group.add(arrow, magnitudValue);
    layerForPaint.add(group);

    paintIfMouseOver(arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);

    if (color == "black") {
        const nodeParent = dcl.findNodeById(nodeId.id);
        nodeParent.addKonvaForce(group);
        nodeParent.addTypeForce(typeForce);

        group.setAttr("id", nodeId.id)
    }

    hideAllPanels()

    forceMovement(group, 2 * blockSnapSize, strokeVal,typeForce)

    return group;
}

function createMomentEditTask(val, color = "black", x0 = 0, y0 = 0, nodeId, layerForPaint = layer, forFixedSupport = false) {
    let x0lastPos = nodeId.coordinate[0];
    let y0lastPos = nodeId.coordinate[1];

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
        return;
    }


    const group = new Konva.Group({ name: "moment", tension: magnitud, x: x0lastPos, y: y0lastPos });
    const arrow = new Konva.Arrow({
        x: 0,
        y: 0,
        points: listOfPoints,
        pointerLength: 10,
        pointerWidth: 10,
        fill: color,
        stroke: color,
        strokeWidth: 4,
        name: "subelement",
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

    paintIfMouseOver(arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);

    if (color == "black") {
        const nodeParent = dcl.findNodeById(nodeId.id);
        nodeParent.addKonvaMoment(group);
        group.setAttr("id", nodeId.id);
    }

    layerForPaint.add(group);

    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";
    // updateEquations();
    // updateScorePanel();
    return group;
}

function changeOrigin() {
    const newOriginNode = dcl.findNodeById(lastNodeClick.getAttr("id"));
    const oldOriginNode = dcl.findOriginNode();
    oldOriginNode.setIsOrigin(false);
    newOriginNode.setIsOrigin(true);

    oldOriginNode.konvaObjects.circle.setAttr("fill", "red");
    newOriginNode.konvaObjects.circle.setAttr("fill", originColor);

    hideAllPanels();

    updateEquations();
    calculateDifPro();
}

function distanceXYnodes(node1, node2) {
    const [x1, y1] = node1.coordinate
    const [x2, y2] = node2.coordinate
    return { x: x1 - x2, y: y1 - y2, distance: ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** (0.5) }
}

function recalculateNodeNames() {
    console.log("recalculando nombres")
    const allNodes = dcl.getAllDecendents();

    indexOfNodeNames = 0;
    allNodes.forEach(node => {
        if (node.link) {
            node.setName(nodeNameList[indexOfNodeNames][0]);
            indexOfNodeNames += 1;
        }
    })

}


function usefullAngle(angle) {
    if (angle > 45) {
        return (90 - angle);
    } return angle
}

function tryPushLinkMoments(linkMoments, name, proyection, dist){
    let sign;
    if (dist > 0) {
        if (proyection == 1) sign = "positive";
        else if (proyection == -1) sign = "negative";
        else return false;
        linkMoments.push([name, sign]);
        return true;

    } else if (dist < 0) {
        if (proyection == 1) sign = "negative";
        else if (proyection == -1) sign = "positive";
        else return false;
        linkMoments.push([name, sign]);
        return true;
    }

    return false;

}

function tryPushLinkForces(linkForces, name, proyection){
    if (proyection == 1){
        linkForces.push([name, "positive"]);
        return true;

    } else if (proyection == -1) {
        linkForces.push([name, "negative"]);  
        return true;
    }

    return false;


}


function calculateEquations() {
    const origin = dcl.findOriginNode()

    const moments = [];
    const typeOfMoments = [];
    const forcesX = [];
    const forcesY = [];

    const linkMoments = [];
    const linkForcesX = [];
    const linkForcesY = [];

    const allNodes = [dcl, ...dcl.getAllDecendents()];


    allNodes.forEach(node => {
        const diff = distanceXYnodes(node, origin);
        const distX = Math.abs(diff.x / blockSnapSize);
        const distY = Math.abs(diff.y / blockSnapSize);

        node.moments.forEach(moment => {
            moments.push(moment);
            typeOfMoments.push(node.typeMoment);
            
        })

        node.forces.forEach(force => {
            const typeForce = node.typeForce;
            

            const [magnitud, angle] = force;
            if(0 == angle){
                forcesX.push([-magnitud, typeForce]);
                if (diff.y > 0){
                    moments.push([[-magnitud, typeForce], [distY, `m`]]);
                } else if (diff.y < 0){
                    moments.push([[magnitud, typeForce], [distY, `m`]]);
                }
            } else if (0 < angle && angle < 90){
                forcesX.push([-magnitud, `cos(${angle})${typeForce}`]);
                forcesY.push([-magnitud, `sin(${angle})${typeForce}`]);
                if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                    // Same  Slope
                } else {
                    if (diff.x > 0){
                        moments.push([[-magnitud, `sin(${angle})${typeForce}`], [distX, `m`]]);
                    } else if (diff.x < 0){
                        moments.push([[magnitud, `sin(${angle})${typeForce}`], [distX, `m`]]);
                    }
                    if (diff.y > 0){
                        moments.push([[-magnitud, `cos(${angle})${typeForce}`], [distY, `m`]]);
                    } else if (diff.y < 0){
                        moments.push([[magnitud, `cos(${angle})${typeForce}`], [distY, `m`]]);
                    } 
                }
        
            } else if (90 == angle){
                forcesY.push([-magnitud, typeForce]);
                if (diff.x > 0){
                    moments.push([[-magnitud, typeForce], [distX, `m`]]);
                } else if (diff.x < 0){
                    moments.push([[magnitud, typeForce], [distX, `m`]]);
                }

            } else if (90 < angle && angle < 180){
                forcesX.push([magnitud, `cos(${180 - angle})${typeForce}`]);
                forcesY.push([-magnitud, `sin(${180 - angle})${typeForce}`]);
                if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                    // Same  Slope
                } else {
                    if (diff.x > 0){
                        moments.push([[-magnitud, `sin(${angle - 90})${typeForce}`], [distX, `m`]]);
                    } else if (diff.x < 0){
                        moments.push([[magnitud, `sin(${angle - 90})${typeForce}`], [distX, `m`]]);
                    }
                    if (diff.y > 0){
                        moments.push([[magnitud, `cos(${angle - 90})${typeForce}`], [distY, `m`]]);
                    } else if (diff.y < 0){
                        moments.push([[-magnitud, `cos(${angle - 90})${typeForce}`], [distY, `m`]]);
                    } 
                }
                
            } else if (180 == angle){
                forcesX.push([magnitud, typeForce]);
                if (diff.y > 0){
                    moments.push([[magnitud, typeForce], [distY, `m`]]);
                } else if (diff.y < 0){
                    moments.push([[-magnitud, typeForce], [distY, `m`]]);
                }
            } else if (180 < angle && angle < 270){
                forcesX.push([magnitud, `cos(${angle - 180})${typeForce}`]);
                forcesY.push([magnitud, `sin(${angle - 180})${typeForce}`]);
                if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                    // Same  Slope
                } else {
                    if (diff.x > 0){
                        moments.push([[magnitud, `sin(${angle - 180})${typeForce}`], [distX, `m`]]);
                    } else if (diff.x < 0){
                        moments.push([[-magnitud, `sin(${angle - 180})${typeForce}`], [distX, `m`]]);
                    }
                    if (diff.y > 0){
                        moments.push([[magnitud, `cos(${angle - 180})${typeForce}`], [distY, `m`]]);
                    } else if (diff.y < 0){
                        moments.push([[-magnitud, `cos(${angle - 180})${typeForce}`], [distY, `m`]]);
                    } 
                }
                
            } else if (270 == angle){
                forcesY.push([magnitud, typeForce]);
                if (diff.x > 0){
                    moments.push([[magnitud, typeForce], [distX, `m`]]);
                } else if (diff.x < 0){
                    moments.push([[-magnitud, typeForce], [distX, `m`]]);
                }
            } else if (270 < angle && angle < 360){
                forcesX.push([-magnitud, `cos(${360 - angle})${typeForce}`]);
                forcesY.push([magnitud, `sin(${360 - angle})${typeForce}`]);
                if ((-diff.y/diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)){
                    // Same  Slope
                } else {
                    if (diff.x > 0){
                        moments.push([[magnitud, `sin(${360 - angle})${typeForce}`], [distX, `m`]]);
                    } else if (diff.x < 0){
                        moments.push([[-magnitud, `sin(${360 - angle})${typeForce}`], [distX, `m`]]);
                    }
                    if (diff.y > 0){
                        moments.push([[-magnitud, `cos(${360 - angle})${typeForce}`], [distY, `m`]]);
                    } else if (diff.y < 0){
                        moments.push([[magnitud, `cos(${360 - angle})${typeForce}`], [distY, `m`]]);
                    } 
                }

            }
        })

        
        if (node.link === "fixedSupport" || node.link === "pinnedSupport") {
            if (node.link === "fixedSupport"){
                linkMoments.push([`${node.name}m`, "positive"])
            }

            const dx = (node.coordinate[0] - origin.coordinate[0]) / blockSnapSize;
            const dy = (node.coordinate[1] - origin.coordinate[1]) / blockSnapSize;

            const supportAngle = parseFloat(node.linkRotation);
        
            const angleForceX = angleFx(supportAngle);
            const angleForceY = angleFy(supportAngle);
            
            const prettyAngleFx = prettyAngle(angleForceX);
            const prettyAngleFy = prettyAngle(angleForceY);

            const proyectionFx = proyection(angleForceX);
            const proyectionFy = proyection(angleForceY);

            let coeffxx = ""
            let coeffxy = ""
            let coeffyx = ""
            let coeffyy = ""
        
            if (prettyAngleFx != 0 && prettyAngleFx != 90){
                coeffxx = `*cos(${prettyAngleFx})`;  
                coeffxy = `*sin(${prettyAngleFx})`;
            } 

            if (prettyAngleFy != 0 && prettyAngleFy != 90){
                coeffyx = `*cos(${prettyAngleFy})`;
                coeffyy = `*sin(${prettyAngleFy})`;
            } 

            
            tryPushLinkForces(linkForcesX, `${node.name}x${coeffxx}`, proyectionFx.x);
            tryPushLinkForces(linkForcesY, `${node.name}x${coeffxy}`, proyectionFx.y);
            tryPushLinkForces(linkForcesX, `${node.name}y${coeffyx}`, proyectionFy.x);
            tryPushLinkForces(linkForcesY, `${node.name}y${coeffyy}`, proyectionFy.y);

            tryPushLinkMoments(linkMoments, `${node.name}x*${distY}${coeffxx}`, proyectionFx.x, dy);
            tryPushLinkMoments(linkMoments, `${node.name}x*${distX}${coeffxy}`, proyectionFx.y, dx);
            tryPushLinkMoments(linkMoments, `${node.name}y*${distY}${coeffyx}`, proyectionFy.x, dy);
            tryPushLinkMoments(linkMoments, `${node.name}y*${distX}${coeffyy}`, proyectionFy.y, dx);

            
        } else if (node.link === "rollerSupport") {
            const dx = (node.coordinate[0] - origin.coordinate[0]) / blockSnapSize;
            const dy = (node.coordinate[1] - origin.coordinate[1]) / blockSnapSize;

            let coeffyx = ""
            let coeffyy = ""

            const supportAngle = parseFloat(node.linkRotation);
            
            const angleForceY = angleFy(supportAngle);
            
            const prettyAngleFy = prettyAngle(angleForceY);
            
            const proyectionFy = proyection(angleForceY);
            
            if (prettyAngleFy != 0 && prettyAngleFy != 90){
                coeffyx = `*cos(${prettyAngleFy})`;
                coeffyy = `*sin(${prettyAngleFy})`;
            } 

            console.log(proyectionFy)
            console.log(dx, dy)
            tryPushLinkForces(linkForcesX, `${node.name}y${coeffyx}`, proyectionFy.x);
            tryPushLinkForces(linkForcesY, `${node.name}y${coeffyy}`, proyectionFy.y);

            tryPushLinkMoments(linkMoments, `${node.name}y*${distY}${coeffyx}`, proyectionFy.x, dy);
            tryPushLinkMoments(linkMoments, `${node.name}y*${distX}${coeffyy}`, proyectionFy.y, dx);

        }
    })

    let textForcesX = "ΣFx: ";
    let textForcesY = "ΣFy: ";
    let textMoments = "ΣM: ";

    forcesX.forEach(force => {
        if (force[0] > 0) textForcesX += "+";
        textForcesX += `${force[0]}${force[1]} `;
    })

    forcesY.forEach(force => {
        if (force[0] > 0) textForcesX += "+";
        textForcesY += `${force[0]}${force[1]} `;
    })

    let i =0;
    moments.forEach(moment => {
        if (typeof moment === "number") {
            if (moment > 0) textMoments += "+";
            textMoments += `${moment}${typeOfMoments[i]} `;
        } else {
            if (moment[0][0] > 0) textMoments += `+${moment[0][0]}*${moment[1][0]}*${moment[0][1]}${moment[1][1]} `;
            else textMoments += `${moment[0][0]}*${moment[1][0]}*${moment[0][1]}${moment[1][1]} `;

        }
        i++;
    })


    linkForcesX.forEach(lfx => {
        if (lfx[1] === "positive") textForcesX += "+";
        else if (lfx[1] === "negative") textForcesX += "-";
        textForcesX += `${lfx[0]} `;
    })

    linkForcesY.forEach(lfy => {
        if (lfy[1] === "positive") textForcesY += "+";
        else if (lfy[1] === "negative") textForcesY += "-";
        textForcesY += `${lfy[0]} `;
    })

    linkMoments.forEach(lm => {
        if (lm[1] === "positive") textMoments += "+";
        else if (lm[1] === "negative") textMoments += "-";
        textMoments += `${lm[0]} `;
    })

    textForcesX += " = 0";
    textForcesY += " = 0";
    textMoments += " = 0";

    return [textForcesX, textForcesY, textMoments];
}



function updateEquations() {
    const [Fx, Fy, M] = calculateEquations();

    const pFx = document.querySelector("#forcesX");
    const pFy = document.querySelector("#forcesY");
    const pM = document.querySelector("#moments");

    pFx.innerText = Fx;
    pFy.innerText = Fy;
    pM.innerText = M;
}

function rotateKonvaObject(object, angle = 90) {
    object.rotation(angle);
    object.getLayer().draw();
}

function showModal(modal) {
    hideAllPanels();

    movePanelTo(modal, lastBeamNodeClick.x, lastBeamNodeClick.y);
    modal.style.visibility = "visible";

}

function createGenericModalRotation(x0, y0) {

    const widthModal = 150;
    const heightModal = 100;

    const colorModal = "#DDDDDD";

    const heightModalElement = heightModal / 3;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = divKonvaContainer.getBoundingClientRect().left + x0 + "px";
    modal.style.top = divKonvaContainer.getBoundingClientRect().left + y0 + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = colorModal;
    modal.style.borderColor = "black";
    modal.style.border = "40px";
    modal.style.visibility = "hidden";
    modal.style.zIndex = "1000";

    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.max = 359;
    input.value = 0;
    input.style.width = widthModal / 4 + "px";

    modal.appendChild(input);

    return modal;
}

function createModalFixedSupport() {
    const modal = createGenericModalRotation(0, 0);
    modal.id = "modalFixedSupport";

    const button = createButton(modal.style.width, modal.style.height, "modalRotationBtn", "Crear", createFixedSupport, null, null, null, null, selectObj = modal.children[0]);

    modal.appendChild(button);
    return modal;
}

function createModalRollerSupport() {
    const modal = createGenericModalRotation(0, 0);
    modal.id = "modalRollerSupport";

    const button = createButton(modal.style.width, modal.style.height, "modalRotationBtn", "Crear", createRollerSupport, null, null, null, null, selectObj = modal.children[0]);

    modal.appendChild(button);
    return modal;
}

function createModalPinnedSupport() {
    const modal = createGenericModalRotation(0, 0);
    modal.id = "modalPinnedSupport";

    const button = createButton(modal.style.width, modal.style.height, "modalRotationBtn", "Crear", createPinnedSupport, null, null, null, null, selectObj = modal.children[0]);

    modal.appendChild(button);
    return modal;
}

function removeDraggableFromAllNodes() {
    const beamNames = new Set(["subElementBeamCircle", "subElementBeamCircle1", "subElementBeamCircle2"]);
    const allNodes = [dcl, ...dcl.getAllDecendents()];
    allNodes.forEach(node => {
        const beam = node.konvaObjects.beam
        if (beam) {
            beam.getChildren(child => beamNames.has(child.name())).forEach(child => {
                child.setAttr("draggable", false);
            })
        }
        const forces = node.konvaObjects.forces;
        console.log(forces)
        forces.forEach(force => {

            force.getChildren()[0].setAttr("draggable", false);

        })
    })
}

function addDraggableToAllNodes() {
    const beamNames = new Set(["subElementBeamCircle", "subElementBeamCircle1", "subElementBeamCircle2"]);
    const allNodes = [dcl, ...dcl.getAllDecendents()];
    allNodes.forEach(node => {
        const beam = node.konvaObjects.beam
        if (beam) {
            beam.getChildren(child => beamNames.has(child.name())).forEach(child => {
                child.setAttr("draggable", true);

            })
        }

        const forces = node.konvaObjects.forces;
        forces.forEach(force => {
            force.setAttr("draggable", true);
            force.getChildren()[0].setAttr("draggable", true);
        })
    })
}

function visibilityLines(lineType, viewType){
    const lines = layer.find(node => node.name() === lineType);
    lines.forEach(line => {
        if(viewType === "hide"){
            line.hide();
        }else if(viewType === "show"){
            line.show();
        }
    });

}


function showReferences() {
    const check = document.querySelector("#showReferences");
    check.addEventListener("change", () => {
        if (check.checked) {
            x_reference.showAll();
            y_reference.showAll();
        } else {
            x_reference.hideAll();
            y_reference.hideAll();
        }
    });

}



function removeDraggableFromAllNodes() {
    const beamNames = new Set(["subElementBeamCircle", "subElementBeamCircle1", "subElementBeamCircle2"]);
    const allNodes = [dcl, ...dcl.getAllDecendents()];
    allNodes.forEach(node => {
        const beam = node.konvaObjects.beam
        if (beam) {
            beam.getChildren(child => beamNames.has(child.name())).forEach(child => {
                child.setAttr("draggable", false);
            })
        }
        const forces = node.konvaObjects.forces;
        console.log(forces)
        forces.forEach(force => {

            force.getChildren()[0].setAttr("draggable", false);

        })
    })
}

function addDraggableToAllNodes() {
    const beamNames = new Set(["subElementBeamCircle", "subElementBeamCircle1", "subElementBeamCircle2"]);
    const allNodes = [dcl, ...dcl.getAllDecendents()];
    allNodes.forEach(node => {
        const beam = node.konvaObjects.beam
        if (beam) {
            beam.getChildren(child => beamNames.has(child.name())).forEach(child => {
                child.setAttr("draggable", true);

            })
        }

        const forces = node.konvaObjects.forces;
        forces.forEach(force => {
            force.setAttr("draggable", true);
            force.getChildren()[0].setAttr("draggable", true);
        })
    })
}

function turnToRealDCL() {
    const check = document.querySelector("#turnToRealDCL");

    check.addEventListener("change", () => {
        const allNodes = [dcl, ...dcl.getAllDecendents()];

        if (check.checked) {
            removeDraggableFromAllNodes();
            turnToRealDCLFlag = true;

            allNodes.forEach(node => {
                const [x, y] = node.coordinate;

                if (node.link === "fixedSupport") {

                    node.konvaObjects.link.hide();
                    const supportAngle = parseFloat(node.linkRotation);

                    const forceAngleX = angleFx(supportAngle);
                    const Xx = x - lasForce*Math.cos(degToRad(forceAngleX));
                    const Yx = y + lasForce*Math.sin(degToRad(forceAngleX));

                    const forceAngleY = angleFy(supportAngle);
                    const Xy = x - lasForce*Math.cos(degToRad(forceAngleY));
                    const Yy = y + lasForce*Math.sin(degToRad(forceAngleY));
                    
                    const forceX = createForce(`${node.name}x`, forceAngleX, "green", Xx, Yx);
                    const forceY = createForce(`${node.name}y`, forceAngleY, "green", Xy, Yy);

                    const moment = createMoment(`${node.name}m`, "green", x, y)
                    
                    node.setKonvaForceXsupport(forceX);
                    node.setKonvaForceYsupport(forceY);   
                    node.setKonvaMomentSupport(moment);
                }
                else if (node.link === "pinnedSupport") {

                    node.konvaObjects.link.hide();
                    const supportAngle = parseFloat(node.linkRotation);

                    const forceAngleX = angleFx(supportAngle);
                    const Xx = x - lasForce*Math.cos(degToRad(forceAngleX));
                    const Yx = y + lasForce*Math.sin(degToRad(forceAngleX));

                    const forceAngleY = angleFy(supportAngle);
                    const Xy = x - lasForce*Math.cos(degToRad(forceAngleY));
                    const Yy = y + lasForce*Math.sin(degToRad(forceAngleY));
                    
                    const forceX = createForce(`${node.name}x`, forceAngleX, "green", Xx, Yx);
                    const forceY = createForce(`${node.name}y`, forceAngleY, "green", Xy, Yy);

                    node.setKonvaForceXsupport(forceX);
                    node.setKonvaForceYsupport(forceY);   
                }
                else if (node.link === "rollerSupport") {
                    node.konvaObjects.link.hide();

                    const supportAngle = parseFloat(node.linkRotation);
                    const forceAngle = angleFy(supportAngle);
                    const X = x - lasForce*Math.cos(degToRad(forceAngle));
                    const Y = y + lasForce*Math.sin(degToRad(forceAngle));

                    const forceY = createForce(`${node.name}y`, forceAngle, "green", X, Y);
                    node.setKonvaForceYsupport(forceY);    
                }

            })

            visibilityLines("horizontalLine", "hide");
            visibilityLines("verticalLine", "hide");

        } else {
            addDraggableToAllNodes();
            turnToRealDCLFlag = false;
            allNodes.forEach(node => {
                const [x, y] = node.coordinate;
                if (node.link) {
                    node.konvaObjects.link.show();
                    if (node.konvaObjects.forceXsupport) node.konvaObjects.forceXsupport.hide();
                    if (node.konvaObjects.forceYsupport) node.konvaObjects.forceYsupport.hide();
                    if (node.konvaObjects.momentSupport) node.konvaObjects.momentSupport.hide();
                }

            })
            visibilityLines("horizontalLine", "show");
            visibilityLines("verticalLine", "show");
        }
    })


}

function angleFx(angle){
    if (angle >= 0 && angle <= 180){
        return 180 - angle
    } else if (angle > 180 && angle < 360){
        return 540 - angle
    }
}

function angleFy(angle){
    if (angle >= 0 && angle <= 270){
        return 270 - angle
    } else if (angle > 270 && angle < 360){
        return 630 - angle
    }
}


function proyection(angle){
    function change(r, vx, vy){
        r.x = vx;
        r.y = vy;
    }

    const r = {x: null, y: null}
    if (angle == 0){
        change(r, -1, 0);
    } else if (angle > 0 && angle < 90){
        change(r, -1, -1);
    } else if (angle == 90){
        change(r, 0, -1);
    } else if (angle > 90 && angle < 180){ 
        change(r, 1, -1);
    } else if (angle == 180){ 
        change(r, 1, 0);
    } else if (angle > 180 && angle < 270){ 
        change(r, 1, 1);
    } else if (angle == 270){ 
        change(r, 0, 1);
    } else if (angle > 270 && angle < 360){ 
        change(r, -1, 1);
    }

    return r;  
}

function prettyAngle(angle){
    if (0 <= angle && angle < 90){
        return angle
    } else if (90 <= angle && angle < 180){
        return 180 - angle
    } else if (180 <= angle && angle < 270){
        return angle - 180
    } else if (270 <= angle && angle < 360){
        return 360 - angle;
    }
}