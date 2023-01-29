const button = document.querySelector("#saveButton")
button.addEventListener("click", saveTask);

function saveTask(e) {
    const taskId = this.dataset.taskid;
    const dclJSON = dcl.generateCopy();
    const sizeFactor = document.querySelector("#dim").value;
    const difficulty = document.querySelector("#difficultyValue").innerText;
    const statement = document.querySelector("#statement").value;

    const [Fx, Fy, M] = calculateEquations(distanceMultiplier, dimensionValue,true);


    
    const tags = document.querySelectorAll(".tag");

    const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    const href = window.location.href;

    const data = JSON.stringify({
        "difficulty": difficulty,
        "sizeFactor": sizeFactor,
        "statement": statement,
        "dclJSON": dclJSON,
        "fxEquation": Fx,
        "fyEquation": Fy,
        "mEquation": M,
    })
   
    fetch(`${href}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csfrToken,
        },
        body: data
    })
    .then((response) => {
        return response.json()
        
    })
    .then((data) => {
        window.location.href = data.redirect
    })
}   

