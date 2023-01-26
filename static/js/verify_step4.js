const button = document.querySelector("#verifyButton")
button.addEventListener("click", verifyTask);
function verifyTask() {
    const href = window.location.href;
    const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    const fxAnswer = document.querySelector("#inputEquationX").value;
    const fyAnswer = document.querySelector("#inputEquationY").value;
    const mAnswer = document.querySelector("#inputEquationM").value;



    const data = JSON.stringify({
        "fxEquation": fxAnswer,
        "fyEquation": fyAnswer,
        "mEquation": mAnswer,
    })
   
    
    fetch(`${href}`, {
        method: "POST",
        headers: {
            "Content-Type": "verify4/json",
            "X-CSRFToken": csfrToken
        },
        body: data
    })


    .then((response) => {
        return response.json()
        
    })
    .then((data) => {
        //window.location.href = data.redirect
    })    
    // let answerFx = document.querySelector("#inputEquationX").value;
    // let answerFy = document.querySelector("#inputEquationY").value;
    // let answerM = document.querySelector("#inputEquationM").value;


    // answerFx =  deleteEmpty(replaceAll(listTo2(answerFx)));
    // answerFy = deleteEmpty(replaceAll(listTo2(answerFy)));
    // answerM = deleteEmpty(replaceAll(listTo2(answerM)));

    // answerFx = deletePlus(answerFx);
    // answerFy = deletePlus(answerFy);
    // answerM = deletePlus(answerM);


    // console.log("answerFx: in list: ", answerFx);
    // console.log("answerFy: in list: ", answerFy);
    // console.log("answerM: in list: ", answerM);

    // console.log("correcto: ", newFx); 
    // console.log("correcto: ", newFy);
    // console.log("correcto: ", newM);

    

}   