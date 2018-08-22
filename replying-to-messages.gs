function doPost(e) {
  // Check token
  if (e.parameter.token != "*****") { // Outgoing Webhooks Token
    return;
  }
   
  // Get paramerer
  var userID = e.parameter.user_name;

  var message = 'Hey, <@' + userID + '> !';

  postSlack(dinner);
}
