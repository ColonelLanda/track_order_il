
function handleClick(info,tab) {
    console.log(`event ${info} has occured - clicked`);
    var newURL = `https://mypost.israelpost.co.il/%D7%9E%D7%A2%D7%A7%D7%91-%D7%9E%D7%A9%D7%9C%D7%95%D7%97%D7%99%D7%9D?itemcode=${info.selectionText}`;
    chrome.tabs.create({ url: newURL });
    
}

chrome.contextMenus.create({
    "title" : "track",
    "contexts" : ["selection"],
    "onclick": handleClick
 });
