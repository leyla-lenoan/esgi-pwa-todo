let timeStart = null;
let timeEnd = null;
let image = new Image();
let counter = 0;
let arrayTimes = [];
let abortFallback = false;

export default function checkConnectivity(timeToCount = 3, threshold = 3000, offlineTimeout = 3000) {
    if(navigator.onLine) {
        changeConnectivity(true);
    } else {
        setTimeout(() => {
            changeConnectivity(false);
        }, offlineTimeout);
    }

    window.addEventListener('online', e => {
        changeConnectivity(true);
    });

    window.addEventListener('offline', e => {
        setTimeout(() => {
            changeConnectivity(false);
        }, offlineTimeout);
    });

    timeoutFallback(threshold);
    checkLatency(timeToCount, offlineTimeout, avg => handleLatency(avg, threshold));
    setInterval(() => {
        reset();
        timeoutFallback(threshold);
        checkLatency(timeToCount, offlineTimeout, avg => handleLatency(avg, threshold));
    }, 6000);
}

function checkLatency(timeToCount, offlineTimeout, callback) {
    timeStart = new Date().getTime();
    if(counter < timeToCount) {
        image.src = "https://www.google.com/images/phd/px.gif?t=" + timeStart;
        image.onload = function(e) {
            abortFallback = true;
            timeEnd = new Date().getTime();
            arrayTimes.push(timeEnd - timeStart);
            checkLatency(timeToCount, offlineTimeout, callback);
            counter++;
        };
        image.offline = function() {
            setTimeout(() => {
                changeConnectivity(false);
            }, offlineTimeout);
        };
    } else {
        const sum = arrayTimes.reduce((a, b) => a + b);
        const avg = sum / arrayTimes.length;
        callback(avg);
    }
}

function handleLatency(avg, threshold) {
    const isConnectedFast = avg <= threshold;
    if(!isConnectedFast) return changeConnectivity(false);
    changeConnectivity(true);
}

function reset() {
    arrayTimes = [];
    counter = 0;
}

function changeConnectivity(state) {
    const event = new CustomEvent('connection-changed', {
        detail: state
    });
    document.dispatchEvent(event);
}

function timeoutFallback(threshold) {
    setTimeout(() => {
        if(!abortFallback) {
            console.log("Connectivity is too slow, falling back offline experience !");
            changeConnectivity(false);
        }
    }, threshold + 1);
}