
document.querySelector("#saveButton").addEventListener("click", saveTask);

function saveTask(e) {
   
    const taskId = this.dataset.taskid;
    const dclJSON = dcl.generateCopy();
    const sizeFactor = document.querySelector("#dim").value;
    const difficulty = document.querySelector("#difficultyValue").innerText;
    const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    console.log("taskId", taskId);
    console.log("difficulty", difficulty);
    console.log("sizeFactor", sizeFactor);
    console.log("dclJSON", dclJSON);

    

    fetch(`http://localhost:8000/edit_task/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csfrToken,
        },
        body: JSON.stringify({
            "difficulty": difficulty,
            "sizeFactor": sizeFactor,
            "dclJSON": dclJSON,
            "csrfmiddlewaretoken": csfrToken,
        }),
        
    
        
    }).then((response) => {
        console.log("response", response.json());
    });



}   