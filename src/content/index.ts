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

document.head.insertAdjacentHTML("beforeend", `<style>
.my-fbcare-tooltip{
    position: absolute;
    top: -80%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #9b59b6;
    color: #fff;
    padding: 2px;
    border-radius: 2px;
    width: 115%;
    cursor: pointer;
    box-shadow: 1px 1px 4px #000;
}
.my-fbcare-tooltip::after{
    content: '';
    border: 10px solid transparent;
    border-top-color: #9b59b6;
    position: absolute;
    bottom: -125%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>`)

setInterval(function () {
    document.querySelectorAll("[data-tooltip-position='left'] div span").forEach(function (e: any, index: number) {
        const regex = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        const text = e.innerText.trim();
        if (regex.test(text) && !e.classList.contains("is-phone")) {
            e.classList.add("is-phone");
            let phone = "";
            let html = text.replace(regex, function (match: string) {
                phone = match.trim();
                return `<div style="position:relative;display: inline-flex;">
                    <strong>${match.trim()}</strong>
                    <div class="my-fbcare-tooltip" name="my-tooltip-${index}">Tạo đơn hàng</div>
                </div>`
            });
            e.innerHTML = html;
            document.querySelector(`[name="my-tooltip-${index}"]`)?.addEventListener("click", function () {
                chrome.runtime.sendMessage({ type: "CREATE_ORDER_PHONE", phone })
            });
        }
    })
}, 900)
