setTimeout(() => {
    if (db) {
        // video retieval

        let dbVideoTransaction = db.transaction("video", "readonly");
        let videoStore = dbVideoTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaElem);

                //Listners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListner);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListner);
            });
        }

        // image retiaval

        let dbImageTransaction = db.transaction("image", "readonly");
        let imageStore = dbImageTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = `
                <div class="media">
                    <img src="${url}"></img>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaElem);

                //Listners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListner);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListner);
            });
        }

    }
}, 100);

// UI remove, DB renmove
function deleteListner(e) {
    // DB removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);

    if (type === "vid") {
        let dbVideoTransaction = db.transaction("video", "readwrite");
        let videoStore = dbVideoTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if (type === "img") {
        let dbImageTransaction = db.transaction("image", "readwrite");
        let imageStore = dbImageTransaction.objectStore("image");
        imageStore.delete(id);
    }

    //UI removal
    e.target.parentElement.remove();
}

function downloadListner(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);

    if (type === "vid") {
        let dbVideoTransaction = db.transaction("video", "readwrite");
        let videoStore = dbVideoTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if (type === "img") {
        let dbImageTransaction = db.transaction("image", "readwrite");
        let imageStore = dbImageTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let imageURL = imageResult.url;

            let a = document.createElement("a");
            a.href = imageURL;
            a.download = "image.jpg";
            a.click();
        }
    }
}
