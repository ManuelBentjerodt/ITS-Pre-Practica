// const imageInput = document.querySelector("#imageInput");
// const imagePreview = document.querySelector("#imagePreview");
// const clearImage = document.querySelector("#clearImage");


const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            imagePreview.src = this.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);

        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
        const href = window.location.href;
        console.log(csrfToken)

        const formData = new FormData();
        formData.append("image", file);
        formData.append("csrfmiddlewaretoken", csrfToken);

        fetch(`${href}`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error))

    }

});










// imageInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if (file) {
//         const reader = new FileReader()
    
//         reader.onload =  () => {
//             imagePreview.src = this.result;
//             imagePreview.style.display = "block";
//         }
        
//     //     const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
//     //     const href = window.location.href;
        
//     //     const data = new FormData();
//     //     data.append("image", file);

//         // fetch(`${href}`, {
//         //     method: "PATCH",
//         //     headers: {
//         //         "Content-Type": "Multipart/form-data",
//         //         "X-CSRFToken": csfrToken,
//         //     },
//         //     body: data
//         // })
//         // .then((response) => response)
//         // .catch((error) => console.log(error))
//     }
// }.bind(imageInput));

// clearImage.addEventListener("click", function () {
//     imagePreview.src = "";
//     imagePreview.style.display = "none";
//     imageInput.value = "";
// });
