function updateBeam(beam, shadow) {
    const beamList = beam.getChildren();
    const shadowList = shadow.getChildren();
    beamList[1].on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
        beam.moveToTop();
    });

    beamList[1].on("dragmove", () => {
        const circle1Pos = beamList[1].getPosition();
        const circle2Pos = beamList[2].getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        beamList[0].position(circle1Pos);
        beamList[0].points([0, 0, circle2Pos.x - circle1Pos.x, circle2Pos.y - circle1Pos.y]);

        beamList[1].position({x: circle1Pos.x, y: circle1Pos.y});
        shadowList[1].position({
            x: Math.round(circle1Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle1Pos.y / blockSnapSize) * blockSnapSize
        });

        shadowList[0].position(circle2Pos);
        shadowList[0].points([0, 0, shadowCircle1Pos.x - circle2Pos.x, shadowCircle1Pos.y - circle2Pos.y]);
    })

    beamList[1].on("dragend", () => {
        const circle2Pos = beamList[2].getPosition();
        const shadowCircle1Pos = shadowList[1].getPosition();

        const newX = circle2Pos.x - shadowCircle1Pos.x;
        const newY = circle2Pos.y - shadowCircle1Pos.y;

        beamList[0].position(shadowCircle1Pos);
        beamList[0].points([0, 0, newX, newY]);
        beamList[1].position({
            x: shadowCircle1Pos.x,
            y: shadowCircle1Pos.y
        });

        shadowList[0].position(beamList[0].position());
        shadow.hide();
        updateAll();
    });

    beamList[2].on("dragstart", () => {
        shadow.show();
        shadow.moveToTop();
        beam.moveToTop();
    });

    beamList[2].on("dragmove", () => {
        const linePos = beamList[0].getPosition();
        const circle2Pos = beamList[2].getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        beamList[0].points([0, 0, circle2Pos.x - linePos.x, circle2Pos.y - linePos.y])
        shadowList[0].points([0, 0, newX, newY])

        beamList[2].position({x: circle2Pos.x, y: circle2Pos.y})
        shadowList[2].position({
            x: Math.round(circle2Pos.x / blockSnapSize) * blockSnapSize,
            y: Math.round(circle2Pos.y / blockSnapSize) * blockSnapSize
        });
    });

    beamList[2].on("dragend", () => {
        const linePos = beamList[0].getPosition();
        const circle2Pos = beamList[2].getPosition();
        const shadowCircle2Pos = shadowList[2].getPosition();

        const newX = Math.round((circle2Pos.x - linePos.x) / blockSnapSize) * blockSnapSize
        const newY = Math.round((circle2Pos.y - linePos.y) / blockSnapSize) * blockSnapSize

        beamList[0].points([0, 0, newX, newY])
        beamList[2].position({
            x: shadowCircle2Pos.x,
            y: shadowCircle2Pos.y
        });
        shadow.hide();
        updateAll();
    });
}


function createBeam(nameBeam="beam") {
    let x0 = lastBeamNodeClick.x
    let y0 = lastBeamNodeClick.y
    const y1 = 0;
    const x1 = blockSnapSize * 3;

    let nameShadow = "shadow-beam";
    if (nameBeam == "initialBeam") {
        x0 = blockSnapSize * 8;
        y0 = blockSnapSize * 8;
        nameShadow = "shadow-initialBeam"
    }

    const line = newBeam(x0, y0, x1, y1, nameBeam);
    const shadowLine = createShadowBeam(x0, y0, x1, y1, nameShadow);
    shadowLine.hide();

    layer.add(line, shadowLine);

    updateBeam(line, shadowLine);
    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";

    return line;
}

function createBeam2() {
    const konvaElement = lastNodeClick;
    const [x0, y0] = getElementPos(konvaElement);

    const idByDate = Date.now();

    const group = new Konva.Group({name: "beam2", id: idByDate});
    const line = new Konva.Line({
        name: "subelementBeamLine",
        x: x0,
        y: y0,
        points: [0, 0, 3*blockSnapSize, 0],
        strokeWidth: 5,
        stroke: "black",
        id: idByDate + 1
    });

    const circle = new Konva.Circle({
        name: "subelementBeamCirculo",
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
    node.setKonvaBeam(group)

    joinNodes(nodeParent, node)


    panel.style.visibility = "hidden";
    delPanel.style.visibility = "hidden";

}