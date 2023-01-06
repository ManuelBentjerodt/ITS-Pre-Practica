function saveTask() {
    const dclForm = document.querySelector("#id_dcl");
    const dateForm = document.querySelector("#id_date");
    const difficultyForm = document.querySelector("#id_difficulty");
    const dimensionForm = document.querySelector("#id_dimension");


    dclForm.value = dcl.generateJSON()
    dateForm.value = getDate()

    //dimensionForm.value = document.querySelector("#dim").value;
    // console.log("dimensionForm.value",dimensionForm.value);

    let temp = document.querySelector("#difficultyValue").innerText;
    console.log("temp",temp);
    temp  = temp.split(": ");
    temp = temp[1];

    console.log("temp",temp);

    difficultyForm.value = JSON.stringify({difficulty: temp })
    dimensionForm.value= `{dimension: ${document.querySelector("#dim").value}}`;
    console.log("difficultyForm.value",difficultyForm);
    console.log("datedimension",dimensionForm);
    
}   