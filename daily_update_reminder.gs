function myFunction() {
  var link = "https://docs.google.com/spreadsheets/d/19fH7dK-JDW3IsBLwY4IkIgkFsET83m15zWOUc5FOkyfqT5JAB48/edit#gid=0"; // sharable sheet link to add it in email body
  var file_id = "19fH7dK-JDW3IsBLwY4IkIgkFsET83m15zWOUc5FOkyfqT5JAB48";  // id of google sheet 
  var file = DriveApp.getFileById(file_id);
  var g_sheet = SpreadsheetApp.open(file);//open file 
  g_sheet.setActiveSheet(g_sheet.getSheetByName('Sheet1'), true);//get "Sheet1" sheet
  var gmail_id = "testbench###@gmail.com";  // your email id (script owner email id)
  var col = "A";  // date column
  
  //add member details as follows 
  list = [
    {name:"Employee1_name", email:"testbench###@gmail.com", col:"B"},
    {name:"Employee2_name", email:"testbench###@gmail.com", col:"C"}
  ]
    
  var date = new Date();
  date.setHours(0,0,0,0); //optional
  var t_date  = Utilities.formatDate(date, 'EDT', 'MM/dd/YYYY'); 
  var column = g_sheet.getRange(col + ":" + col);
  var values = column.getValues();
  var row = 0;
  while ( values[row]) {
    var cell_date = new Date(values[row][0]);
    var ct_date  = Utilities.formatDate(cell_date, 'EDT', 'MM/dd/YYYY');
    if(ct_date === t_date)
      break;
    row++;
  }
  var cell_date = new Date(values[row][0]);
  var ct_date  = Utilities.formatDate(cell_date, 'EDT', 'MM/dd/YYYY');
  if (ct_date !== t_date){
    Logger.log("Today's Date not Found!!!")
    return -1;
  }
  var from_email_id = gmail_id;     //sender email
  //loop for each member 
  list.forEach((element) => {  
  var cell = element["col"] +(row+1).toString();    
  var comment_cell = g_sheet.getActiveSheet().getRange(cell).getValue();
  comment_cell = comment_cell.trim();
  if (comment_cell.length == 0){
    Logger.log("empty")
    var to_email_id = element["email"];     //recipient email
    var subject = "Missed daily update "+ t_date;
    var body = 'Hello '+element["name"]+', \nYou have missed  daily update on '+ t_date+'. \nplease update it.\nG_sheet: '+link+'\n\nThank you\n\n(--- this is an automated email ---)';
    var sender_name = "Automatic Emailer Script Reminder";
    GmailApp.sendEmail(to_email_id, subject, body, {
      from: from_email_id,
      name: sender_name
    });
  }
  Logger.log("Name: "+element["name"]+" Date: "+t_date+" Comment:"+comment_cell);
  
  });
}