let video = document.querySelector("video");
let recdordBtnCont = document.querySelector(".record-btn-cont");
let recdordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let recorder;
let recordFlag = false;
let chunks = []; // store recorded data 

let transparentColor = "transparent";

let constraints = {
    video: true,
    audio: true
}

// navigator -> global browser info,
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream);
        recorder.addEventListener("start", (e) => {  // remove the previous data befor recording
            chunks = [];
        });
        recorder.addEventListener("dataavailable", (e) => {  // when the data is available push it to array
            chunks.push(e.data);
        });

        recorder.addEventListener("stop", (e) => { // download when stop
            // conversion of media chunks data to video
            let blob = new Blob(chunks, { type: "video/mp4" });
            let videoURL = URL.createObjectURL(blob);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        });

    }).catch((err) => {
        console.log(err);
    });


captureBtnCont.addEventListener("click", (e) => {

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    //Filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();  // create URL for download

    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "image.jpg";
    a.click();

});

recdordBtnCont.addEventListener("click", (e) => {
    if (!recorder) {
        return;
    }
    recordFlag = !recordFlag;  // if record flag is true start recording else stop (os is based on button clicks);
    if (recordFlag) { //start
        recorder.start();
        recdordBtn.classList.add("scale-record");
        startTimer();
    }
    else { // stop
        recorder.stop();
        recdordBtn.classList.remove("scale-record");
        stopTimer();
    }
});

let timerID;
let timer = document.querySelector(".timer");
let counter = 0; // it represents every second
function startTimer() {
    timer.style.display = "block";
    function displayTimer() {
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;  //remaining value

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00.00.00";
    timer.style.display = "none";
}

//filtering logic
let allFilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");

allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        //Get
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        // Set
        filterLayer.style.backgroundColor = transparentColor;
    })
});