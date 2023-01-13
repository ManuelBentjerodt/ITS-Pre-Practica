const button = document.querySelector("#verifyButton")
button.addEventListener("click", verifyTask);
console.log("OLAAAAAA000");
function verifyTask(e) {
    const taskId = this.dataset.taskid;
    console.log("dlc",dcl);
    let dclJSON = dcl.generateCopy();
    console.log(JSON.stringify(dclJSON));
    console.log("dlc",dcl);

    newDCL = recreateDcl(JSON.stringify(dclJSON));

    const standarizedDCL = standarizeDCL(newDCL);
    console.log("standarizedDCL:",standarizedDCL);
    console.log("correct dcl:",correctDcl);
    const standarizedCorrectDCL = standarizeDCL(correctDcl);

    const areEqual = areDclEqual(standarizedDCL, standarizedCorrectDCL);
    console.log("areEqual:",areEqual);

    console.log("dlc",dcl);
    
    getBackDcl = recreateDcl(JSON.stringify(dclJSON));
    console.log("getBackDcl",getBackDcl);
    drawDCL(getBackDcl);
   
}   