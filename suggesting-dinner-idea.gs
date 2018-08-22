function doPost(e) {
  // Check token
  if (e.parameter.token != "*****") { // Outgoing Webhooks Token
    return;
  }
   
  // Get paramerer
  var text = e.parameter.text;
  var userID = e.parameter.user_name;

  var message = '';

  // Dinner
  if(text.match(/dinner/)){
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/*****'); // your google sheets URL
    var sheet = ss.getSheets()[0];

    var counta = sheet.getRange("B1").getValue().toFixed(0);
    var ideas = sheet.getSheetValues(1, 1, counta, 1);

    var length = ideas.length.toFixed(0);
    var random = Math.floor(Math.random() * length).toFixed(0);
    var dinner = dinnerData[random][0];

    message = 'How about ' + dinner + '?';

  } else {
    message = 'Hey, <@' + userID + '> !';
  }

  postSlack(dinner);
}
