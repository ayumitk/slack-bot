function postSlack(text){
  var url = "https://hooks.slack.com/services/*****"; // Incoming hook
  var options = {
    "method" : "POST",
    "headers": {"Content-type": "application/json"},
    "payload" : '{"text":"' + text + '"}'
  };
  UrlFetchApp.fetch(url, options);
}

function doPost(e) {
  // Check token
  if (e.parameter.token != "*****") { // Outgoing Webhooks Token
    return;
  }
   
  // Get paramerer
  var text = e.parameter.text;
  var userID = e.parameter.user_name;

  // Dinner
  if(text.match(/dinner/)){
    dinner(text);

  // Weather
  } else if(text.match(/weather/)){
    weather(text);
    
  // Anniversary
  } else if(text.match(/anniversary/)){
    anniversary();
    
  // Other
  } else {
    var message = 'Hey, <@' + userID + '> !';
    postSlack(message);
  }
}

/*-----------------------------------
  Dinner
----------------------------------- */
function dinner(text){    
  var column = [
    ['A',1],
    ['B',2],
    ['C',3]
  ];
  
  if(text.match(/cook/)){
    getDinner(column[0][0], column[0][1]);
  } else if(text.match(/takeout/)){
    getDinner(column[1][0], column[1][1]);
  } else if(text.match(/restaurant/)){
    getDinner(column[2][0], column[2][1]);
  } else {
    getAllDinner();
  }
}

function getDinner(column, num){
  var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/*****');
  var sheet = ss.getSheets()[0];

  var counta = sheet.getRange(column + "2").getValue().toFixed(0);
  var dinnerData = sheet.getSheetValues(3,num,counta,1);
  var random = Math.floor(Math.random() * counta).toFixed(0);
  var dinner = dinnerData[random][0];
  // Logger.log(dinner);
  postSlack(dinner);
}

function getAllDinner(){
  var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/*****');
  var sheet = ss.getSheets()[0];

  var cookCounta = sheet.getRange("A2").getValue().toFixed(0);
  var cookData = sheet.getSheetValues(3,1,cookCounta,1);
  
  var takeoutCounta = sheet.getRange("B2").getValue().toFixed(0);
  var takeoutData = sheet.getSheetValues(3,2,takeoutCounta,1);
  
  var restaurantCounta = sheet.getRange("C2").getValue().toFixed(0);
  var restaurantData = sheet.getSheetValues(3,3,restaurantCounta,1);
  
  var othersCounta = sheet.getRange("D2").getValue().toFixed(0);
  var othersData = sheet.getSheetValues(3,4,othersCounta,1);
  
  var dinnerData = cookData.concat(takeoutData).concat(restaurantData).concat(othersData);
  
  var counta = dinnerData.length.toFixed(0);
  var random = Math.floor(Math.random() * counta).toFixed(0);
  var dinner = dinnerData[random][0];

  // Logger.log(dinner);
  postSlack(dinner);
}

/*-----------------------------------
  Weather
----------------------------------- */
function weather(text){

  var YQLQuery = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='vancouver, bc')";
  var data = UrlFetchApp.fetch("https://query.yahooapis.com/v1/public/yql?q="+YQLQuery+"&format=json");
  //Logger.log(data);
  var json = JSON.parse(data.getContentText());
  
  var title = json["query"]["results"]["channel"]["title"];
  var link = "https://weather.yahoo.com/country/state/city-9807/";
  
  var sunrise = json["query"]["results"]["channel"]["astronomy"]["sunrise"];
  var sunset = json["query"]["results"]["channel"]["astronomy"]["sunset"];
  
  var message = '';
  
  if(text.match(/sunrise/)){
    message += ':sunrise_over_mountains: ' + sunrise;
  } else if(text.match(/sunset/)){
    message += ':city_sunset: ' + sunset;
  } else if(text.match(/tomorrow/)){
    message += forecast(json, 1, 1);
  } else if(text.match(/7day/)){
    message += forecast(json, 0, 6);
  } else {
    message += forecast(json, 0, 0);
  }
  
  message += '\n<' + link + '|' + title + '>';
  
  // Logger.log(message);
  postSlack(message);
}

// Emoji
function weatherEmoji(weather){
  if(weather.match(/Sunny/)){
    if (weather.match(/Mostly/)){
      weather = ':mostly_sunny:' + weather;
    } else {
      weather = ':sunny:' + weather;
    }
  } else if (weather.match(/Rain/)){
    weather = ':rain_cloud:' + weather;
  } else if (weather.match(/Scattered Showers/)){
    weather = ':partly_sunny_rain:' + weather;
  } else if (weather.match(/Partly Cloudy/)){
    weather = ':partly_sunny:' + weather;
  }
  return weather;
}

// Convert °F to °C (rounding)
function FtoC(temp){
  temp = Math.round((temp - 32) / 1.8);
  return temp;
}

// Get forecast
function forecast(data, first, length){
  var forecast = '';
  for(var i = first; i <= length; i++) {
    var weather = data["query"]["results"]["channel"]["item"]["forecast"][i]["text"];
    var date = data["query"]["results"]["channel"]["item"]["forecast"][i]["date"];
    var day = data["query"]["results"]["channel"]["item"]["forecast"][i]["day"];
    var high = data["query"]["results"]["channel"]["item"]["forecast"][i]["high"];
    var low = data["query"]["results"]["channel"]["item"]["forecast"][i]["low"];
    weather = weatherEmoji(weather);
    high = FtoC(high);
    low = FtoC(low);
    forecast += date + ' ' + day + ' ' + weather + ' :thermometer:' + high + '°C / ' + low + '°C\n';
  }
  return forecast;
}

/*-----------------------------------
  Anniversary
----------------------------------- */
function anniversary(){
  var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/*****');
  var sheet = ss.getSheets()[1];
  var days = sheet.getRange("E2").getValue().toFixed(0);
  var times = sheet.getRange("C2").getValue().toFixed(0);
  
  var message = '';
  
  if(times == 3){
    times = times + "rd"
  } else {
    times = times + "th"
  }

  if(days == 366){
    message = 'It is our ' + times + ' Anniversary:tada:';
  } else {
    message = days + ' days left to our ' + times + ' Anniversary:tada:';
  }
  
  // Logger.log(message);
  postSlack(message);
}
