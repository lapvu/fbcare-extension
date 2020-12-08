window.addEventListener("load", function () {
    const hideBar = document.getElementsByClassName("_2evq _4bl7")[0] as HTMLAnchorElement;
    hideBar.style.display = "none";
    setTimeout(() => {
        const payIconHide = document.getElementsByClassName("_3w8o")[0] as HTMLAnchorElement;
        payIconHide.style.display = "none";
    }, 2500);
});

setInterval(function () {
    chrome.runtime.sendMessage({ type: "CUSTOMER_CHANGE_CONTENT", url: window.location.href })
}, 700)

setInterval(function () {
    document.querySelectorAll("[data-tooltip-position='left']").forEach(function (e: any) {
        if (/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(e.innerText.trim())) {
            e.style.color = "red";
        }
    })
}, 900)

