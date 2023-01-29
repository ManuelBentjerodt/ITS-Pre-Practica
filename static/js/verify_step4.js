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
 

    

}   