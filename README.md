## js-sugar

Node.js connector for Sugar CRM version 7.* using API v10

### Getting started
To start, you need to provide the sugar url, username and password
```javascript
var sugar = require('js-sugar');

sugar.setup(url, username, password);
```
To verify the correct details, you can call getInfo
```javascript
var loginData = sugar.getInfo();

var url = loginData.URL;
var username = loginData.username;
var password = loginData.password;
```

You can then login and retieve your sessionID
```javascript
sugar.login(function(body, err){
  if(!err){
    console.log("SUCCESS!");
  }
});
```

### Usage
The getOne function retrieves all of the data from one record by passing through its module (e.g. Contacts) and it's ID e.g(asdjkh1-4nabep-sdfljl-ljf12)
```javascript
sugar.getOne(sessionID, module, id, callback);
```

getFilterData retrieves selected data from a particular module. You can visit the sugarCRM REST API v10 documentation for how what to pass through with data
```javascript
sugar.getFilterData(sessionID, module, data, callback);
```
These CRUD function can be used to create, update and delete records by passing through the relevant data and/or id
```javascript
sugar.createRecord(sessionID, module, data, callback);
sugar.updateRecord(sessionID, module, id, data, callback);
sugar.deleteRecord(sessionID, module, id, callback);
```
The ability to follow and/or favourite a record can also be done by using the following functions
```javascript
sugar.followRecord(sessionID, module, id, callback);
sugar.favoriteRecord(sessionID, module, id, callback);
sugar.unfollowRecord(sessionID, module, id, callback);
sugar.unfavoriteRecord(sessionID, module, id, callback);
```

The global search function can also be used by passing through the appropriate variables as a JSON into searchData 
```javascript
sugar.search(sessionID, searchData, callback);
```

Finally, after you have finished with the data, be sure to log out of your current session
```javascript
sugar.logout(sessionID, function(err, body){
  if(!err){
    console.log("LOGOUT SUCCESS!");
  }
});
```
