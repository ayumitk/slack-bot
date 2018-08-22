function postSlack(text){
  var url = "https://hooks.slack.com/services/*****"; // Incoming hook
  var options = {
    "method" : "POST",
    "headers": {"Content-type": "application/json"},
    "payload" : '{"text":"' + text + '"}'
  };
  UrlFetchApp.fetch(url, options);
}

function hey(){
  postSlack("Hey!");
}
