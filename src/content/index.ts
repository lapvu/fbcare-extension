window.addEventListener("load", function () {
    const hideBar = document.getElementsByClassName("_2evq _4bl7")[0] as HTMLAnchorElement;
    hideBar.style.display = "none";
    setTimeout(() => {
        const payIconHide = document.getElementsByClassName("_3w8o")[0] as HTMLAnchorElement;
        payIconHide.style.display = "none";
        const msgBoxNode = document.getElementsByClassName("clearfix _1ej0 _2mpc")[0] as HTMLAnchorElement;
        const config = { attributes: true, childList: true, subtree: true };
        const callback = function (mutationsList: any, observer: any) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const msgs = document.getElementsByClassName("direction_ltr");
                    [...msgs].forEach((e: Element, i: number) => {
                        if (e.textContent?.match(/(09|01[2|6|8|9])+([0-9]{8})\b/g) && e.getAttribute("data-content") !== "isPhone") {
                            e.setAttribute("data-content", "isPhone")
                            e.setAttribute("style", "background-color: red;");
                        }
                    });
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(msgBoxNode, config);
    }, 2500);
})