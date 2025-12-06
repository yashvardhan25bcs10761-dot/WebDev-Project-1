const minInput = document.getElementById("minInput");
const secInput = document.getElementById("secInput");
const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const alarmSound = document.getElementById("alarmSound");

const ring = document.querySelector(".ring-progress");
const FULL_DASH = 440;

let totalTime = 0;

document.addEventListener("DOMContentLoaded", () => {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
});


startBtn.addEventListener("click", () => {
    let minutes = parseInt(minInput.value) || 0;
    let seconds = parseInt(secInput.value) || 0;

    totalTime = minutes * 60 + seconds;
    let remaining = totalTime;

    if (remaining <= 0) {
        alert("Enter a valid time");
        return;
    }

    startBtn.disabled = true;
    startBtn.textContent = "Running...";

    updateDisplay(remaining);
    animateRing(remaining);

    const timerInterval = setInterval(() => {
        remaining--;
        updateDisplay(remaining);
        animateRing(remaining);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerFinished();
        }
    }, 1000);
});


function updateDisplay(sec) {
    let m = Math.floor(sec / 60);
    let s = sec % 60;

    display.textContent =
        `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}


function animateRing(remaining) {
    let progress = FULL_DASH - (remaining / totalTime) * FULL_DASH;
    ring.style.strokeDashoffset = progress;
}


function timerFinished() {
    display.style.color = "#4ade80";
    startBtn.textContent = "Finished!";

    alarmSound.play();

    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Timer Complete!", {
            body: "Your countdown has finished.",
            icon: "https://cdn-icons-png.flaticon.com/512/992/992700.png"
        });
    }

    setTimeout(() => {
        startBtn.disabled = false;
        startBtn.textContent = "Start Timer";
        display.style.color = "#fff";
        display.textContent = "00:00";
        ring.style.strokeDashoffset = FULL_DASH; 
        minInput.value = "";
        secInput.value = "";
    }, 2500);
}
