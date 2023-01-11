const button = document.querySelector("#saveButton")
button.addEventListener("click", saveTask);

function saveTask(e) {
    const taskId = this.dataset.taskid;
    const dclJSON = dcl.generateCopy();
    const sizeFactor = document.querySelector("#dim").value;
    const difficulty = document.querySelector("#difficultyValue").innerText;
    const statement = document.querySelector("#statement").value;
    const image = document.querySelector("#imageInput");

    console.log(image)
    console.log(image.files)

    const file = image.files[0];
    const formFile = new FormData();
    formFile.append("image", file);

    console.log(image)
    console.log(file)
    console.log(formFile)


    const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    const href = window.location.href;

    const data = JSON.stringify({
        "difficulty": difficulty,
        "sizeFactor": sizeFactor,
        "statement": statement,
        "dclJSON": dclJSON,
        "image": formFile,
    })

    fetch(`${href}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csfrToken,
        },
        body: data
    })
    .then((response) => response.json())
    // .then((data) => window.location.href = data.redirect)

        

}   