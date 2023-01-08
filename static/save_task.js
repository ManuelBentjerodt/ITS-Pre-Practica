const button = document.querySelector("#saveButton")
button.addEventListener("click", saveTask);

function saveTask(e) {
    const taskId = this.dataset.taskId;
    console.log(this)
    const dclJSON = dcl.generateCopy();
    const sizeFactor = document.querySelector("#dim").value;
    const difficulty = document.querySelector("#difficultyValue").innerText;
    const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    const view = button.className.includes("createTask") ? "create_task" : "edit_task"
    ;
    const data = JSON.stringify({
        "difficulty": difficulty,
        "sizeFactor": sizeFactor,
        "dclJSON": dclJSON,
        "csrfmiddlewaretoken": csfrToken,
    })


    fetch(`http://127.0.0.1:8000/${view}/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csfrToken,
        },
        body: data

    }).then((response) => {
        console.log("response", response.json());
    });



}   