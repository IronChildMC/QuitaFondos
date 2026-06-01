const API_KEY = "4ySermGsysYPcxx2pcRQ48aJ";

const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");
const progress = document.getElementById("progress");
const bar = document.getElementById("bar");
const estado = document.getElementById("estado");

const soundUpload = document.getElementById("soundUpload");
const soundDone = document.getElementById("soundDone");

let resultURL = null;
let file = null;

input.addEventListener("change", () => {
    file = input.files[0];
    soundUpload.play();
    estado.textContent = "Imagen cargada ✔️";
});

async function removeBackground(){

    if(!file){
        alert("Selecciona una imagen primero");
        return;
    }

    progress.style.display = "block";
    bar.style.width = "10%";
    estado.textContent = "Procesando...";

    let fake = 10;
    const anim = setInterval(() => {
        if(fake < 85){
            fake += Math.random()*10;
            bar.style.width = fake + "%";
        }
    },200);

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try{
        const res = await fetch("https://api.remove.bg/v1.0/removebg", {
            method:"POST",
            headers:{
                "X-Api-Key": API_KEY
            },
            body: formData
        });

        if(!res.ok){
            throw new Error(await res.text());
        }

        const blob = await res.blob();
        resultURL = URL.createObjectURL(blob);

        clearInterval(anim);
        bar.style.width = "100%";

        preview.src = resultURL;
        preview.style.display = "block";

        downloadBtn.style.display = "block";

        estado.textContent = "¡Listo! 🎉";
        soundDone.play();

        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = resultURL;
            a.download = "sin_fondo.png";
            a.click();
        };

        setTimeout(() => {
            progress.style.display = "none";
            bar.style.width = "0%";
        },1500);

    } catch(err){
        clearInterval(anim);
        estado.textContent = "Error ❌";
        alert(err.message);
    }
}
