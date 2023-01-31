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
        console.log("dataaa: ",data["data"]["fxCorrect"]);
        if (data["data"]["fxCorrect"] ) 
            document.getElementById("fxCorrectness").innerText= "Correcto";
        else document.getElementById("fxCorrectness").innerText= "Incorrecto";
        if (data["data"]["fyCorrect"] ) 
        document.getElementById("fyCorrectness").innerText= "Correcto";
        else document.getElementById("fyCorrectness").innerText= "Incorrecto";
        if (data["data"]["mCorrect"] ) 
        document.getElementById("mCorrectness").innerText= "Correcto";
        else document.getElementById("mCorrectness").innerText= "Incorrecto";

    })    
    

}   