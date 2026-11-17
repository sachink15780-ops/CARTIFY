/**
 * CARTIFY Google Sheets receiver.
 * Bind this Apps Script project to your target Google Sheet and deploy as a Web App.
 * Execute as: Me | Who has access: Anyone
 */
function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Orders") || ss.insertSheet("Orders");
    if (data.action === "update") {
      var values = sheet.getDataRange().getValues();
      for (var i = 0; i < values.length; i++) {
        if (String(values[i][0]) === "Order ID" && String(values[i][1]) === String(data.orderId)) {
          for (var j = i; j < Math.min(i + 60, values.length); j++) {
            if (String(values[j][0]) === "Order status") {
              sheet.getRange(j + 1, 2).setValue(data.status || "");
              break;
            }
          }
          return ContentService.createTextOutput(JSON.stringify({ok:true,updated:true})).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ok:false,reason:"Order not found"})).setMimeType(ContentService.MimeType.JSON);
    }
    var customer = data.customer || {}, items = data.items || [];
    var rows = [
      ["Order ID", data.orderId || ""],
      ["Order date", data.createdAt || new Date().toISOString()],
      ["Customer name", customer.name || ""],
      ["Customer email", data.email || ""],
      ["Mobile number", customer.mobile || ""],
      ["Alternate mobile", customer.alternate || ""],
      ["PIN code", customer.pincode || ""],
      ["State", customer.state || ""],
      ["District", customer.district || ""],
      ["Post office", customer.postOffice || ""],
      ["City / Village", customer.city || ""],
      ["House / Flat", customer.house || ""],
      ["Street / Area", customer.area || ""],
      ["Landmark", customer.landmark || ""],
      ["Address type", customer.addressType || ""],
      ["Products", items.map(function(x){return x.name + " x " + x.quantity;}).join(" | ")],
      ["Quantities", items.map(function(x){return x.quantity;}).join(", ")],
      ["Selling total", data.total || 0],
      ["Purchase cost total", items.reduce(function(s,x){return s + Number(x.costPrice || 0) * Number(x.quantity || 0);},0)],
      ["Estimated profit", items.reduce(function(s,x){return s + (Number(x.unitPrice || 0) - Number(x.costPrice || 0)) * Number(x.quantity || 0);},0)],
      ["Payment method", data.paymentMethod || ""],
      ["Payment status", data.paymentStatus || ""],
      ["Order status", data.status || "Pending Approval"]
    ];
    if (sheet.getLastRow() > 0) sheet.insertRowsAfter(sheet.getLastRow(), 3);
    var start = sheet.getLastRow() + 1;
    sheet.getRange(start, 1, rows.length, 2).setValues(rows);
    sheet.getRange(start, 1, rows.length, 1).setFontWeight("bold");
    sheet.autoResizeColumns(1, 2);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}