const button = document.querySelector("#verifyButton")
button.addEventListener("click", verifyTask);
function verifyTask() {
    // const taskId = this.dataset.taskid;
    console.log("dlc",dcl);

    let clone = Object.assign(Object.create(Object.getPrototypeOf(dcl)), dcl)

    






    let dclJSON = clone.generateCopy();

    let newDCL = recreateDcl(JSON.stringify(dclJSON));
    
    const standarizedDCL = standarizeDCL(newDCL);
    console.log("standarizedDCL:",standarizedDCL);
    console.log("correct dcl:",correctDcl);
    const standarizedCorrectDCL = standarizeDCL(correctDcl);
    
    const areEqual = areDclEqual(standarizedDCL, standarizedCorrectDCL);
    console.log("areEqual:",areEqual);
    
    console.log("dcl",dcl);
    
    //drawDCL(newDCL);
   
}   