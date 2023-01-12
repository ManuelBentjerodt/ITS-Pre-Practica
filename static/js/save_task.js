const button = document.querySelector("#saveButton")
button.addEventListener("click", saveTask);

function saveTask(e) {
    const taskId = this.dataset.taskid;
    const dclJSON = dcl.generateCopy();
    const sizeFactor = document.querySelector("#dim").value;
    const difficulty = document.querySelector("#difficultyValue").innerText;
    const statement = document.querySelector("#statement").value;

    const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    const href = window.location.href;

    const data = JSON.stringify({
        "difficulty": difficulty,
        "sizeFactor": sizeFactor,
        "statement": statement,
        "dclJSON": dclJSON,
    })
    
    fetch(`${href}`, {
        method: "PATCH",
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

// const imageInput = document.querySelector("#imageInput");


// function saveTask(e) {
//     const taskId = this.dataset.taskid;
//     const image = imageInput.files[0];

//     const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
//     const href = window.location.href;

    
    
//     fetch(`${href}`, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": csfrToken,
//         },
//         body: data
//     })
//     .then((response) => {
//         response.json()
//         console.log(response.json())
//     })
//     .then((data) => {
//         window.location.href = data.redirect
//     })
// }  