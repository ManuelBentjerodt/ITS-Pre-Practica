const statementLabel = document.querySelector('[for=id_statement]');
const statementInput = document.querySelector('#id_statement');

statementLabel.innerText = 'Escriba su enunciado para la tarea:';

statementInput.style.width = '1440px';
statementInput.style.backgroundColor = 'rgb(0, 83, 56)';
statementInput.style.border = '10px outset rgba(128, 70, 16, 0.719)';
statementInput.style.color = 'rgb(255, 255, 255)';
statementInput.style.fontSize = '20px';
statementInput.style.marginTop = '20px';
statementInput.style.paddingLeft = '5px';


const imageInput = document.querySelector('#id_image');
const imageLabel = document.querySelector('[for=id_image]');
imageLabel.innerText = 'Seleccione una imagen para la tarea:';

imageInput.classList.add('form-control');
imageInput.style.width = '1440px';
imageInput.style.marginTop = '20px';

const imageViewer = document.createElement('img');
const imageContainer = document.createElement('div');

imageContainer.id = 'image_container';
imageContainer.style.display = 'flex';
imageContainer.style.justifyContent = 'center';
imageContainer.style.alignItems = 'center';
imageContainer.style.marginTop = '20px';
imageContainer.style.marginBottom = '20px';
imageContainer.style.color = 'rgb(255, 255, 255)';
imageContainer.style.width = '1440px';
imageContainer.style.height = '500px';
imageContainer.style.display = 'none';

imageContainer.appendChild(imageViewer);
imageInput.parentNode.appendChild(imageContainer);

imageViewer.id = 'image_viewer';
imageViewer.style.maxHeight = '500px';


imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        imageContainer.style.display = 'flex';
        imageViewer.src = reader.result;
    };
});

// const button = document.querySelector('#buttonSave');
// button.style.position = 'fixed';
// button.style.fixed = '0';

const buttonSave = document.querySelector('#buttonSave');
const containerView = document.querySelector('#containerView');
const button = document.createElement('button');
button.innerText = 'Guardar';
button.classList.add('btn');
button.classList.add('btn-primary');
button.style.marginTop = '20px';
button.style.marginBottom = '20px';

containerView.appendChild(button);


button.addEventListener('click', () => {
    buttonSave.click();
});







