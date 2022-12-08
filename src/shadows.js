function createShadowApoyoDeslizante(x0, y0){
    const group = new Konva.Group({draggable: true, name: "shadow-apoyo-deslizante"});
    const triangle = new Konva.RegularPolygon({
        name: "subElemento ApoyoDeslizante Shadow",
        x: x0,
        y: y0,
        sides: 3,
        radius: 20,
        fill: "#FF7B17",
        stroke: "#CF6412",
        strokeWidth: 4,
        dash: [10, 4]
    });

    const base = new Konva.Line({
        name: "subElemento ApoyoDeslizante Shadow",
        x: x0,
        y: y0+20,
        points: [-20, 0, 20, 0],
        strokeWidth: 4,
        stroke: "#CF6412",
        dash: [10, 4]
    });

    group.add(triangle, base);
    return group;
}

function createShadowApoyoNoDeslizante(x0, y0){
    const group = new Konva.Group({draggable: true, name: "shadow-apoyo-no-deslizante"});
    const triangle = new Konva.RegularPolygon({
        name: "subElemento ApoyoNoDeslizante Shadow",
        x: x0,
        y: y0,
        sides: 3,
        radius: 20,
        fill: "#FF7B17",
        stroke: "#CF6412",
        strokeWidth: 4,
        dash: [10, 4]
    });

    group.add(triangle);
    return group;
}


function createShadowEmpotrado(x0, y0){
    const group = new Konva.Group({draggable: true, name: "shadow-empotrado"});
    const base = new Konva.Line({
        name: "subElemento Empotrado Shadow",
        x: x0,
        y: y0,
        points: [0, 0, 52, 0],
        fill: "#FF7B17",
        stroke: "#CF6412",
        strokeWidth: 4,
        dash: [10, 4]
    });

    const l1 = new Konva.Line({name: "subElemento Empotrado Empotrado", x: x0, y: y0, points: [0, 12.5, 12.5, 0], strokeWidth: 4, fill: "#FF7B17", stroke: "#CF6412", strokeWidth: 4, dash: [10, 4]});
    const l2 = new Konva.Line({name: "subElemento Empotrado Empotrado", x: x0+12.5, y: y0, points: [0, 12.5, 12.5, 0], strokeWidth: 4, fill: "#FF7B17", stroke: "#CF6412", strokeWidth: 4, dash: [10, 4]});
    const l3 = new Konva.Line({name: "subElemento Empotrado Empotrado", x: x0+25, y: y0, points: [0, 12.5, 12.5, 0], strokeWidth: 4, fill: "#FF7B17", stroke: "#CF6412", strokeWidth: 4, dash: [10, 4]});
    const l4 = new Konva.Line({name: "subElemento Empotrado Empotrado", x: x0+37.5, y: y0, points: [0, 12.5, 12.5, 0], strokeWidth: 4, fill: "#FF7B17", stroke: "#CF6412", strokeWidth: 4, dash: [10, 4]});

    group.add(base, l1, l2, l3, l4);
    return group;
}


function createShadowRotula(x0, y0){
    const group = new Konva.Group({draggable: true, name: "rotula"});
    const circle = new Konva.Circle({
        x: x0,
        y: y0,
        radius: 16,
        fill: "#FF7B17",
        stroke: "#CF6412",
        strokeWidth: 4,
        dash: [10, 4],
        name: "subElemento Rotula"
    });

    group.add(circle);
    return group;
}


function createShadowBiela(x0, y0){
    const group = new Konva.Group({draggable: true, name: "biela"});
    const large = 40;
    const line = new Konva.Line({
        name: "subElemento Biela",
        x: x0,
        y: y0,
        points: [0, 0, large, 0],
        strokeWidth: 5,
        stroke: "#CF6412"
    });
    const circle1 = new Konva.Circle({
        name: "subElemento Biela",
        x: x0,
        y: y0,
        radius: 7,
        fill: "#FF7B17",
        stroke: "#CF6412",
        strokeWidth: 4,
    });
    const circle2 = circle1.clone({
        // name: "cricle2",
        x: x0+large,
        y: y0
    });

    group.add(line, circle1, circle2);
    return group
}
