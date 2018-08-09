
const trackUri = "https://mypost.israelpost.co.il/umbraco/Surface/ItemTrace/GetItemTrace"
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
}

let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};
function prepareBody(params) {
    return Object.entries(params).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
}

export function trackItem(itemCode, cb) {
    request({ url: `https://mypost.israelpost.co.il/%D7%9E%D7%A2%D7%A7%D7%91-%D7%9E%D7%A9%D7%9C%D7%95%D7%97%D7%99%D7%9D?itemcode=${itemCode}` })
        .then(data => {
            let reg = /name="__RequestVerificationToken" type="hidden" value="([^"]+)"/;
            const trackVerification = data.match(reg)[1];

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    console.log(xhr.responseText);
                    cb(xhr.responseText);
                }
            }


            xhr.open("POST", trackUri, true);
            for (var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
            xhr.send(prepareBody({
                'itemCode': itemCode,
                'lcid': '1037',
                '__RequestVerificationToken': trackVerification
            }));
        });



}

