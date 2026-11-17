// Optional Google Apps Script endpoint for sending new CARTIFY orders to a Google Sheet.
// Create a Google Sheet, open Extensions > Apps Script, paste this file, set SHEET_NAME,
// then Deploy > New deployment > Web app. Execute as: Me. Access: Anyone.
// Keep the deployed URL private; paste it into SHEETS_WEB_APP_URL in app.js.
const SHEET_NAME = "Orders";
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    const headers = ["Order ID","Created At","Customer Name","Email","Mobile","Alternate Mobile","PIN","State","District","Post Office","City/Village","House/Flat","Street/Area","Landmark","Address Type","Products","Quantity","Subtotal","Payment Method","Payment Status","Order Status"];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);
    const items = (data.items || []);
    const customer = data.customer || {};
    sheet.appendRow([
      data.orderId || "", data.createdAt || new Date().toISOString(),
      customer.name || "", data.email || "", customer.mobile || "",
      customer.alternate || "", customer.pincode || "", customer.state || "",
      customer.district || "", customer.postOffice || "", customer.city || "",
      customer.house || "", customer.area || "", customer.landmark || "",
      customer.addressType || "", items.map(x => x.name).join(" | "),
      items.reduce((n,x) => n + Number(x.quantity || 0), 0),
      data.total || 0, data.paymentMethod || "", data.paymentStatus || "Pending",
      data.status || "New"
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
