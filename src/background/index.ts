function enableIframeAccess() {
    chrome.webRequest.onHeadersReceived.addListener(
        function (response) {
            const res = response.responseHeaders?.filter(
                (response) =>
                    ![
                        "x-frame-options",
                        "content-security-policy",
                        "x-content-security-policy",
                        "strict-transport-security",
                    ].includes(response.name.toLowerCase())
            );
            return {
                responseHeaders: res,
            };
        },
        {
            urls: ["<all_urls>"],
        },
        ["blocking", "responseHeaders"]
    );
}

function enableFbRequestAccess() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        (req) => {
            const headers = req.requestHeaders as any;
            const originIndex = headers.findIndex((e: any) => e.name);
            const referIndex = headers.findIndex((e: any) => e.name);
            if (originIndex) {
                headers[originIndex].value = "https://www.facebook.com";
            } else {
                headers.push({ name: "Origin", value: "https://www.facebook.com" });
            }
            if (referIndex) {
                headers[referIndex].value = "https://www.facebook.com";
            } else {
                headers.push({
                    name: "Referer",
                    value: "https://www.facebook.com",
                });
            }
            return {
                requestHeaders: headers,
            };
        },
        { urls: ["https://*.facebook.com/*"] },
        ["requestHeaders"]
    );
}

async function getFbAccessToken(): Promise<string> {
    const res = await fetch(
        "https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed"
    ).then((e) => e.text());
    const match = res.match(/accessToken\\":\\"(.*?)\\"/) as any;
    return match[1] as string;
}

function getFbUserId(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.cookies.get({ url: "https://facebook.com", name: "c_user" }, (e: any) => {
            if (e) {
                resolve(e.value as string);
            } else {
                reject();
            }
        });
    });
}

async function getFbUserInfo(token: string, userId: string) {
    const res = await fetch(`https://graph.facebook.com/v9.0/${userId}?fields=id,name,birthday,email,hometown,gender&access_token=${token}`);
    const data = await res.json();
    return data;
}

async function getFbUserAvatar(token: string, userid: string): Promise<string> {
    const res = await fetch(`https://graph.facebook.com/v9.0/${userid}/picture?access_token=${token}`);
    return res.url;
}

async function getFbPagesInfo(token: string, userId: string) {
    const res = await fetch(`https://graph.facebook.com/${userId}/accounts?fields=name,cover_photo,picture&access_token=${token}`);
    const data = await res.json();
    return data;
}

function main(cb: any) {
    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.create({
            url: `chrome-extension://${chrome.runtime.id}/index.html`
        }, async (tab) => {
            cb(tab);
        })
    });
}

async function getCQuickToken(pageinfo: any): Promise<any> {
    const res = await fetch(`https://www.facebook.com/${pageinfo.id}/inbox`);
    const data = await res.text();
    const match = data.match(/compat_iframe_token":"(.*?)"/) as any;
    return {
        ...pageinfo,
        url: `https://www.facebook.com/${pageinfo.id}/inbox?cquick=jsc_c_p&cquick_token=${match[1]}&ctarget=https://www.facebook.com`
    };
}

function getStorage(key: string): Promise<any> {
    return new Promise((resolve, _) => {
        chrome.storage.sync.get([key], function (result) {
            if (result) {
                resolve(result);
            } else {
                resolve(null);
            }
        });
    })
}

function setStorage(data: any) {
    chrome.storage.sync.set(data);
}

main(async function (tab: any) {
    enableIframeAccess();
    enableFbRequestAccess();
    try {
        const userId = await getFbUserId();
        const token = await getFbAccessToken();
        var [userInfo, avatar, pagesInfo] = await Promise.all([
            getFbUserInfo(token, userId),
            getFbUserAvatar(token, userId),
            getFbPagesInfo(token, userId)
        ]);
        pagesInfo = await Promise.all(pagesInfo.data.map((e: any) => getCQuickToken(e)))
        setStorage({ fbInfo: [{ avatar, ...userInfo, url: "https://www.messenger.com/" }, ...pagesInfo] })
    } catch (error) {
        chrome.storage.sync.remove("fbInfo");
        console.log(error)
    }
});


let old_id = "";
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.type === "CUSTOMER_CHANGE_CONTENT") {
        if (sender.origin === "https://www.facebook.com") {
            const match = message.url.match(/&selected_item_id=(.*?)/);
            if (match) {
                const customer_id = message.url.split("&selected_item_id=")[1];
                if (old_id !== customer_id) {
                    old_id = customer_id;
                    let real_id = await getRealCustomerId(customer_id);
                    if (real_id) {
                        chrome.runtime.sendMessage({ type: "CUSTOMER_CHANGE_BG", customer_id: real_id });
                    } else {
                        chrome.runtime.sendMessage({ type: "NO_CUSTOMER_ID" });
                    }
                }
            }
        } else if (sender.origin === "https://www.messenger.com") {
            const match = message.url.match(/https:\/\/www.messenger.com\/t\/(.*?)/);
            if (match) {
                let customer_id = message.url.replace("https://www.messenger.com/t/", "");
                if (old_id !== customer_id) {
                    old_id = customer_id;
                    let real_id = await getRealCustomerId(customer_id);
                    if (real_id) {
                        chrome.runtime.sendMessage({ type: "CUSTOMER_CHANGE_BG", customer_id: real_id });
                    } else {
                        chrome.runtime.sendMessage({ type: "NO_CUSTOMER_ID" });
                    }
                }
            }
        }
    }
    if (message.type === "CONVERSATION_INIT") {
        old_id = "";
    }
});

function getRealCustomerId(id: string) {
    return new Promise((resolve, reject) => {
        return fetch(`https://facebook.com/${id}`)
            .then((res) => res.text())
            .then(html => {
                const match = html.match(/"userID":"(.*?)"/);
                if (match) {
                    resolve(match[1]);
                } else {
                    resolve("")
                }
            }).catch(err => resolve(""));
    })
}