'use strict';
import { trackItem } from './track_order.js';


$("#track").keypress(function (e) {
  if (e.which == 13) {
    barcodeSubmitListener(e);
    return false;    //<---- Add this line
  }
});

$("#trackButton").click(barcodeSubmitListener);

function barcodeSubmitListener(event) {
  const text = $("#track").val();
  trackItem(text, (response) => {
    const jdata = JSON.parse(response);
    if (jdata.ReturnCode == 0) {
      createResponseTable(jdata);
    } else {
      handleErrorResponse(jdata);
    }
  });
  // {"ReturnCode":0,"ErrorMessage":"","Result":{"Barcode":"LB016980447SG","Lang":"he","data_number":3,"data_type":"RASHUM","typeName":"אקספרס מחו\"ל","hasImage":0,"hasSignImage":0,"hazmana":0,"sHeader1":"","sHeader2":"","itemcodeinfo":{"RowCount":6,"ColCount":4,"ColumnHeaders":["תאריך פעולה","תיאור פעולה","יחידת דואר","ישוב"],"InfoLines":[["15/07/2018","נמסר ליעדו","מרכז מסירה מכולת האח הגדול (בית עסק)","חיפה"],["14/07/2018","הגיע ליחידה לשם מסירתו לנמען (מספר מדף ג-1097)","מרכז מסירה מכולת האח הגדול (בית עסק)","חיפה"],["10/07/2018","מועבר להמשך מיון","מרכז סחר מקוון","מודיעין"]]},"ReturnCode":0,"ErrorDescription":null}}
}

function handleErrorResponse(jdata) {
  if (jdata.ErrorMessage) {
    $("#result").text(jdata.ErrorMessage);
  } else if (jdata.ErrorDescription) {
    $("#result").text(jdata.ErrorDescription);
  } else {
    $("#result").text("unknow error");
  }
}

function createResponseTable(jdata) {
  if (jdata.Result.itemcodeinfo.ColumnHeaders.length == 0 && 
    jdata.Result.itemcodeinfo.InfoLines.length == 1)  {
    $("#result").text(jdata.Result.itemcodeinfo.InfoLines[0]);
    $("#result").width(400).css("direction", "rtl");
  } else {
    const headers = jdata.Result.itemcodeinfo.ColumnHeaders.map((val, index, arr) => {
      return {
        title: val,
        field: val,
        headerSort: false,
        align: "right"
      };
    });
  
    const lineData = jdata.Result.itemcodeinfo.InfoLines.map((line, lineIndex, arr) => {
      let lineObj = {}
      line.forEach((field, index, arr) => {
        lineObj[jdata.Result.itemcodeinfo.ColumnHeaders[index]] = field;
      });
      return lineObj;
  
    })
  
    $("#result").tabulator({
      columns: headers
    });
    $("#result").tabulator("setData", lineData);
  }
  
}