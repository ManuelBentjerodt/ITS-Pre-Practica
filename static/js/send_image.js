const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const clearImage = document.getElementById("clearImage");

if (imagePreview.dataset.image == "None") {
    imagePreview.style.display = "none"

} else {
    imagePreview.style.display = "block";
    imagePreview.src = imagePreview.dataset.image;

}


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

clearImage.addEventListener("click", function() {
    imagePreview.style.display = "none";
    imageInput.value = "";

    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    const href = window.location.href;

    fetch(`${href}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            csrfmiddlewaretoken: csrfToken,
            image: imageInput.value
        })
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error))

});