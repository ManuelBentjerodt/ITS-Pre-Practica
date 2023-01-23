
const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;

const stage = createStage("containerKonva");

const layer = new Konva.Layer({name: "layer"});
stage.add(layer);

//------------------------------------------------------Creacion grilla-----------------------------------------------//
generateGrid(layer);

const divKonvaContainer = document.querySelector("#containerKonva");

const modalForce = createModalForce(listenUpdate=false);
const modalMoment = createModalMoment(listenUpdate=false); 
const modalFixedSupport = createModalFixedSupport(listenUpdate=false);
const modalRollerSupport = createModalRollerSupport(listenUpdate=false); 
const modalPinnedSupport = createModalPinnedSupport(listenUpdate=false);
const delPanel = createDelPanel(listenUpdate=false);
const anglePanel = createAngleReferencePanel(listenUpdate=false); //new
const panel = createPanel(listenUpdate=false);


divKonvaContainer.appendChild(modalForce);
divKonvaContainer.appendChild(modalMoment);
divKonvaContainer.appendChild(modalFixedSupport);
divKonvaContainer.appendChild(modalRollerSupport);
divKonvaContainer.appendChild(modalPinnedSupport);
divKonvaContainer.appendChild(panel);
divKonvaContainer.appendChild(delPanel);
divKonvaContainer.appendChild(anglePanel); //new

// listenPanelMovement(panel);
listenPanelMovement(anglePanel); //new
listenPanelMovement(delPanel);
listenPanelMovement(modalMoment); 
listenPanelMovement(modalForce); 
listenPanelMovement(modalFixedSupport);
listenPanelMovement(modalRollerSupport); 
listenPanelMovement(modalPinnedSupport);

x_reference = new xReference([0,heightStage-5*blockSnapSize]);
y_reference = new yReference([widthStage-5*blockSnapSize,0]);

x_reference.createKonvaLine();
y_reference.createKonvaLine();

x_reference.buildLine();
y_reference.buildLine();


x_reference.updateSegmentedLines();
y_reference.updateSegmentedLines();


layer.add(x_reference.getKonvaLine());
layer.add(y_reference.getKonvaLine());


const dclJSON = document.querySelector("#dclJSON").textContent;

let dcl;
let initialBeam;

const DCL = {}


if (dclJSON == "null") {
    [dcl, initialBeam] = createBeam(nameBeam="initialBeam");
    dcl.setIsOrigin(true);
    const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
    shadowLine.hide();
    listenNodeMovement(initialBeam, shadowLine, "initialBeam");
    console.log("primera vez editando");
    
} else {
    dcl = recreateDcl(dclJSON);

    
    drawDCL(dcl);
    initialBeam = dcl.childNodes[0].konvaObjects.beam
    console.log("ya has editado otras veces")
}

//borrar cosas innesesarias///////////////

const pDificulty = document.querySelector("#difficultyValue");
pDificulty.innerText = "";

const eq = document.querySelector("#equations");
const cl = document.querySelector("#classification");
const removed = el => el.parentElement.removeChild(el);
removed(eq);
removed(cl);
/////////////////////////


x_reference.hideAll();
y_reference.hideAll();

const initialBeamSubElements = initialBeam.getChildren();




paintIfMouseOver(initialBeamSubElements[0], nfillc, nstrokec, initialBeamSubElements[0].getAttr("fill"), initialBeamSubElements[0].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[1], nfillc, nstrokec, initialBeamSubElements[1].getAttr("fill"), initialBeamSubElements[1].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[2], nfillc, nstrokec, initialBeamSubElements[2].getAttr("fill"), initialBeamSubElements[2].getAttr("stroke"));

const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
shadowLine.hide();


listenCreateElement();
listenDeleteElement();
listenHiddePanels();

showReferences();
turnToRealDCL(listenUpdate=false);

const taskInfo = document.querySelector("#taskInfo").dataset;
const statement = taskInfo.statement;
console.log("statement",statement);
document.querySelector("#statement").innerHTML = statement;

// const correctJson = document.getElementById('correctDcl').textContent;
// const correctDcl = recreateDcl(correctJson);
// console.log("correct Dcl: ",correctDcl);
const [Fx, Fy, M] = calculateEquations(distanceMultiplier, dimensionValue,true);
console.log("Fx: ",Fx);
console.log("Fy: ",Fy);
console.log("M: ",M);

// console.log("lista Fx: ", Fx.split("+" || "-"));
// console.log("lista Fy: ", Fy.split("+" || "-"));
// console.log("lista M: ", M.split("+" || "-"));

function stringToList(string){
    let list = []; 
    first = true;
    listTemp = "";
    for (let i=0; i<string.length; i++){
        if ((string[i] == "+" || string[i] == "-") && !first ){
            list.push(listTemp);
        }
        else{
            listTemp+=string[i];
        }
        first = false;
    }
    list.push(listTemp);
    return list;
}




function listTo2(string){
    let list = []; 
    first = 0;
    listTemp = "";
    for (let i=0; i<string.length; i++){
        if ((string[i] == "+" || string[i] == "-") && first == 0){
            listTemp+=string[i];
            first = 1;
        }
        else if((string[i] == "+" || string[i] == "-") && first == 1){
            list.push(listTemp);
            listTemp = "";
            listTemp+=string[i];
        }
        else{
            listTemp+=string[i];
        }//
       
    }
    list.push(listTemp);
    return list;
}



function replaceAll(list){
    for (let i=0; i<list.length; i++){
        list[i].replace(" ", "");
    }
    return list;
}



// console.log("new fX: ", listTo2(Fx));
// console.log("new fY: ", listTo2(Fy));
// console.log("new M: ", listTo2(M));

let newFx = listTo2(Fx);
let newFy = listTo2(Fy);
let newM = listTo2(M);

newFx =replaceAll(newFx);
newFy = replaceAll(newFy);
newM = replaceAll(newM);

console.log("new fX: ",newFx);
console.log("new fY: ", newFy);
console.log("new M: ", newM);

for (let i=0; i<newFx.length; i++){
    newFx[i] = newFx[i].replace(" ", "");
}
for (let i=0; i<newFy.length; i++){
    newFy[i] = newFy[i].replace(" ", "");
}
for (let i=0; i<newM.length; i++){
    newM[i] = newM[i].replace(" ", "");
}
console.log(newFx);
console.log(newFy);
console.log(newM);
