function createStage(containerId, stageWidth = widthStage, stageHeight = heightStage) {
    const stage = new Konva.Stage({
        container: containerId,
        width: stageWidth,
        height: stageHeight
    });

    return stage;
}

function createShadowBeam(layer, x0, y0, x1, y1, nameShadow = "shadow-beam") {
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
        fill: "black",
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

    // paintIfMouseOver(dcl, line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"));
    // paintIfMouseOver(dcl, circle1, nfillc, nstrokec, circle1.getAttr("fill"), circle1.getAttr("stroke"));
    // paintIfMouseOver(dcl, circle2, nfillc, nstrokec, circle2.getAttr("fill"), circle2.getAttr("stroke"));

    return group;
}

function createBeam(layer, nameBeam = "beam", _id = null, coordinates = null, _node = null) {
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

    return [originNode, line];
}

function createBeam2(layer, dcl, _node = null, _parent = null, listenUpdate = true) {
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

    paintIfMouseOver(dcl, line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"));
    paintIfMouseOver(dcl, circle, nfillc, nstrokec, circle.getAttr("fill"), circle.getAttr("stroke"));

    const shadowLine = createShadowBeam(layer, x0shadow, y0shadow, x1shadow, y1shadow, "shadowBeam2");
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

    listenNodeMovement(dcl, group, shadowLine, "beam2", listenUpdate);
    if (listenUpdate) {
        calculateEquations();
    }

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

function listenNodeMovement(dcl, konvaBeam, shadow, typeOfBeam, listenUpdate = true) {
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
            if (listenUpdate) {
                updateEquations();
                updateDificulty();
                updateClassification();
            }
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
            if (listenUpdate) {
                updateEquations();
                updateDificulty();
                updateClassification();
            }
        }


    });
}

//------------------------------------------------------Links externos-----------------------------------------------//

function createFixedSupport(dcl, layer, _node = null, rotation, listenUpdate = true) {
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

    paintIfMouseOver(dcl, base, nfillc, nstrokec, base.getAttr("fill"), base.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(dcl, l1, nfillc, nstrokec, l1.getAttr("fill"), l1.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(dcl, l2, nfillc, nstrokec, l2.getAttr("fill"), l2.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(dcl, l3, nfillc, nstrokec, l3.getAttr("fill"), l3.getAttr("stroke"), paintGroup = true);

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
    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }

    rotateKonvaObject(group, rotation);
    return group;
}

function createRollerSupport(dcl, layer, _node = null, rotation, listenUpdate) {
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

    paintIfMouseOver(dcl, triangle, nfillc, nstrokec, triangle.getAttr("fill"), triangle.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(dcl, base, nfillc, nstrokec, triangle.getAttr("fill"), base.getAttr("stroke"), paintGroup = true);

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
    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }

    rotateKonvaObject(group, rotation);
    return group;
}

function createPinnedSupport(dcl, layer, _node = null, rotation, listenUpdate = true) {
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

    paintIfMouseOver(dcl, triangle, nfillc, nstrokec, triangle.getAttr("fill"), triangle.getAttr("stroke"), paintGroup = false);

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

    hideAllPanels();

    indexOfNodeNames += 1;
    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }

    rotateKonvaObject(group, rotation);
    return group;
}

//------------------------------------------------------Links internos-----------------------------------------------//

function createBallJoint(dcl, _node = null, listenUpdate = true) {
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

    paintIfMouseOver(dcl, circle, nfillc, nstrokec, circle.getAttr("fill"), circle.getAttr("stroke"), paintGroup = false);

    if (nodeParent.link === null) {
        nodeParent.setLink("ballJoint");
        nodeParent.setKonvaLink(group);
        nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
        nodeNameList[indexOfNodeNames][1] = nodeParent.id;
    } else {
        hideAllPanels();
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
    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }

    return group;
}

function createConnectingRod(dcl, _node = null, listenUpdate = true) {
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

    paintIfMouseOver(dcl, line, nfillc, nstrokec, line.getAttr("fill"), line.getAttr("stroke"), paintGroup = false);
    paintIfMouseOver(dcl, circle1, nfillc, nstrokec, circle1.getAttr("fill"), circle1.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(dcl, circle2, nfillc, nstrokec, circle2.getAttr("fill"), circle2.getAttr("stroke"), paintGroup = true);

    if (nodeParent.link === null) {
        nodeParent.setLink("connectingRod");
        nodeParent.setKonvaLink(group);
        nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
        nodeNameList[indexOfNodeNames][1] = nodeParent.id;

    } else {
        hideAllPanels();
        if (_node) {
            nodeParent.setKonvaLink(group);
            nodeParent.setName(nodeNameList[indexOfNodeNames][0]);
            nodeNameList[indexOfNodeNames][1] = nodeParent.id;
        } else {
            return;
        }
    }

    layer.add(group);

    hideAllPanels();

    indexOfNodeNames += 1;
    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }

    return group;
}

//------------------------------------------------------Forces y moments-----------------------------------------------//

function createForce(dcl, layer, valMagnitud, valAngle, typeForce, node, color = "black", listenUpdate = true, X = null, Y = null, isNew = true, attachToNode = true) {
    // console.log(dcl, layer, valMagnitud, valAngle, typeForce, node, color, listenUpdate, X, Y, isNew, attachToNode)
    let [x0, y0] = node.coordinate;

    let magnitud = valMagnitud;
    let angle = valAngle;

    let txt = magnitud + " " + typeForce + ", " + angle + " °";

    let dragg = true;

    const large = largeForce;
    const strokeVal = strokeForce

    const lx = large * Math.cos(angle * Math.PI / 180)
    const ly = large * Math.sin(degToRad(angle))

    let sign = magnitud >= 0 ? "+" : "-";
    if (color != "black") {
        x0 = X;
        y0 = Y;
        txt = valMagnitud;
        dragg = false;
        sign = parseFloat(magnitud.substring(0, 1)) >= 0 ? "+" : "-";
    }

    const group = new Konva.Group({ tension: [magnitud, angle, typeForce, sign], name: "force", x: x0, y: y0 });
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
    layer.add(group);

    paintIfMouseOver(dcl, arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(dcl, magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);

    if (isNew) {
        node.addForce(parseFloat(magnitud), parseFloat(angle), typeForce);
    }

    if (attachToNode) {
        node.addKonvaForce(group);
    }

    group.setAttr("id", node.id);

    hideAllPanels();

    forceMovement(group, 2 * blockSnapSize, strokeVal, typeForce, listenUpdate)
    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }

    return group;
}

function forceMovement(group, large, strokeVal, typeForce, listenUpdate = true) {
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

            let txt = magnitudVal + " " + typeForce + ", " + newAngle + " °";
            magnitud.setAttr("text", txt)
            magnitud.setAttr("x", a * x + 10)
            magnitud.setAttr("y", a * y + 10)

        }
    })

    arrow.on("dragend", () => {
        if (!turnToRealDCLFlag) {
            group.setAttr("tension", [magnitudVal, newAngle, typeForce]);

            const node = dcl.findNodeById(group.getAttr("id"));

            const force = node.forces.find(force => {
                return force[0] == prettyDeg(magnitudVal) && force[1] == angleVal;
            })

            angleVal = newAngle;
            force[1] = newAngle;
            if (listenUpdate) {
                updateEquations();
                updateDificulty();
                updateClassification();
            }
        }
    })
}

function createMoment(dcl, layer, val, typeMoment, node, color = "black", listenUpdate = true, X = 0, Y = 0, isNew = true, attachToNode = true) {
    let [x0, y0] = node.coordinate

    let magnitud = val;
    let txt = magnitud + " " + typeMoment;

    if (color != "black") {
        x0 = X;
        y0 = Y;
    }

    let listOfPoints;
    const positiveList = [17.68, 17.68, 18.63, 16.67, 19.53, 15.61, 20.36, 14.5, 21.14, 13.35, 21.85, 12.15, 22.49, 10.92, 23.06, 9.66, 23.56, 8.36, 23.99, 7.04, 24.34, 5.7, 24.62, 4.34, 24.82, 2.97, 24.95, 1.59, 25.0, 0.2, 24.97, -1.19, 24.87, -2.57, 24.69, -3.95, 24.43, -5.31, 24.1, -6.66, 23.69, -7.99, 23.21, -9.29, 22.66, -10.57, 22.04, -11.81, 21.35, -13.01, 20.59, -14.18, 19.77, -15.3, 18.89, -16.37, 17.96, -17.39, 16.96, -18.36, 15.92, -19.28, 14.82, -20.13, 13.68, -20.92, 12.5, -21.65, 11.28, -22.31, 10.02, -22.9, 8.74, -23.42, 7.42, -23.87, 6.09, -24.25, 4.73, -24.55, 3.36, -24.77, 1.98, -24.92, 0.59, -24.99, -0.79, -24.99, -2.18, -24.9, -3.56, -24.75, -4.93, -24.51, -6.28, -24.2, -7.61, -23.81, -8.92, -23.35, -10.2, -22.82, -11.46, -22.22, -12.67, -21.55, -13.85, -20.81, -14.98, -20.01, -16.07, -19.15, -17.11, -18.23, -18.09, -17.25, -19.02, -16.22, -19.89, -15.14, -20.7, -14.01, -21.45, -12.84, -22.13, -11.63, -22.74, -10.39, -23.28, -9.11, -23.75, -7.8, -24.15, -6.47, -24.47, -5.12, -24.72, -3.75, -24.89, -2.38, -24.98, -0.99, -25.0, 0.4, -24.94, 1.78, -24.8, 3.16, -24.58, 4.54, -24.3, 5.89, -23.93, 7.23, -23.49, 8.55, -22.98, 9.84, -22.4, 11.1, -21.75, 12.33, -21.03, 13.52, -20.25, 14.66, -19.4, 15.76, -18.5, 16.82, -17.54, 17.82, -16.52, 18.76, -15.45, 19.65, -14.34, 20.48, -13.18, 21.24, -11.98, 21.94, -10.74, 22.57, -9.48, 23.13, -8.18, 23.63, -6.85, 24.04, -5.51, 24.39, -4.15, 24.65, -2.77, 24.85, -1.39, 24.96, -0.0, 25.0]
    const negativeList = [-17.68, 17.68, -18.63, 16.67, -19.53, 15.61, -20.36, 14.5, -21.14, 13.35, -21.85, 12.15, -22.49, 10.92, -23.06, 9.66, -23.56, 8.36, -23.99, 7.04, -24.34, 5.7, -24.62, 4.34, -24.82, 2.97, -24.95, 1.59, -25.0, 0.2, -24.97, -1.19, -24.87, -2.57, -24.69, -3.95, -24.43, -5.31, -24.1, -6.66, -23.69, -7.99, -23.21, -9.29, -22.66, -10.57, -22.04, -11.81, -21.35, -13.01, -20.59, -14.18, -19.77, -15.3, -18.89, -16.37, -17.96, -17.39, -16.96, -18.36, -15.92, -19.28, -14.82, -20.13, -13.68, -20.92, -12.5, -21.65, -11.28, -22.31, -10.02, -22.9, -8.74, -23.42, -7.42, -23.87, -6.09, -24.25, -4.73, -24.55, -3.36, -24.77, -1.98, -24.92, -0.59, -24.99, 0.79, -24.99, 2.18, -24.9, 3.56, -24.75, 4.93, -24.51, 6.28, -24.2, 7.61, -23.81, 8.92, -23.35, 10.2, -22.82, 11.46, -22.22, 12.67, -21.55, 13.85, -20.81, 14.98, -20.01, 16.07, -19.15, 17.11, -18.23, 18.09, -17.25, 19.02, -16.22, 19.89, -15.14, 20.7, -14.01, 21.45, -12.84, 22.13, -11.63, 22.74, -10.39, 23.28, -9.11, 23.75, -7.8, 24.15, -6.47, 24.47, -5.12, 24.72, -3.75, 24.89, -2.38, 24.98, -0.99, 25.0, 0.4, 24.94, 1.78, 24.8, 3.16, 24.58, 4.54, 24.3, 5.89, 23.93, 7.23, 23.49, 8.55, 22.98, 9.84, 22.4, 11.1, 21.75, 12.33, 21.03, 13.52, 20.25, 14.66, 19.4, 15.76, 18.5, 16.82, 17.54, 17.82, 16.52, 18.76, 15.45, 19.65, 14.34, 20.48, 13.18, 21.24, 11.98, 21.94, 10.74, 22.57, 9.48, 23.13, 8.18, 23.63, 6.85, 24.04, 5.51, 24.39, 4.15, 24.65, 2.77, 24.85, 1.39, 24.96, 0.0, 25.0]

    if (magnitud < 0) {
        listOfPoints = negativeList;
        // txt += " Nm";

    } else if (magnitud > 0) {
        listOfPoints = positiveList;
        // txt += " Nm";

    } else {
        if (color != "black") {
            listOfPoints = positiveList;
            txt = magnitud;
        } else {
            return;
        }
    }

    const group = new Konva.Group({ name: "moment", tension: [magnitud, typeMoment], x: x0, y: y0 });
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

    paintIfMouseOver(dcl, arrow, nfillc, nstrokec, arrow.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);
    paintIfMouseOver(dcl, magnitudValue, nfillc, nstrokec, magnitudValue.getAttr("fill"), arrow.getAttr("stroke"), paintGroup = true);

    if (isNew) {
        node.addMoment(parseFloat(magnitud), typeMoment);
    }

    if (attachToNode) {
        node.addKonvaMoment(group);
    }

    group.setAttr("id", node.id);
    layer.add(group);

    hideAllPanels();

    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }
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

function createButton(container, layer, dcl, widthPanel, heightPanel, idNameText, btnText, efunction, image, inputMagnitud, inputAngle, element, selectObj, modal, selectType, listenUpdate, extra) {
    const btn = document.createElement("button");
    btn.type = "button";

    if (image) {
        btn.style.backgroundImage = image;
    }

    btn.style.width = widthPanel + "px";
    btn.style.height = heightPanel + "px";
    btn.style.backgroundSize = "cover"; // todo en button
    btn.style.backgroundColor = "rgb(128, 70, 16)"
    btn.style.border = "2px outset rgb(128, 70, 16)";
    btn.style.borderRadius = "5px";
    btn.style.color = "white";
    btn.style.textAlign = "center";
    btn.style.justifyContent = "center";
    btn.id = idNameText;

    if (idNameText == "changeOriginBtn" || idNameText == "modalRotationBtn" || idNameText == "choiceBtn") {
        btn.style.color = "white";
        btn.innerText = btnText;
    }
    btn.addEventListener("dblclick", () => {
        hideAllPanels();

        if (idNameText == "createForce") {
            const node = dcl.findNodeById(lastNodeClick.getAttr("id"))
            efunction(dcl, layer, inputMagnitud.value, inputAngle.value, selectType.value, node, "black", listenUpdate);

        } else if (idNameText == "createMoment") {
            const node = dcl.findNodeById(lastNodeClick.getAttr("id"))
            efunction(dcl, layer, inputMagnitud.value, selectType.value, node, "black", listenUpdate)

        } else if (idNameText == "deleteElement") {
            efunction(lastElementClick, listenUpdate);

        } else if (idNameText == "modalRotationBtn") { // boton para creare vinculos
            efunction(dcl, layer, null, rotation = selectObj.value, listenUpdate);

        } else if (idNameText == "modalBtn") { // mostrar modal
            efunction(container, modal, listenUpdate);

        } else if (idNameText == "AngleBtn") {
            efunction(layer, dcl, listenUpdate);

        } else if (idNameText == "choiceBtn") {
            efunction(container, modal, listenUpdate);

        } else if (idNameText == "createForeceReactionStep32") { 
            const node = dcl.findNodeById(lastNodeClick.getAttr("id"));
            const [x, y] = node.coordinate;
            const {reaction, proyection, sign, trigonometry, angle} = extra;
            let angleForce;
            if (proyection.value == "vertical") {
                if (sign.value == "+") {
                    angleForce = 270;
                } else {
                    angleForce = 90;
                }
            } else {
                if (sign.value == "+") {
                    angleForce = 180;
                } else {
                    angleForce = 0;
                }
            }
            
            let magnitudText = reaction.value; 
            let trigonometric;
            if (trigonometry.value == "sin") {
                trigonometric = `*sin(${angle.value})`;
                magnitudText += trigonometric;
                trigonometric = trigonometric.substring(1, trigonometric.length);
            } else if (trigonometry.value == "cos") {
                trigonometric = `*cos(${angle.value})`;
                magnitudText += trigonometric;
                trigonometric = trigonometric.substring(1, trigonometric.length);
            } else {
                trigonometric = "";
            }

            const forceAngleX = angleFx(angleForce);
            const Xx = x + lasForce * Math.cos(degToRad(forceAngleX));
            const Yx = y - lasForce * Math.sin(degToRad(forceAngleX));

            const forceAngleY = angleFy(angleForce);
            const Xy = x + lasForce * Math.sin(degToRad(forceAngleY));
            const Yy = y - lasForce * Math.cos(degToRad(forceAngleY));

            let X, Y;
            if (proyection.value == "horizontal") {
                X = Xx;
                Y = Yx;
            } else if (proyection.value == "vertical"){
                X = Xy;
                Y = Yy;
            }
            
            efunction(dcl, layer, magnitudText, angleForce, "Reaction", node, "green", listenUpdate, X, Y, false, true);
            if (proyection.value == "horizontal") {
                if (sign.value == "+") {
                    node.step3.axisXsupport.push(["+", reaction.value, trigonometric]);
                } else if (sign.value == "-"){
                    node.step3.axisXsupport.push(["-", reaction.value, trigonometric]);
                }
            } else if (proyection.value == "vertical") {
                if (sign.value == "+") {
                    node.step3.axisYsupport.push(["+", reaction.value, trigonometric]);
                } else if (sign.value == "-") {
                    node.step3.axisYsupport.push(["-", reaction.value, trigonometric]);
                }
            }


        } else if (idNameText == "createPointForceStep3") {
            const {proyection, sign, trigonometry, angle, magnitud, type} = extra;
            const node = dcl.findNodeById(lastNodeClick.getAttr("id"));
            let angleForce;
            if (proyection.value == "vertical") {
                if (sign.value == "+") {
                    angleForce = 270;
                } else {
                    angleForce = 90;
                }
            } else {
                if (sign.value == "+") {
                    angleForce = 180;
                } else {
                    angleForce = 0;
                }
            }
            let magnitudText = magnitud.value + type.value;
            let trigonometric = trigonometry.value;
            if (trigonometry.value == "sin") {
                trigonometric = `*sin(${angle.value})`;
                magnitudText += trigonometric;
                trigonometric = trigonometric.substring(1, trigonometric.length)

            } else if (trigonometry.value == "cos") {
                trigonometric = `*cos(${angle.value})`;
                magnitudText += trigonometric;
                trigonometric = trigonometric.substring(1, trigonometric.length)
            } else {
                trigonometric = "";
            }

            

            efunction(dcl, layer, magnitudText, angleForce, type.value, node, "green", listenUpdate, node.coordinate[0], node.coordinate[1], false, true);
            
            if (proyection.value == "horizontal") {
                if (sign.value == "+") {
                    node.step3.forcesX.push(["+",parseFloat( magnitud.value), type.value, trigonometric]);
                } else if (sign.value == "-"){
                    node.step3.forcesX.push(["-", parseFloat(-magnitud.value), type.value, trigonometric]);
                }
            } else if (proyection.value == "vertical") {
                if (sign.value == "+") {
                    node.step3.forcesY.push(["+",parseFloat( magnitud.value), type.value, trigonometric]);
                } else if (sign.value == "-") {
                    node.step3.forcesY.push(["-",parseFloat( magnitud.value), type.value, trigonometric]);
                }
            }
            hideAllPanels();

        } else if (idNameText == "createMomentReactionStep3") { 
            const node = dcl.findNodeById(lastNodeClick.getAttr("id"))
            efunction(dcl, layer, `Rm`, "Reaction", node, "green", listenUpdate, node.coordinate[0], node.coordinate[1], false, true)
            node.step3.momentsSupport.push("Rm");

        } else if (idNameText == "createPointMomentStep3") {
            const node = dcl.findNodeById(lastNodeClick.getAttr("id"))
            efunction(dcl, layer, inputMagnitud.value, selectType.value, node, "green", listenUpdate, node.coordinate[0], node.coordinate[1], false, true);
            if (inputMagnitud.value > 0) {
                node.step3.moments.push(["+",parseFloat( inputMagnitud.value), selectType.value]);
            } else {
                node.step3.moments.push(["-", parseFloat(-inputMagnitud.value), selectType.value]);
            }

        } else if ("createBeam2") {
            efunction(layer, dcl, _node = null, _parent = null, listenUpdate = true)        
        
        } else {
            console.log("llamand a else in createButton");
            efunction(layer, dcl, null, null, listenUpdate);
        }


    });
    return btn;
}

function createSelectTypeForce(idParam, widthPanel, heightPanel) {
    const select = document.createElement("select");
    select.className = "form-select"
    select.style.fontSize = "14px";
    select.style.width = widthPanel / 3 + "px";
    select.style.height = heightPanel + "px";
    select.setAttribute("id", idParam);

    const optionNewtons = document.createElement("option");
    const optionKips = document.createElement("option");
    const optionKiloNewtons = document.createElement("option");

    optionNewtons.value = "N";
    optionKips.value = "kip";
    optionKiloNewtons.value = "kN";

    optionNewtons.innerText = "Newtons (N)";
    optionKips.innerText = "KIPS (kip)";
    optionKiloNewtons.innerText = "Kilo Newtons (kN)";

    select.appendChild(optionKips);
    select.appendChild(optionKiloNewtons);
    select.appendChild(optionNewtons);
    return select;
}

function createSelectTypeMoment(idParam, widthPanel, heightPanel) {

    const select = document.createElement("select");
    select.style.width = widthPanel / 1.5 + "px";
    select.style.height = heightPanel + "px";
    select.className = "form-select"
    select.style.fontSize = "14px";
    select.setAttribute("id", idParam);

    const optionNewtons = document.createElement("option");
    const optionKips = document.createElement("option");
    const optionKiloNewtons = document.createElement("option");

    optionNewtons.value = "N*m";
    optionKips.value = "kip*ft";
    optionKiloNewtons.value = "kN*m";

    optionNewtons.innerText = "Newtons-meters (N*m)";
    optionKips.innerText = "KIPS-feet (kip*ft)";
    optionKiloNewtons.innerText = "Kilo Newtons-meters (kN*m)";

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
    input.className = "form-control";

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
    input.className = "form-control";

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

function createPanel(container, layer, dcl, listenUpdate = true) {
    const widthPanel = WIDTHPANEL;
    const heightPanel = HEIGHTPANEL;

    const heightPanelElement = heightPanel / 4;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
    panel.style.backgroundColor = "rgb(0, 83, 56)";
    panel.style.border = "10px outset rgb(128, 70, 16)";
    panel.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    panel.style.borderRadius = "10px";

    const headerPanel = document.createElement("div");
    headerPanel.style.width = "100%";
    headerPanel.style.height = "15%";
    headerPanel.style.backgroundColor = "rgb(128, 70, 16)";
    headerPanel.style.display = "flex";
    headerPanel.style.justifyContent = "center";
    headerPanel.style.alignItems = "center";
    headerPanel.innerText = "Elementos";
    headerPanel.style.fontSize = "20px";
    headerPanel.style.color = "white";

    const bodyPanel = document.createElement("div");

    bodyPanel.style.width = "100%";
    bodyPanel.style.height = "75%";
    bodyPanel.style.padding = "7px";
    bodyPanel.style.backgroundColor = "rgb(0, 83, 56)";
    bodyPanel.style.display = "grid";
    bodyPanel.style.gridTemplateColumns = "1fr 1fr";
    bodyPanel.style.gridTemplateRows = "1fr 1fr 1fr 1fr";

    const imgRollerSupport = `url(${imagesFolder}/rollerSupport.png)`;
    const imgPinnedSupport = `url(${imagesFolder}/pinnedSupport.png)`;
    const imgConnectingRod = `url(${imagesFolder}/connectingRod.png)`;
    const imgBallJoint = `url(${imagesFolder}/ballJoint.png)`;
    const imgMoment = `url(${imagesFolder}/moment.png)`;
    const imgForce = `url(${imagesFolder}/force.png)`;
    const imgFixedSupport = `url(${imagesFolder}/fixedSupport.png)`;
    const imgBeam = `url(${imagesFolder}/beam.png)`;

    const btnBeam2 = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "createBeam2", "Beam", createBeam2, image = imgBeam, null, null, null, null, null, null, listenUpdate = listenUpdate);
    const btnRollerSupport = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "modalBtn", "Roller support ", showModal, image = imgRollerSupport, null, null, null, null, modal = modalRollerSupport, listenUpdate = listenUpdate);
    const btnPinnedSupport = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "modalBtn", "Pinned support", showModal, image = imgPinnedSupport, null, null, null, null, modal = modalPinnedSupport, listenUpdate = listenUpdate);
    const btnFixedSupport = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "modalBtn", "Fixed support", showModal, image = image = imgFixedSupport, null, null, null, null, modal = modalFixedSupport, listenUpdate = listenUpdate);
    const btnBallJoint = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "ballJointBtn", "Ball joint", createBallJoint, image = imgBallJoint, null, null, null, null, null, null, listenUpdate = listenUpdate);
    const btnConnectingRod = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "connectingRodBtn", "Connecting rod", createConnectingRod, image = imgConnectingRod, null, null, null, null, null, null, listenUpdate = listenUpdate);
    const btnForce = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "modalBtn", "Force", showModal, image = imgForce, null, null, null, null, modalForce, null, listenUpdate = listenUpdate);
    const btnMoment = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "modalBtn", "Moment", showModal, image = imgMoment, null, null, null, null, modalMoment, null, listenUpdate = listenUpdate);
    const btnChangeOrigin = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "changeOriginBtn", "Nuevo origen", changeOrigin, listenUpdate = listenUpdate);
    btnChangeOrigin.style.color = "white";

    styleForElementGridPanel(btnBeam2, "1", "1");
    styleForElementGridPanel(btnRollerSupport, "1", "2");
    styleForElementGridPanel(btnPinnedSupport, "2", "1");
    styleForElementGridPanel(btnFixedSupport, "2", "2");
    styleForElementGridPanel(btnBallJoint, "3", "1");
    styleForElementGridPanel(btnConnectingRod, "3", "2");
    styleForElementGridPanel(btnForce, "4", "1");
    styleForElementGridPanel(btnMoment, "4", "2");
    styleForElementGridPanel(btnChangeOrigin, "5", "1");

    bodyPanel.appendChild(btnBeam2)
    bodyPanel.appendChild(btnRollerSupport);
    bodyPanel.appendChild(btnPinnedSupport)
    bodyPanel.appendChild(btnFixedSupport);
    bodyPanel.appendChild(btnBallJoint);
    bodyPanel.appendChild(btnConnectingRod);
    bodyPanel.appendChild(btnForce);
    bodyPanel.appendChild(btnMoment);
    bodyPanel.appendChild(btnChangeOrigin)

    panel.appendChild(headerPanel);
    panel.appendChild(bodyPanel);

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

function movePanelTo(container, panelParam, x, y) {
    if (panelParam != delPanel) {
        panelParam.style.left = getOffset(container).left + x + "px";
        panelParam.style.top = getOffset(container).top + y + "px";

    } else {
        panelParam.style.left = getOffset(container).left + x - panelParam.offsetWidth + "px";
        panelParam.style.top = getOffset(container).top + y + "px";

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

function listenCreateElement(container, panel) {
    stage.on("dblclick", (e) => {
        if (e.target != stage && e.target && !turnToRealDCLFlag) {
            const mouseXY = roundXY(getXY());
            lastBeamNodeClick.x = mouseXY.x;
            lastBeamNodeClick.y = mouseXY.y;
            lastNodeClick = e.target;
            const nodeParent = dcl.findNodeById(lastNodeClick.getAttr("id"))
            console.log(nodeParent)

            if (e.target.name() == "subElementBeamCircle1") {
                panel.style.visibility = "visible";
                movePanelTo(container, panel, mouseXY.x, mouseXY.y);

            } else if (e.target.name() == "subElementBeamCircle2") {
                panel.style.visibility = "visible";
                movePanelTo(container, panel, mouseXY.x, mouseXY.y);

            } else if (e.target.name() == "subElementBeamCircle") {
                panel.style.visibility = "visible";
                movePanelTo(container, panel, mouseXY.x, mouseXY.y);

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

function deleteElement(element, listenUpdate=true) {
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
            
            let matchText = tuple[0];
            console.log(tuple)
            try {
                const idxfx = node.step3.forcesX.findIndex(force => {
                    return `${force[1]}${force[2]}*${force[3]}` == matchText && force[0] == tuple[3];
                });
                node.step3.forcesX.splice(idxfx, 1);
            } catch (e) {
                console.log("Error en step3ForceAngle   1");
            }

            try {
                const idxfy = node.step3.forcesY.forEach(force => {
                    console.log(force, tuple)
                    return `${force[1]}${force[2]}*${force[3]}` == matchText && force[0] == tuple[3];
                });
                node.step3.forcesY.splice(idxfy, 1);
            } catch (e) {
                console.log("Error en step3ForceAngle    2");
            }

            try {
                const idxaxs = node.step3.axisXsupport.findIndex(force => {
                    return `${force[1]}${force[2]}*${force[3]}` == matchText && force[0] == tuple[3];
                });
                node.step3.axisXsupport.splice(idxaxs, 1);
            } catch (e) {
                console.log("Error en step3ForceAngle    3");
            }

            try {
                const idxays = node.step3.axisYsupport.findIndex(force => {
                    return `${force[1]}${force[2]}*${force[3]}` == matchText && force[0] == tuple[3];
                });
                node.step3.axisYsupport.splice(idxays, 1);
            } catch (e) {
                console.log("Error en step3ForceAngle    4");
            }
            
            
            
        } else if (element.name() === "moment") {
            const [magnitud, type] = element.getAttr("tension")
            const idxm = node.moments.findIndex(moment => {
                return parseFloat(moment[0]) == parseFloat(magnitud) && moment[1] == type;
            });

            node.moments.splice(idxm, 1)

            try {
                const idxm = node.step3.moments.findIndex(moment => {
                    return parseFloat(moment[1]) == parseFloat(magnitud) && moment[2] == type;
                    // return `Rm` == matchText;
                });
                node.step3.moments.splice(idxm, 1);
            } catch (e) {
                console.log("Error en step3ForceAngle    5");
            }

            try {
                const idxms = node.step3.momentsSupport.findIndex(moment => {
                    return moment == "Rm";
                    // return `Rm` == matchText;
                });
                node.step3.momentsSupport.splice(idxms, 1);
            } catch (e) {
                console.log("Error en step3ForceAngle    5");
            }
        }

        
    }

    element.destroy();
    delete element;

    recalculateNodeNames();
    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }
}



function listenAngleReference(container) {
    stage.on("dblclick", (e) => {
        if (e.target && e.target.getParent()) {
            const element = e.target.getParent();
            const name = element.name();
            if (name == "force") {

                const mouseXY = roundXY(getXY());
                lastElementClick = element;
                anglePanel.style.visibility = "visible";
                movePanelTo(container, anglePanel, mouseXY.x - 240, mouseXY.y + 15);

            }
        }
    });

}




function listenDeleteElement(container) {
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
                movePanelTo(container, delPanel, mouseXY.x, mouseXY.y + 15);
            }
        }
    });
}

function hideAllPanels() {
    try {panel.style.visibility = "hidden";} catch (error) {} 
    try {delPanel.style.visibility = "hidden";} catch (error) {}
    try {modalForce.style.visibility = "hidden";} catch (error) {}
    try {modalMoment.style.visibility = "hidden";} catch (error) {}
    try {modalFixedSupport.style.visibility = "hidden";} catch (error) {}
    try {modalRollerSupport.style.visibility = "hidden";} catch (error) {}
    try {modalPinnedSupport.style.visibility = "hidden";} catch (error) {}
    try {anglePanel.style.visibility = "hidden";} catch (error) {}
    try {panelStep3.style.visibility = "hidden";} catch (error) {}
    try {choiceForceModalStep3.style.visibility = "hidden";} catch (error) {}
    try {choiceMomentModalStep3.style.visibility = "hidden";} catch (error) {}
    try {modalPointForce.style.visibility = "hidden";} catch (error) {}
    try {modalReactionForce.style.visibility = "hidden";} catch (error) {}
    
    // try {forceModalStep3.style.visibility = "hidden";} catch (error) {}

}

function listenHiddePanels() {
    hideAllPanels();
    stage.on("click", () => {
        hideAllPanels();
    });
}


//------------------------------------------------------Delete panel-----------------------------------------------//


function listenAngleCreated(konvaArc) {
    stage.on("click", () => {
        if (konvaArc) {
            konvaArc.destroy();
        }
    });

}

function listenArrowRotation(konvaArc, arrow) {
    arrow.on("dragend", () => {
        konvaArc.clockwise(true);
        if (arrow.getAttr("tension")[1] > 180 && arrow.getAttr("tension")[1]) {
            konvaArc.clockwise(false);
        }
        konvaArc.angle(360 - arrow.getAttr("tension")[1]);

    });
}
function createAngleReference() {

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
        angle: 360 - angle,
        rotation: 0,
        clockwise: true
    });
    if (angle > 180) {
        arc.clockwise(false);
    }



    layer.add(arc);

    hideAllPanels();

    listenArrowRotation(arc, forceObject);
    listenAngleCreated(arc);
}



function createDelPanel(container, layer, dcl, listenUpdate = true) {
    const widthPanel = 120;
    const heightPanel = 30;
    const colorPanel = "#DDDDDD";

    const baseUrl = window.location.origin;
    const imgDelete = `url(${imagesFolder}/delete.png)`;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
    panel.style.backgroundColor = colorPanel;
    panel.style.visibility = "hidden";
    panel.style.zIndex = "1001";

    const deleteElementBtn = createButton(container, layer, dcl, widthPanel, heightPanel, "deleteElement", "Delete", deleteElement, imgDelete, null, null, lastElementClick, null, null, null, listenUpdate);
    console.log(listenUpdate)
    panel.appendChild(deleteElementBtn);

    return panel;
}

function createAngleReferencePanel(container, layer, dcl) {
    const widthPanel = 120;
    const heightPanel = 30;
    const colorPanel = "#DDDDDD";
    const imgDelete = `url(${imagesFolder}/referenceAngle.png)`;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
    panel.style.backgroundColor = colorPanel;
    panel.style.borderColor = "black";
    panel.style.border = "40px";
    panel.style.visibility = "hidden";
    panel.style.zIndex = "1001";

    const angleElementBtn = createButton(container, layer, dcl, widthPanel, heightPanel, "AngleBtn", "AngleReference", createAngleReference, image = imgDelete);

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

function paintIfMouseOver(dcl, element, nfillc, nstrokec, ofillc, ostrokec, paintGroup = false) {

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

function createBelementForGrid(text, row, col) {
    const element = document.createElement("b");
    element.innerText = text;
    element.style.gridRow = row;
    element.style.gridColumn = col;
    element.style.textAlign = "center";
    element.style.justifyContent = "center";
    element.style.color = "white";

    return element;
}

function createContainerForElementGrid() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";

    return container;
}

function styleForElementGrid(element, row, col) {
    element.style.position = "relative";
    element.style.gridRow = row;
    element.style.gridColumn = col;
    element.style.alignItems = "center";
    element.style.justifyContent = "center";
    element.style.borderRadius = "5px";

}

function styleForElementGridPanel(element, row, col) {
    element.style.position = "relative";
    element.style.gridRow = row;
    element.style.gridColumn = col;
    element.style.borderRadius = "5px";
    element.style.width = WIDTHPANEL / 2 - 20 + "px";
    element.style.height = 50 + "px";
    element.style.margin = "2px";
}

function createModalForce(container, layer, dcl, listenUpdate = true) {
    const widthModal = 400;
    const heightModal = 180;

    const heightModalElement = heightModal / 3;

    const modal = document.createElement("div");
    modal.id = "modalForce";
    modal.className = "modal";
    modal.style.position = "absolute";
    modal.style.left = divKonvaContainer.getBoundingClientRect().left + "px";
    modal.style.top = divKonvaContainer.getBoundingClientRect().left + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = "rgb(0, 83, 56)";
    modal.style.border = "10px outset rgb(128, 70, 16)";
    modal.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    modal.style.borderRadius = "10px";
    modal.style.padding = "10px";
    modal.style.display = "grid";
    modal.style.gridTemplateRows = "1fr 1fr 1fr";
    modal.style.gridTemplateColumns = "1fr 1fr 1fr";
    modal.style.visibility = "hidden";

    const textMagnitude = createBelementForGrid("Magnitud", "1", "1");
    const textMagnitudeUnit = createBelementForGrid("Unidad", "1", "2");
    const textAngle = createBelementForGrid("Angulo", "1", "3");

    const inputCreateForceMagnitud = createInputMagnitud("input-create-force", widthModal, heightModalElement);
    styleForElementGrid(inputCreateForceMagnitud, "2", "1");

    const selectTypeForce = createSelectTypeForce("select-type-force", widthModal, heightModalElement);
    styleForElementGrid(selectTypeForce, "2", "2");

    const inputCreateForceAngle = createInputAngle("input-create-force-angle", widthModal, heightModalElement);
    styleForElementGrid(inputCreateForceAngle, "2", "3");

    const btnForce = createButton(container, layer, dcl, widthModal / 2, heightModalElement, "createForce", "Crear", createForce, null, inputMagnitud = inputCreateForceMagnitud, inputAngle = inputCreateForceAngle, null, null, null, selectTypeForce, listenUpdate);
    btnForce.style.backgroundColor = "rgb(128, 70, 16)"
    btnForce.style.border = "2px outset rgb(128, 70, 16)";
    btnForce.style.borderRadius = "5px";
    btnForce.style.color = "white";
    btnForce.style.gridRow = "3";
    btnForce.style.gridColumn = "2";
    btnForce.style.textAlign = "center";
    btnForce.style.justifyContent = "center";
    btnForce.style.width = "100px";
    btnForce.style.height = "40px";
    btnForce.style.margin = "10px"
    btnForce.innerText = "Crear";

    const inputCreateForceMagnitudContainer = createContainerForElementGrid();
    const selectTypeForceContainer = createContainerForElementGrid();
    const inputCreateForceAngleContainer = createContainerForElementGrid();
    const btnForceContainer = createContainerForElementGrid();

    inputCreateForceMagnitudContainer.appendChild(inputCreateForceMagnitud);
    selectTypeForceContainer.appendChild(selectTypeForce);
    inputCreateForceAngleContainer.appendChild(inputCreateForceAngle);
    btnForceContainer.appendChild(btnForce);
    styleForElementGrid(btnForceContainer, "3", "2");

    modal.appendChild(textMagnitude);
    modal.appendChild(textMagnitudeUnit);
    modal.appendChild(textAngle);
    modal.appendChild(inputCreateForceMagnitudContainer);
    modal.appendChild(selectTypeForceContainer);
    modal.appendChild(inputCreateForceAngleContainer);
    modal.appendChild(btnForceContainer);

    return modal;
}

function createModalMoment(container, layer, dcl, listenUpdate=true, green=false) {
    const widthModal = 380;
    const heightModal = 180;

    const heightModalElement = heightModal / 3;

    const modal = document.createElement("div");
    modal.id = "modalMoment";
    modal.className = "modal";
    modal.style.position = "absolute";
    modal.style.left = divKonvaContainer.getBoundingClientRect().left + "px";
    modal.style.top = divKonvaContainer.getBoundingClientRect().left + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = "rgb(0, 83, 56)";
    modal.style.border = "10px outset rgb(128, 70, 16)";
    modal.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    modal.style.borderRadius = "10px";
    modal.style.padding = "10px";
    modal.style.display = "grid";
    modal.style.gridTemplateRows = "1fr 1fr 1fr";
    modal.style.gridTemplateColumns = "1fr 1fr";

    const textMagnitude = createBelementForGrid("Magnitud", "1", "1");
    styleForElementGrid(textMagnitude, "1", "1");

    const textMagnitudeUnit = createBelementForGrid("Unidad", "1", "2");
    styleForElementGrid(textMagnitudeUnit, "1", "2");


    const inputCreateMoment = createInputMagnitud("input-create-moment", widthModal * 2, heightModalElement); // width panel*2
    inputCreateMoment.style.margin = "10px";

    const selectTypeMoment = createSelectTypeMoment("select-type-moment", widthModal, heightModalElement);
    selectTypeMoment.style.width = "200px";
    selectTypeMoment.style.margin = "5px";

    let btnMoment = createButton(container, layer, dcl, widthModal / 2, heightModalElement, "createMoment", "Moment", createMoment, null, inputMagnitude = inputCreateMoment, null, null, null, null, selectTypeMoment, listenUpdate);
    if (green) {
        btnMoment = createButton(container, layer, dcl, widthModal / 2, heightModalElement, "createPointMomentStep3", "Moment", createMoment, null, inputMagnitude = inputCreateMoment, null, null, null, null, selectTypeMoment, listenUpdate, "rgb(0, 83, 56)");
    }
    btnMoment.style.backgroundColor = "rgb(128, 70, 16)"
    btnMoment.style.border = "2px outset rgb(128, 70, 16)";
    btnMoment.style.borderRadius = "5px";
    btnMoment.style.color = "white";
    btnMoment.style.width = "100px";
    btnMoment.style.height = "40px";
    btnMoment.style.margin = "10px"
    btnMoment.style.position = "relative";
    btnMoment.style.transform = "translate(100%, 0)";

    btnMoment.innerText = "Crear";

    const inputCreateMomentContainer = createContainerForElementGrid();
    const selectTypeMomentContainer = createContainerForElementGrid();


    inputCreateMomentContainer.appendChild(inputCreateMoment);
    inputCreateMomentContainer.style.width = "100px"
    selectTypeMomentContainer.appendChild(selectTypeMoment);


    modal.appendChild(textMagnitude);
    modal.appendChild(textMagnitudeUnit);
    modal.appendChild(inputCreateMomentContainer);
    modal.appendChild(selectTypeMomentContainer);
    modal.appendChild(btnMoment);

    return modal;
}

function jsonToObject(json) {
    return JSON.parse(json);
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

function drawLink(dcl, layer, node, listenUpdate = true) {
    const rotation = parseInt(node.linkRotation);
    if (node.link === "rollerSupport") {
        createRollerSupport(dcl, layer, node, rotation, listenUpdate);
    } else if (node.link === "pinnedSupport") {
        createPinnedSupport(dcl, layer, node, rotation, listenUpdate);
    } else if (node.link === "fixedSupport") {
        createFixedSupport(dcl, layer, node, rotation, listenUpdate);
    } else if (node.link === "ballJoint") {
        createBallJoint(dcl, layer, node, rotation, listenUpdate);
    } else if (node.link === "connectingRod") {
        createConnectingRod(dcl, layer, node, rotation, listenUpdate);
    }
}

function drawForces(dcl, layer, node, listenUpdate = true) {
    node.forces.forEach(force => {
        if (force != null) {
            createForce(dcl, layer, force[0], force[1], force[2], node, "black", listenUpdate, null, null, false, true);
        }
    })

}


function drawMoments(dcl, layer, node, listenUpdate) {
    node.moments.forEach(moment => {
        if (moment != null) {
            createMoment(dcl, layer, moment[0], moment[1], node, "black", listenUpdate, null, null, false, true);
        }
    })

}


function calculateDificulty(force, moment, reactions) {
    // .getAttr("tension")[1] angulo de la fuerza
    // se le pasa la fuerza ya calculada con su tipo de fuerza
    return force + 0.05 * moment + 3 * reactions;
}




function updateClassification() {
    // tags: fuerza perpendicular, fuerza angulo, vinculo simples, empotrado, momento, superficie con inclinacion
    let tags = [];

    const allNodes = [dcl, ...dcl.getAllDecendents()]
    const nodesInitialBeam = allNodes.slice(0, 2)
    const otherNodes = allNodes.slice(2)

    originNodeY = nodesInitialBeam[0].coordinate[1];


    nodesInitialBeam.forEach(node => {

        node.forces.forEach(force => {
            if ((force[1] % 90) != 0) {
                if (tags.includes("fuerza con angulo") == false) {
                    tags.push("fuerza con angulo");
                }

            }
            else {
                if (tags.includes("fuerza perpendicular") == false) {
                    tags.push("fuerza perpendicular");
                }

            }
            if (originNodeY - node.coordinate[1] != 0) {

                if (tags.includes("desnivel") == false) {
                    tags.push("desnivel");
                }
            }
        })

        node.moments.forEach(force => {
            if (tags.includes("momento") == false) {
                tags.push("momento");
            }
        })

        if (node.link) {
            if (node.link === "pinnedSupport" || node.link === "rollerSuport") {
                if (tags.includes("apoyos simples") == false) {
                    tags.push("apoyos simples");
                }
            }
            if (node.link === "fixedSupport") {
                if (tags.includes("empotrado") == false) {
                    tags.push("empotrado");
                }
            }
        }
    })


    otherNodes.forEach(node => {
        // contando fuerzas, apoyos y momentos
        node.forces.forEach(force => {

            if ((force[1] % 90) != 0) {
                if (tags.includes("fuerza con angulo") == false) {
                    tags.push("fuerza con angulo");
                }
            }
            else {
                if (tags.includes("fuerza perpendicular") == false) {
                    tags.push("fuerza perpendicular");
                }

            }
            if (originNodeY - node.coordinate[1] != 0) {

                if (tags.includes("desnivel") == false) {
                    tags.push("desnivel");
                }
            }
        })

        node.moments.forEach(moment => {

            if (tags.includes("momento") == false) {
                tags.push("momento");
            }
        })

        if (node.link) {
            if (node.link === "pinnedSupport" || node.link === "rollerSuport") {
                if (tags.includes("apoyos simples") == false) {
                    tags.push("apoyos simples");
                }
            }
            if (node.link === "fixedSupport") {
                if (tags.includes("empotrado") == false) {
                    tags.push("empotrado");
                }
            }


        }
    })

    const pClassification = document.querySelector("#classification");

    pClassification.innerText = "Tags: " + tags;


}





function updateDificulty() {
    let forcesSum = 0;
    let momentsSum = 0;
    let linkSum = 0;

    const allNodes = [dcl, ...dcl.getAllDecendents()]
    const nodesInitialBeam = allNodes.slice(0, 2)
    const otherNodes = allNodes.slice(2)

    originNodeY = nodesInitialBeam[0].coordinate[1];
    nodesInitialBeam.forEach(node => {

        // contando fuerzas, apoyos y momentos
        node.forces.forEach(force => {
            if ((force[1] % 90) != 0) {
                forcesSum += 0.3;


            }
            else {
                forcesSum += 0.1;

            }
            if (originNodeY - node.coordinate[1] != 0) {
                forcesSum += 0.3;
            }
        })

        node.moments.forEach(force => {
            momentsSum += 1;
        })

        if (node.konvaObjects.link) {
            if (node.link === "pinnedSupport") {
                linkSum += 2
            }
            if (node.link === "fixedSupport") {
                linkSum += 3
            }
            if (node.link === "rollerSupport") {
                linkSum += 1
            }
        }
    })


    otherNodes.forEach(node => {
        // contando fuerzas, apoyos y momentos
        node.forces.forEach(force => {

            if ((force[1] % 90) != 0) {
                forcesSum += 0.3;
            }
            else {
                forcesSum += 0.1
            }
            if (originNodeY - node.coordinate[1] != 0) {
                forcesSum += 0.3;
            }
        })

        node.moments.forEach(moment => {
            momentsSum += 1;
        })

        if (node.konvaObjects.link) {
            if (node.link === "pinnedSupport") {
                linkSum += 2
            }
            if (node.link === "fixedSupport") {
                linkSum += 3
            }
            if (node.link === "rollerSupport") {
                linkSum += 1
            }
        }
    })
    const dificulty = calculateDificulty(forcesSum, momentsSum, linkSum);
    const pDificulty = document.querySelector("#difficultyValue");
    pDificulty.innerText = dificulty;
}

function drawDcl(dcl, layer, xRef, yRef, listenUpdate = true) {
    const allNodes = [dcl, ...dcl.getAllDecendents()]

    const nodesInitialBeam = allNodes.slice(0, 2)
    const otherNodes = allNodes.slice(2)

    let [x0, y0] = nodesInitialBeam[0].coordinate;
    let [x1, y1] = nodesInitialBeam[1].coordinate;

    const initialBeam = createBeam(
        layer,
        nameBeam = "initialBeam",
        _id = nodesInitialBeam[1].id,
        coordinates = [
            [x0, y0],
            [x1 - x0, y1 - y0]
        ],
        _node = nodesInitialBeam[1]
    )[1];

    initialBeam.getChildren()[1].setAttr("fill", nodeColor);

    const shadowBeam = createShadowBeam(layer, x0, y0, x1 - x0, y1 - y0);
    shadowBeam.hide();

    if (listenUpdate) {
        listenNodeMovement(dcl, initialBeam, shadowBeam, "initialBeam", listenUpdate);
    }

    drawLink(dcl, layer, nodesInitialBeam[0], listenUpdate);
    drawLink(dcl, layer, nodesInitialBeam[1], listenUpdate);

    nodesInitialBeam.forEach(node => {
        drawForces(dcl, layer, node, listenUpdate);
        drawMoments(dcl, layer, node, listenUpdate);
    })

    otherNodes.forEach(node => {
        createBeam2(layer, dcl, node, node.parent, listenUpdate)
        drawLink(dcl, layer, node, listenUpdate);
        drawForces(dcl, layer, node, listenUpdate);
        drawMoments(dcl, layer, node, listenUpdate);
    })

    dcl.findOriginNode().konvaObjects.circle.setAttr("fill", originColor);

}

function changeOrigin(listenUpdate = true) {
    const newOriginNode = dcl.findNodeById(lastNodeClick.getAttr("id"));
    const oldOriginNode = dcl.findOriginNode();
    oldOriginNode.setIsOrigin(false);
    newOriginNode.setIsOrigin(true);

    oldOriginNode.konvaObjects.circle.setAttr("fill", "red");
    newOriginNode.konvaObjects.circle.setAttr("fill", originColor);



    if (listenUpdate) {
        updateEquations();
        updateDificulty();
        updateClassification();
    }
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

function tryPushLinkMoments(linkMoments, name, proyection, dist) {
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

function tryPushLinkForces(linkForces, name, proyection) {
    if (proyection == 1) {
        linkForces.push([name, "positive"]);
        return true;

    } else if (proyection == -1) {
        linkForces.push([name, "negative"]);
        return true;
    }

    return false;


}


function calculateEquations(distanceMultiplier, dimensionValue) {
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
        const distX = Math.abs(diff.x / blockSnapSize) * distanceMultiplier;
        const distY = Math.abs(diff.y / blockSnapSize) * distanceMultiplier;

        node.moments.forEach(moment => {
            moments.push(moment[0]);
            typeOfMoments.push(moment[1]);
        })

        node.forces.forEach(force => {
            const typeForce = force[2]

            const [magnitud, angle] = force;
            if (0 == angle) {
                forcesX.push([-magnitud, typeForce]);
                if (diff.y > 0) {
                    moments.push([[-magnitud, typeForce], [distY, `${dimensionValue}`]]);
                } else if (diff.y < 0) {
                    moments.push([[magnitud, typeForce], [distY, `${dimensionValue}`]]);
                }
            } else if (0 < angle && angle < 90) {
                forcesX.push([-magnitud, `cos(${angle})${typeForce}`]);
                forcesY.push([-magnitud, `sin(${angle})${typeForce}`]);
                if ((-diff.y / diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)) {
                    // Same  Slope
                } else {
                    if (diff.x > 0) {
                        moments.push([[-magnitud, `sin(${angle})${typeForce}`], [distX, `${dimensionValue}`]]);
                    } else if (diff.x < 0) {
                        moments.push([[magnitud, `sin(${angle})${typeForce}`], [distX, `${dimensionValue}`]]);
                    }
                    if (diff.y > 0) {
                        moments.push([[-magnitud, `cos(${angle})${typeForce}`], [distY, `${dimensionValue}`]]);
                    } else if (diff.y < 0) {
                        moments.push([[magnitud, `cos(${angle})${typeForce}`], [distY, `${dimensionValue}`]]);
                    }
                }

            } else if (90 == angle) {
                forcesY.push([-magnitud, typeForce]);
                if (diff.x > 0) {
                    moments.push([[-magnitud, typeForce], [distX, `${dimensionValue}`]]);
                } else if (diff.x < 0) {
                    moments.push([[magnitud, typeForce], [distX, `${dimensionValue}`]]);
                }

            } else if (90 < angle && angle < 180) {
                forcesX.push([magnitud, `cos(${180 - angle})${typeForce}`]);
                forcesY.push([-magnitud, `sin(${180 - angle})${typeForce}`]);
                if ((-diff.y / diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)) {
                    // Same  Slope
                } else {
                    if (diff.x > 0) {
                        moments.push([[-magnitud, `sin(${angle - 90})${typeForce}`], [distX, `${dimensionValue}`]]);
                    } else if (diff.x < 0) {
                        moments.push([[magnitud, `sin(${angle - 90})${typeForce}`], [distX, `${dimensionValue}`]]);
                    }
                    if (diff.y > 0) {
                        moments.push([[magnitud, `cos(${angle - 90})${typeForce}`], [distY, `${dimensionValue}`]]);
                    } else if (diff.y < 0) {
                        moments.push([[-magnitud, `cos(${angle - 90})${typeForce}`], [distY, `${dimensionValue}`]]);
                    }
                }

            } else if (180 == angle) {
                forcesX.push([magnitud, typeForce]);
                if (diff.y > 0) {
                    moments.push([[magnitud, typeForce], [distY, `${dimensionValue}`]]);
                } else if (diff.y < 0) {
                    moments.push([[-magnitud, typeForce], [distY, `${dimensionValue}`]]);
                }
            } else if (180 < angle && angle < 270) {
                forcesX.push([magnitud, `cos(${angle - 180})${typeForce}`]);
                forcesY.push([magnitud, `sin(${angle - 180})${typeForce}`]);
                if ((-diff.y / diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)) {
                    // Same  Slope
                } else {
                    if (diff.x > 0) {
                        moments.push([[magnitud, `sin(${angle - 180})${typeForce}`], [distX, `${dimensionValue}`]]);
                    } else if (diff.x < 0) {
                        moments.push([[-magnitud, `sin(${angle - 180})${typeForce}`], [distX, `${dimensionValue}`]]);
                    }
                    if (diff.y > 0) {
                        moments.push([[magnitud, `cos(${angle - 180})${typeForce}`], [distY, `${dimensionValue}`]]);
                    } else if (diff.y < 0) {
                        moments.push([[-magnitud, `cos(${angle - 180})${typeForce}`], [distY, `${dimensionValue}`]]);
                    }
                }

            } else if (270 == angle) {
                forcesY.push([magnitud, typeForce]);
                if (diff.x > 0) {
                    moments.push([[magnitud, typeForce], [distX, `${dimensionValue}`]]);
                } else if (diff.x < 0) {
                    moments.push([[-magnitud, typeForce], [distX, `${dimensionValue}`]]);
                }
            } else if (270 < angle && angle < 360) {
                forcesX.push([-magnitud, `cos(${360 - angle})${typeForce}`]);
                forcesY.push([magnitud, `sin(${360 - angle})${typeForce}`]);
                if ((-diff.y / diff.x).toFixed(4) == Math.tan(degToRad(angle)).toFixed(4)) {
                    // Same  Slope
                } else {
                    if (diff.x > 0) {
                        moments.push([[magnitud, `sin(${360 - angle})${typeForce}`], [distX, `${dimensionValue}`]]);
                    } else if (diff.x < 0) {
                        moments.push([[-magnitud, `sin(${360 - angle})${typeForce}`], [distX, `${dimensionValue}`]]);
                    }
                    if (diff.y > 0) {
                        moments.push([[-magnitud, `cos(${360 - angle})${typeForce}`], [distY, `${dimensionValue}`]]);
                    } else if (diff.y < 0) {
                        moments.push([[magnitud, `cos(${360 - angle})${typeForce}`], [distY, `${dimensionValue}`]]);
                    }
                }

            }
        })


        if (node.link === "fixedSupport" || node.link === "pinnedSupport") {
            if (node.link === "fixedSupport") {
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

            if (prettyAngleFx != 0 && prettyAngleFx != 90) {
                coeffxx = `*cos(${prettyAngleFx})`;
                coeffxy = `*sin(${prettyAngleFx})`;
            }

            if (prettyAngleFy != 0 && prettyAngleFy != 90) {
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

            if (prettyAngleFy != 0 && prettyAngleFy != 90) {
                coeffyx = `*cos(${prettyAngleFy})`;
                coeffyy = `*sin(${prettyAngleFy})`;
            }

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

    let i = 0;
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
    const [Fx, Fy, M] = calculateEquations(distanceMultiplier, dimensionValue);

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

function showModal(container, modal) {
    movePanelTo(container, modal, lastBeamNodeClick.x, lastBeamNodeClick.y);
    modal.style.visibility = "visible";
}

function createGenericModalRotation(Idname) {
    const widthModal = 200;
    const heightModal = 160;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = divKonvaContainer.getBoundingClientRect().left + "px";
    modal.style.top = divKonvaContainer.getBoundingClientRect().left + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = "rgb(0, 83, 56)";
    modal.style.border = "10px outset rgb(128, 70, 16)";
    modal.style.borderRadius = "5px";
    modal.style.padding = "10px";
    modal.style.visibility = "hidden";
    modal.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    modal.style.display = "grid";
    modal.style.gridTemplateRows = "1fr 1fr 1fr";
    modal.style.gridTemplateColumns = "1fr";
    modal.id = Idname;

    const textAngle = createBelementForGrid("Angulo (sexagesimal)", "1", "1")

    const inputContainer = createContainerForElementGrid("2", "1");
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.max = 359;
    input.value = 0;
    input.style.width = "80px"
    input.style.gridRow = "2";
    input.className = "form-control";

    inputContainer.appendChild(input);

    modal.appendChild(textAngle);
    modal.appendChild(inputContainer);

    return modal;
}

function createModalFixedSupport(container, layer, dcl, listenUpdate = true) {
    const modal = createGenericModalRotation("modalFixedSupport");
    const select = modal.children[1].children[0];
    const button = createButton(container, layer, dcl, modal.style.width, modal.style.height, "modalRotationBtn", "Crear", createFixedSupport, null, null, null, null, selectObj = select, null, null, listenUpdate);

    button.style.gridRow = "3";
    button.style.width = "120px";
    button.style.height = "40px";
    button.style.margin = "5px";
    button.style.color = "white";

    const buttonContainer = createContainerForElementGrid("3", "1");
    buttonContainer.appendChild(button);

    modal.appendChild(buttonContainer);
    return modal;
}

function createModalRollerSupport(container, layer, dcl, listenUpdate = true) {
    const modal = createGenericModalRotation("modalRollerSupport");
    const select = modal.children[1].children[0];
    const button = createButton(container, layer, dcl, modal.style.width, modal.style.height, "modalRotationBtn", "Crear", createRollerSupport, null, null, null, null, selectObj = select, null, null, listenUpdate);

    button.style.gridRow = "3";
    button.style.width = "120px";
    button.style.height = "40px";
    button.style.margin = "5px";
    button.style.color = "white";

    const buttonContainer = createContainerForElementGrid("3", "1");
    buttonContainer.appendChild(button);

    modal.appendChild(buttonContainer);
    return modal;
}

function createModalPinnedSupport(container, layer, dcl, listenUpdate = true) {
    const modal = createGenericModalRotation("modalPinnedSupport");
    const select = modal.children[1].children[0];
    const button = createButton(container, layer, dcl, modal.style.width, modal.style.height, "modalRotationBtn", "Crear", createPinnedSupport, null, null, null, null, selectObj = select, null, null, listenUpdate);

    button.style.gridRow = "3";
    button.style.width = "120px";
    button.style.height = "40px";
    button.style.margin = "5px";
    button.style.color = "white";

    const buttonContainer = createContainerForElementGrid("3", "1");
    buttonContainer.appendChild(button);

    modal.appendChild(buttonContainer);
    return modal;
}

function removeDraggableFromAllNodes(dcl) {
    const beamNames = new Set(["subElementBeamCircle", "subElementBeamCircle1", "subElementBeamCircle2"]);
    const allNodes = [dcl, ...dcl.getAllDecendents()];
    allNodes.forEach(node => {
        const beam = node.konvaObjects.beam
        if (beam) {
            beam.getChildren(child => beamNames.has(child.name())).forEach(child => {
                child.setAttr("draggable", false);
            })
        } node.coordinate
        const forces = node.konvaObjects.forces;
        forces.forEach(force => {

            force.getChildren()[0].setAttr("draggable", false);

        })
    })
}

function addDraggableToAllNodes(dcl) {
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

function visibilityLines(layer, lineType, viewType) {
    const lines = layer.find(node => node.name() === lineType);
    lines.forEach(line => {
        if (viewType === "hide") {
            line.hide();
        } else if (viewType === "show") {
            line.show();
        }
    });

}


function showReferences() {
    const check = document.querySelector("#showReferences");
    //activateReferences();
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



function turnToRealDCL(dcl, layer, listenUpdate = true) {
    const check = document.querySelector("#turnToRealDCL");

    check.addEventListener("change", () => {
        const allNodes = [dcl, ...dcl.getAllDecendents()];

        if (check.checked) {
            removeDraggableFromAllNodes(dcl);
            turnToRealDCLFlag = true;

            allNodes.forEach(node => {
                const [x, y] = node.coordinate;
                if (node.konvaObjects.link) {
                    node.konvaObjects.link.hide();

                    const supportAngle = parseFloat(node.linkRotation);

                    const forceAngleX = angleFx(supportAngle);
                    const Xx = x - lasForce * Math.cos(degToRad(forceAngleX));
                    const Yx = y + lasForce * Math.sin(degToRad(forceAngleX));

                    const forceAngleY = angleFy(supportAngle);
                    const Xy = x - lasForce * Math.cos(degToRad(forceAngleY));
                    const Yy = y + lasForce * Math.sin(degToRad(forceAngleY));

                    if (node.link === "fixedSupport" || node.link === "pinnedSupport") {
                        const forceX = createForce(dcl, layer, `${node.name}x`, forceAngleX, "Reaction", node, "green", listenUpdate, Xx, Yx, false, false);
                        node.setKonvaForceXsupport(forceX);
                    }
                    if (node.link === "fixedSupport" || node.link === "pinnedSupport" || node.link === "rollerSupport") {
                        const forceY = createForce(dcl, layer, `${node.name}y`, forceAngleY, "Reaction", node, "green", listenUpdate, Xy, Yy, false, false);
                        node.setKonvaForceYsupport(forceY);
                    }
                    if (node.link === "fixedSupport") {
                        const moment = createMoment(dcl, layer, `${node.name}m`, "Reaction", node, "green", listenUpdate, x, y, false, false)
                        node.setKonvaMomentSupport(moment);
                    }
                    node.setTurnedToRealDCL(true);
                }
            });

            visibilityLines(layer, "horizontalLine", "hide");
            visibilityLines(layer, "verticalLine", "hide");

        } else {
            addDraggableToAllNodes(dcl);
            turnToRealDCLFlag = false;
            allNodes.forEach(node => {
                const [x, y] = node.coordinate;
                if (node.link) {
                    node.konvaObjects.link.show();
                    if (node.konvaObjects.forceXsupport) node.konvaObjects.forceXsupport.destroy();
                    if (node.konvaObjects.forceYsupport) node.konvaObjects.forceYsupport.destroy();
                    if (node.konvaObjects.momentSupport) node.konvaObjects.momentSupport.destroy();
                }

            })
            visibilityLines(layer, "horizontalLine", "show");
            visibilityLines(layer, "verticalLine", "show");
        }
    })


}

function angleFx(angle) {
    if (angle >= 0 && angle <= 180) {
        return 180 - angle
    } else if (angle > 180 && angle < 360) {
        return 540 - angle
    }
}

function angleFy(angle) {
    if (angle >= 0 && angle <= 270) {
        return 270 - angle
    } else if (angle > 270 && angle < 360) {
        return 630 - angle
    }
}


function proyection(angle) {
    function change(r, vx, vy) {
        r.x = vx;
        r.y = vy;
    }

    const r = { x: null, y: null }
    if (angle == 0) {
        change(r, -1, 0);
    } else if (angle > 0 && angle < 90) {
        change(r, -1, -1);
    } else if (angle == 90) {
        change(r, 0, -1);
    } else if (angle > 90 && angle < 180) {
        change(r, 1, -1);
    } else if (angle == 180) {
        change(r, 1, 0);
    } else if (angle > 180 && angle < 270) {
        change(r, 1, 1);
    } else if (angle == 270) {
        change(r, 0, 1);
    } else if (angle > 270 && angle < 360) {
        change(r, -1, 1);
    }

    return r;
}

function prettyAngle(angle) {
    if (0 <= angle && angle < 90) {
        return angle
    } else if (90 <= angle && angle < 180) {
        return 180 - angle
    } else if (180 <= angle && angle < 270) {
        return angle - 180
    } else if (270 <= angle && angle < 360) {
        return 360 - angle;
    }
}

function changeDimensions(listenUpdate = true) {
    const algo = document.querySelector("#dim");
    x_reference.newUnitSize(algo.value);
    y_reference.newUnitSize(algo.value);


    x_reference.buildLine();
    x_reference.drawIndexes();
    x_reference.updateSegmentedLines();
    y_reference.buildLine();
    y_reference.drawIndexes();
    y_reference.updateSegmentedLines();

    if (algo.value < 1) {
        unitSize = algo.value * 100; // ahora esta en cm
        dimensionValue = "cm";
        distanceMultiplier = unitSize;

    }
    else {
        dimensionValue = "m";
        distanceMultiplier = algo.value;
    }
    if (listenUpdate) {
        updateEquations();
    }

}


function helloWorld() {
    console.log("hello world");
}

function findMinCoordinate(coordinates) {
    //en esta funcion se encuentra la coordenada mas a la izquierda y mas arriba para setear el marco de referencia
    let minXCoordoinates = [];

    const minX = Math.min(...coordinates.map(coord => coord[0]));

    for (let i = 0; i < coordinates.length; i++) {
        if (coordinates[i][0] == minX) {
            minXCoordoinates.push(coordinates[i]);

        }
    }
    const minY = Math.min(...minXCoordoinates.map(coord => coord[1]));
    const minCoordinate = [minX, minY];
    return minCoordinate;

}
function standarizeDCL(DCL) {

    let coordinates = [];
    // const copyDCL = Object.assign({}, DCL);

    const allNodes = [DCL, ...DCL.getAllDecendents()]
    allNodes.forEach(node => {

    })

    const nodesInitialBeam = allNodes.slice(0, 2)
    const otherNodes = allNodes.slice(2)


    nodesInitialBeam.forEach(node => {
        coordinates.push(node.coordinate);
    })
    otherNodes.forEach(node => {
        coordinates.push(node.coordinate);
    })

    const minCoordinate = findMinCoordinate(coordinates);

    // console.log(JSON.parse(JSON.stringify(coordinates)))

    for (let i = 0; i < coordinates.length; i++) {
        coordinates[i][0] -= minCoordinate[0];
        coordinates[i][1] -= minCoordinate[1];
    }

    //console.log(coordinates);
    return DCL
}

function areDclEqual(dcl1, dcl2) {

    const coordinates = [];


    const allNodes = [dcl1, ...dcl1.getAllDecendents()]
    allNodes.forEach(node => {
        delete node.id;
        delete node.konvaObjects;
        delete node.parent;
        delete node.name;
        delete node.turnedToRealDCL;
    })

    const nodesInitialBeam = allNodes.slice(0, 2)
    const otherNodes = allNodes.slice(2)


    nodesInitialBeam.forEach(node => {
        coordinates.push(node.coordinate);
    })
    otherNodes.forEach(node => {
        coordinates.push(node.coordinate);
    })

    ///

    const allNodes2 = [dcl2, ...dcl2.getAllDecendents()]
    allNodes2.forEach(node => {
        delete node.id;
        delete node.konvaObjects;
        delete node.parent;
        delete node.name;
        delete node.turnedToRealDCL;

        // console.log("EDIT ASK node 2: ", node);
    })

    const nodesInitialBeam2 = allNodes2.slice(0, 2)
    const otherNodes2 = allNodes2.slice(2)


    nodesInitialBeam2.forEach(node => {
        // coordinates.push(node.coordinate);
    })
    otherNodes2.forEach(node => {
        // coordinates.push(node.coordinate);
    })

    stringifyDcl1 = JSON.stringify(dcl1);
    stringifyDcl2 = JSON.stringify(dcl2);

    if (stringifyDcl1 == stringifyDcl2) {
        return true;
    } else {
        return false;
    }

}

function getCopyDcl(dcl) {

    const info = {}
    nodesHash = {}

    const allNodes = [dcl, ...dcl.getAllDecendents()];
    const allNodesCopy = allNodes.map(node => {
        const newCopyNode = new Node();

        newCopyNode.setId(node.id);
        newCopyNode.setCoordinate(node.coordinate);
        newCopyNode.setIsOrigin(node.isOrigin);
        newCopyNode.setLink(node.link);
        newCopyNode.setLinkRotation(node.linkRotation);
        newCopyNode.setName(node.name);

        if (node.forces) node.forces.forEach(force => {
            newCopyNode.addForce(force[0], force[1], force[2]);
        });

        if (node.moment) node.moment.forEach(moment => {
            newCopyNode.addMoment(moment[0], moment[1]);
        });

        if (node.step3.forcesX) newCopyNode.step3.forcesX = node.step3.forcesX;
        if (node.step3.forcesY) newCopyNode.step3.forcesY = node.step3.forcesY;
        if (node.step3.moments) newCopyNode.step3.moments = node.step3.moments;
        if (node.step3.axisXsupport) newCopyNode.step3.axisXsupport = node.step3.axisXsupport;
        if (node.step3.axisYsupport) newCopyNode.step3.axisYsupport = node.step3.axisYsupport;
        if (node.step3.momentsSupport) newCopyNode.step3.momentsSupport = node.step3.momentsSupport;

        const nodeInfo = {}
        nodeInfo.parentId = node.parent ? node.parent.id : undefined
        nodeInfo.childNodes = node.childNodes.map(child => child.id);

        info[`${node.id}`] = nodeInfo;
        nodesHash[`${node.id}`] = newCopyNode;
        return newCopyNode;
    });

    allNodesCopy.forEach(node => {
        const nodeInfo = info[`${node.id}`];
        node.parent = nodeInfo.parentId ? nodesHash[`${nodeInfo.parentId}`] : undefined;
        node.childNodes = nodeInfo.childNodes.map(childId => nodesHash[`${childId}`]);
        removeAttributesForJSON(node);
    });

    return allNodesCopy[0];

}

function removePaintIsMouseOver(node) {
    if (node.konvaObjects.link) {
        node.konvaObjects.link.getChildren().forEach(child => {
            child.off("mouseenter");
            child.off("mouseleave");
        });
    }

    if (node.konvaObjects.circle) {
        node.konvaObjects.circle.off("mouseleave");
        node.konvaObjects.circle.off("mouseenter");
    }

    if (node.konvaObjects.beam) {
        node.konvaObjects.beam.getChildren().forEach(child => {
            child.off("mouseenter");
            child.off("mouseleave");
        });
    }

    node.konvaObjects.forces.forEach(force => {
        force.getChildren().forEach(child => {
            child.off("mouseenter");
            child.off("mouseleave");
        });
    });

    node.konvaObjects.moments.forEach(moment => {
        moment.getChildren().forEach(child => {
            child.off("mouseenter");
            child.off("mouseleave");
        });
    });
}


function createPanelStep3(container, layer, dcl, choiceForceModal, choiceMomentModal, listenUpdate=true) {
    const widthPanel = WIDTHPANEL;
    const heightPanel = HEIGHTPANEL / 3;

    const heightPanelElement = heightPanel / 4;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.top = divKonvaContainer.getBoundingClientRect().left + "px";
    panel.style.width = widthPanel + "px";
    panel.style.height = heightPanel + "px";
    panel.style.backgroundColor = "rgb(0, 83, 56)";
    panel.style.border = "10px outset rgb(128, 70, 16)";
    panel.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    panel.style.borderRadius = "10px";

    const headerPanel = document.createElement("div");
    headerPanel.style.width = "100%";
    headerPanel.style.height = "15%";
    headerPanel.style.backgroundColor = "rgb(128, 70, 16)";
    headerPanel.style.display = "flex";
    headerPanel.style.justifyContent = "center";
    headerPanel.style.alignItems = "center";
    headerPanel.innerText = "Elementos";
    headerPanel.style.fontSize = "20px";
    headerPanel.style.color = "white";

    const bodyPanel = document.createElement("div");

    bodyPanel.style.width = "100%";
    bodyPanel.style.height = "75%";
    bodyPanel.style.padding = "7px";
    bodyPanel.style.backgroundColor = "rgb(0, 83, 56)";
    bodyPanel.style.display = "grid";
    bodyPanel.style.gridTemplateColumns = "1fr 1fr";
    bodyPanel.style.gridTemplateRows = "1fr 1fr 1fr 1fr";

    const imgMoment = `url(${imagesFolder}/moment.png)`;
    const imgForce = `url(${imagesFolder}/force.png)`;

    const btnForce = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "modalBtn", "Force", showModal, image = imgForce, null, null, null, null, choiceForceModal, null, listenUpdate);
    const btnMoment = createButton(container, layer, dcl, widthPanel / 2, heightPanelElement, "modalBtn", "Moment", showModal, image = imgMoment, null, null, null, null, choiceMomentModal, null, listenUpdate = listenUpdate);

    styleForElementGridPanel(btnForce, "1", "1");
    styleForElementGridPanel(btnMoment, "1", "2");

    bodyPanel.appendChild(btnForce);
    bodyPanel.appendChild(btnMoment);

    panel.appendChild(headerPanel);
    panel.appendChild(bodyPanel);

    return panel;
}


function createGenericModalChoice(container, layer, dcl, listenUpdate=true) {
    const widthModal = 200;
    const heightModal = 160;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = container.getBoundingClientRect().left + "px";
    modal.style.top = container.getBoundingClientRect().left + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = "rgb(0, 83, 56)";
    modal.style.border = "10px outset rgb(128, 70, 16)";
    modal.style.borderRadius = "5px";
    modal.style.padding = "10px";
    modal.style.visibility = "visible";
    modal.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    modal.style.display = "grid";
    modal.style.gridTemplateRows = "1fr 1fr";
    modal.style.gridTemplateColumns = "1fr";

    return modal;
}



function createModalChoiceForce(container, layer, dcl, modalReactionForce, modalpointForce, listenUpdate=true) {
    const modal = createGenericModalChoice(container, layer, dcl, listenUpdate);
    console.log(modalpointForce)
    const pointForce = createButton(container, layer, dcl, 0, 0, "choiceBtn", "Fuerza puntual", showModal, null, null, null, null, null, modalpointForce, null, listenUpdate);
    const reactionForce = createButton(container, layer, dcl, 0, 0, "choiceBtn", "Reaccion apoyo", showModal, null, null, null, null, null, modalReactionForce, null, listenUpdate);

    pointForce.innerText = "Fuerza puntual";
    reactionForce.innerText = "Reaccion apoyo";

    styleForElementGridPanel(pointForce, "1", "1");
    styleForElementGridPanel(reactionForce, "2", "1");

    modal.appendChild(pointForce);
    modal.appendChild(reactionForce);

    return modal;
}

function createModalChoiceMoment(container, layer, dcl, modalPointMoment, listenUpdate=true) {
    const modal = createGenericModalChoice(container, layer, dcl, listenUpdate);

    const pointMoment = createButton(container, layer, dcl, 0, 0, "choiceBtn", "Momento puntual", showModal, null, null, null, null, modalPointMoment, null, listenUpdate);
    const reactionMoment = createButton(container, layer, dcl, 0, 0, "choiceBtn", "Reaccion apoyo", showModal, null, null, null, null, null, null, listenUpdate);
    
    pointMoment.innerText = "Momento puntual";
    reactionMoment.innerText = "Reaccion apoyo";

    styleForElementGridPanel(pointMoment, "1", "1");
    styleForElementGridPanel(reactionMoment, "2", "1");

    modal.appendChild(pointMoment);

    return modal;

}

function createModalReactionForce(container, layer, dcl, listenUpdate=true) {
    console.log(listenUpdate)
    const widthModal = 200;
    const heightModal = 160;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = container.getBoundingClientRect().left + "px";
    modal.style.top = container.getBoundingClientRect().left + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = "rgb(0, 83, 56)";
    modal.style.border = "10px outset rgb(128, 70, 16)";
    modal.style.borderRadius = "5px";
    modal.style.padding = "10px";
    modal.style.visibility = "hidden";
    modal.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    modal.style.display = "grid";
    modal.style.gridTemplateRows = "1fr 1fr 1fr";
    modal.style.gridTemplateColumns = "1fr";

    const textAngle = createBelementForGrid("Angulo (sexagesimal)", "1", "1")

    const inputContainer = createContainerForElementGrid("2", "1");
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.max = 359;
    input.value = 0;
    input.style.width = "80px"
    input.style.gridRow = "2";
    input.className = "form-control";
    inputContainer.appendChild(input);

    const textType = createBelementForGrid("Reaccion (Rx/Ry)", "3", "1")
    const typeContainer = createContainerForElementGrid("2", "1");

    const select = document.createElement("select");
    select.className = "form-select"
    select.style.fontSize = "14px";

    const optionRx = document.createElement("option");
    const optionRy = document.createElement("option");

    optionRx.value = "Rx";
    optionRy.value = "Ry";
    optionRx.innerText = "Rx";
    optionRy.innerText = "Ry";

    select.appendChild(optionRx);
    select.appendChild(optionRy);
    typeContainer.appendChild(select);

    const button = createButton(container, layer, dcl, widthModal / 2, heightModal / 4, "createForeceReactionStep3", "Crear", createForce, null, select, input, null, null, modal, null, listenUpdate);

    modal.appendChild(textAngle);
    modal.appendChild(inputContainer);
    modal.appendChild(textType);
    modal.appendChild(typeContainer);
    modal.appendChild(button);

    return modal;

}


function createModalChoiceMoment(container, layer, dcl, modalPointMoment, modalReactionSupport, listenUpdate=true) {
    console.log(modalPointMoment)
    const modal = createGenericModalChoice(container, layer, dcl, listenUpdate);

    const pointMoment = createButton(container, layer, dcl, 0, 0, "choiceBtn", "Momento puntual", showModal, null, null, null, null, null, modalPointMoment, null, listenUpdate);
    const reactionMoment = createButton(container, layer, dcl, 0, 0, "createMomentReactionStep3", "Reaccion apoyo", createMoment, null, null, null, null, null, modalReactionSupport, null, listenUpdate = listenUpdate);

    pointMoment.innerText = "Momento puntual";
    reactionMoment.innerText = "Reaccion apoyo";

    styleForElementGridPanel(pointMoment, "1", "1");
    styleForElementGridPanel(reactionMoment, "2", "1");

    modal.appendChild(pointMoment);
    modal.appendChild(reactionMoment);

    return modal;
}


function createModalPointForce(container, layer, dcl, listenUpdate=false) {
    const widthModal = 250;
    const heightModal = 300;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = container.getBoundingClientRect().left + "px";
    modal.style.top = container.getBoundingClientRect().left + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = "rgb(0, 83, 56)";
    modal.style.border = "10px outset rgb(128, 70, 16)";
    modal.style.borderRadius = "5px";
    modal.style.padding = "10px";
    // modal.style.visibility = "hidden";
    modal.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    modal.style.display = "grid";
    modal.style.gridTemplateRows = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
    modal.style.gridTemplateColumns = "1fr 1fr";

    modal.style.placeItems = "center";
    modal.style.justifyContent = "center";
    

    const textProyection = createBelementForGrid("Proyeccion", "1", "1")
    modal.appendChild(textProyection);

    const proyection = document.createElement("select");
    proyection.className = "form-select"
    proyection.style.fontSize = "14px";
    proyection.style.width = "90px"
    proyection.style.height = "30px"
    proyection.style.gridRow = "1";
    proyection.style.gridColumn = "2";
    const optionX = document.createElement("option");
    const optionY = document.createElement("option");
    optionX.value = "vertical";
    optionY.value = "horizontal";
    optionX.innerText = "Vertical";
    optionY.innerText = "Horizontal";
    proyection.appendChild(optionX);
    proyection.appendChild(optionY);

    modal.appendChild(proyection);

    const signProyection = createBelementForGrid("Signo", "2", "1")
    modal.appendChild(signProyection);

    const sign = document.createElement("select");
    sign.className = "form-select"
    sign.style.fontSize = "14px";
    sign.style.width = "90px"
    sign.style.height = "30px"
    sign.style.gridRow = "2";
    sign.style.gridColumn = "2";
    const optionPositive = document.createElement("option");
    const optionNegative = document.createElement("option");
    optionPositive.value = "+";
    optionNegative.value = "-";
    optionPositive.innerText = "Positivo";
    optionNegative.innerText = "Negativo";
    sign.appendChild(optionPositive);
    sign.appendChild(optionNegative);

    modal.appendChild(sign);

    const textTrigonometry = createBelementForGrid("Trigonometria", "3", "1")
    modal.appendChild(textTrigonometry);
    
    const trigonometry = document.createElement("select");
    trigonometry.className = "form-select"
    trigonometry.style.fontSize = "14px";
    trigonometry.style.width = "90px"
    trigonometry.style.height = "30px"
    trigonometry.style.gridRow = "3";
    trigonometry.style.gridColumn = "2";
    const optionSin = document.createElement("option");
    const optionCos = document.createElement("option");
    const optionNone = document.createElement("option");

    optionSin.value = "sin";
    optionCos.value = "cos";
    optionNone.value = "none";

    optionSin.innerText = "Seno";
    optionCos.innerText = "Coseno";
    optionNone.innerText = "Ninguno";

    trigonometry.appendChild(optionSin);
    trigonometry.appendChild(optionCos);
    trigonometry.appendChild(optionNone);

    modal.appendChild(trigonometry);

    const textAngle = createBelementForGrid("Angulo", "4", "1")
    modal.appendChild(textAngle);

    const angle = document.createElement("input");
    angle.type = "number";
    angle.min = 0;
    angle.max = 359;
    angle.value = 0;
    angle.className = "form-control";
    angle.style.fontSize = "14px";
    angle.style.width = "90px"
    angle.style.height = "30px"
    angle.style.gridRow = "4";
    angle.style.gridColumn = "2";

    modal.appendChild(angle);

    trigonometry.addEventListener("change", (e) => {
        if (e.target.value === "none") {
            angle.disabled = true;
            angle.value = null;
        } else {
            angle.disabled = false;

            angle.value = 0;
        }
    });

    const textMagnitud = createBelementForGrid("Magnitud", "5", "1")
    modal.appendChild(textMagnitud);

    const magnitud = document.createElement("input");
    magnitud.type = "number";
    magnitud.min = 0;
    magnitud.max = 1000;
    magnitud.value = 0;
    magnitud.className = "form-control";
    magnitud.style.fontSize = "14px";
    magnitud.style.width = "90px"
    magnitud.style.height = "30px"
    magnitud.style.gridRow = "5";
    magnitud.style.gridColumn = "2";

    modal.appendChild(magnitud);

    const textType = createBelementForGrid("Unidad", "6", "1")
    modal.appendChild(textType);

    const type = document.createElement("select");
    type.className = "form-select"
    type.style.fontSize = "14px";
    type.style.width = "90px"
    type.style.height = "30px"
    type.style.gridRow = "6";
    type.style.gridColumn = "2";

    const optionKip = document.createElement("option");
    const optionN = document.createElement("option");
    const optionKN = document.createElement("option");

    optionKip.value = "kip";
    optionN.value = "N";
    optionKN.value = "kN";

    optionKip.innerText = "Kip";
    optionN.innerText = "N";
    optionKN.innerText = "kN";

    type.appendChild(optionKip);
    type.appendChild(optionN);
    type.appendChild(optionKN);

    modal.appendChild(type);

    const extra = {
        proyection: proyection,
        sign: sign,
        trigonometry: trigonometry,
        angle: angle,
        magnitud: magnitud,
        type: type
    }
    const button = createButton(container, layer, dcl, 0, 0, "createPointForceStep3", "Crear", createForce, null, null, null, null, null, null, null, listenUpdate, extra)
    button.style.gridRow = "7";
    button.style.gridColumn = "2";

    button.style.width = "120px";
    button.style.height = "40px";
    button.style.margin = "5px";
    button.style.color = "white";
    button.innerHTML = "Crear";

    modal.appendChild(button);

    return modal;
}


function createModalReactionForce2(container, layer, dcl, listenUpdate=false) {
    const widthModal = 250;
    const heightModal = 300;

    const modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.style.left = container.getBoundingClientRect().left + "px";
    modal.style.top = container.getBoundingClientRect().left + "px";
    modal.style.width = widthModal + "px";
    modal.style.height = heightModal + "px";
    modal.style.backgroundColor = "rgb(0, 83, 56)";
    modal.style.border = "10px outset rgb(128, 70, 16)";
    modal.style.borderRadius = "5px";
    modal.style.padding = "10px";
    // modal.style.visibility = "hidden";
    modal.style.boxShadow = "10px 10px 5px 0px rgba(0,0,0,0.75)";
    modal.style.display = "grid";
    modal.style.gridTemplateRows = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
    modal.style.gridTemplateColumns = "1fr 1fr";

    modal.style.placeItems = "center";
    modal.style.justifyContent = "center";

    const textReaction = createBelementForGrid("Reaccion", "1", "1")
    modal.appendChild(textReaction);

    const reaction = document.createElement("select");
    reaction.className = "form-select"
    reaction.style.fontSize = "14px";
    reaction.style.width = "90px"
    reaction.style.height = "30px"
    reaction.style.gridRow = "1";
    reaction.style.gridColumn = "2";
    const optionRx = document.createElement("option");
    const optionRy = document.createElement("option");
    optionRx.value = "Rx";
    optionRy.value = "Ry";
    optionRx.innerText = "Rx";
    optionRy.innerText = "Ry";
    reaction.appendChild(optionRx);
    reaction.appendChild(optionRy);

    modal.appendChild(reaction);
    

    const textProyection = createBelementForGrid("Proyeccion", "2", "1")
    modal.appendChild(textProyection);

    const proyection = document.createElement("select");
    proyection.className = "form-select"
    proyection.style.fontSize = "14px";
    proyection.style.width = "90px"
    proyection.style.height = "30px"
    proyection.style.gridRow = "2";
    proyection.style.gridColumn = "2";
    const optionX = document.createElement("option");
    const optionY = document.createElement("option");
    optionX.value = "vertical";
    optionY.value = "horizontal";
    optionX.innerText = "Vertical";
    optionY.innerText = "Horizontal";
    proyection.appendChild(optionX);
    proyection.appendChild(optionY);

    modal.appendChild(proyection);

    const signProyection = createBelementForGrid("Signo", "3", "1")
    modal.appendChild(signProyection);

    const sign = document.createElement("select");
    sign.className = "form-select"
    sign.style.fontSize = "14px";
    sign.style.width = "90px"
    sign.style.height = "30px"
    sign.style.gridRow = "3";
    sign.style.gridColumn = "2";
    const optionPositive = document.createElement("option");
    const optionNegative = document.createElement("option");
    optionPositive.value = "+";
    optionNegative.value = "-";
    optionPositive.innerText = "Positivo";
    optionNegative.innerText = "Negativo";
    sign.appendChild(optionPositive);
    sign.appendChild(optionNegative);

    modal.appendChild(sign);

    const textTrigonometry = createBelementForGrid("Trigonometria", "4", "1")
    modal.appendChild(textTrigonometry);
    
    const trigonometry = document.createElement("select");
    trigonometry.className = "form-select"
    trigonometry.style.fontSize = "14px";
    trigonometry.style.width = "90px"
    trigonometry.style.height = "30px"
    trigonometry.style.gridRow = "4";
    trigonometry.style.gridColumn = "2";
    const optionSin = document.createElement("option");
    const optionCos = document.createElement("option");
    const optionNone = document.createElement("option");

    optionSin.value = "sin";
    optionCos.value = "cos";
    optionNone.value = "none";

    optionSin.innerText = "Seno";
    optionCos.innerText = "Coseno";
    optionNone.innerText = "Ninguno";

    trigonometry.appendChild(optionSin);
    trigonometry.appendChild(optionCos);
    trigonometry.appendChild(optionNone);

    modal.appendChild(trigonometry);


    const textAngle = createBelementForGrid("Angulo", "5", "1")
    modal.appendChild(textAngle);

    const angle = document.createElement("input");
    angle.type = "number";
    angle.min = 0;
    angle.max = 359;
    angle.value = 0;
    angle.className = "form-control";
    angle.style.fontSize = "14px";
    angle.style.width = "90px"
    angle.style.height = "30px"
    angle.style.gridRow = "5";
    angle.style.gridColumn = "2";

    modal.appendChild(angle);
    
    trigonometry.addEventListener("change", (e) => {
        if (e.target.value === "none") {
            angle.disabled = true;
            angle.value = null;
        } else {
            angle.disabled = false;

            angle.value = 0;
        }
    });

    const extra = {
        reaction: reaction,
        proyection: proyection,
        sign: sign,
        trigonometry: trigonometry,
        angle: angle
    }

    const button = createButton(container, layer, dcl, 0, 0, "createForeceReactionStep32", "Crear", createForce, null, null, null, null, null, null, null, listenUpdate, extra)
    button.style.gridRow = "7";
    button.style.gridColumn = "2";

    button.style.width = "120px";
    button.style.height = "40px";
    button.style.margin = "5px";
    button.style.color = "white";
    button.innerHTML = "Crear";

    modal.appendChild(button);

    return modal;
}







