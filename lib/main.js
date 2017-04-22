'use strict';

const request = require('request');

var URL;
var USER;
var PWD;

/*
 * Constructor for the module. Sets starting variables
 */
exports.setup = function(url, username, pwd){
  URL = this.url;
  USER = this.username;
  PWD = this.pwd;
}

/*
 * Returns the setup information as a JSON
 */
exports.getInfo = function(){
  return {
    "URL": URL,
    "USERNAME": USER,
    "PASSWORD": PWD
  }
}

/*
 * Used to login to the CRM
 * Return: access token if successful, body and err if not as a callback
 * Params: null
 */
exports.login = function(callback){
  var data = {
    grant_type: "password",
    client_id: "sugar",
    client_secret: "",
    username: USER,
    password: PWD,
    platform: "custom_api"
  };

  request({
    uri: URL + '/oauth2/token',
    method: 'POST',
    json: true,
    formData: data,
    resolveWithFullResponse: true
  }, function (err, req, body) {
    if (!err) {
        return callback(body['access_token']);
    } else {
        return callback(body, err);
    }
  });
}

/*
 * Used to logout of the current session
 * Return: body if successful, body and err if not as a callback
 * Params: sessionID
 */
exports.logout = function(sessionID, callback){
  request({
    url: CRM_URL + '/oauth2/logout',
    method: 'POST',
    headers: {
        'oauth-token': sessionID
    },
    json: true,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

/*
 * Used to get all the data from one module and ID
 * Return: body if successful, body and err if not as a callback
 * Params: sessionID, module, id
 */
exports.getOne = function(sessionID, module, id, callback){
  request({
    url: CRM_URL + '/' + module + '/' + id,
    method: 'GET',
    headers: {
        'oauth-token': sessionID
    },
    json: true,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

/*
 * Used to get the data from one module with a filter
 * Return: body if successful, body and err if not as a callback
 * Params: sessionID, module, data
 */
exports.getFilterData = function(sessionID, module, data, callback){
  request({
    url: CRM_URL + '/' + module + '/filter',
    method: 'POST',
    headers: {
        'oauth-token': sessionID
    },
    json: true,
    body: data,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

/*
 * Used to create a new record in the CRM
 * Return: body if successful, body and err if not as a callback. Body is the full details of the new record
 * Params: sessionID, module, data
 */
exports.createRecord = function(sessionID, module, data, callback){
  request({
    url: CRM_URL + '/' + module,
    method: 'POST',
    headers: {
      'oauth-token': sessionID,
    },
    json: true,
    body: data,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

/*
 * Used to update a record in the CRM
 * Return: body if successful, body and err if not as a callback. Body is the full details of the new record
 * Params: sessionID, module, id, data
 */
exports.updateRecord = function(sessionID, module, id, data, callback){
  request({
    url: CRM_URL + '/' + module + '/' + id,
    method: 'PUT',
    headers: {
      'oauth-token': sessionID,
    },
    json: true,
    body: data,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

/*
 * Used to delete a record in the CRM
 * Return: body if successful, body and err if not as a callback. Body is the full details of the new record
 * Params: sessionID, module, id
 */
exports.deleteRecord = function(sessionID, module, id, callback){
  request({
    url: CRM_URL + '/' + module + '/' + id,
    method: 'DELETE',
    headers: {
      'oauth-token': sessionID,
    },
    json: true,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

/*
 * Used to subsribe to a record in the CRM
 * Return: body if successful, body and err if not as a callback. Body is true if successful
 * Params: sessionID, module, id
 */
exports.followRecord = function(sessionID, module, id, callback){
  recordAction(sessionID, module, id, 'subscribe', function(body, err){
    callback(body, err);
  });
}

/*
 * Used to favourite to a record in the CRM
 * Return: body if successful, body and err if not as a callback. Body is true if successful
 * Params: sessionID, module, id
 */
exports.favouriteRecord = function(sessionID, module, id, callback){
  recordAction(sessionID, module, id, 'favorite', function(body, err){
    callback(body, err);
  });
}

/*
 * Used to subsribe to a record in the CRM
 * Return: body if successful, body and err if not as a callback. Body is true if successful
 * Params: sessionID, module, id
 */
exports.unfollowRecord = function(sessionID, module, id, callback){
  recordAction(sessionID, module, id, 'unsubscribe', function(body, err){
    callback(body, err);
  });
}

/*
 * Used to unfavourite to a record in the CRM
 * Return: body if successful, body and err if not as a callback. Body is true if successful
 * Params: sessionID, module, id
 */
exports.unfavouriteRecord = function(sessionID, module, id, callback){
  recordAction(sessionID, module, id, 'unfavorite', function(body, err){
    callback(body, err);
  });
}

/*
 * Used to search the CRM globally
 * Return: body if successful, body and err if not as a callback. Body is the full details of the search results
 * Params: sessionID, searchData
 */
exports.search = function(sessionID, searchData, callback){
  searchData = buildURL(searchData);
  if(!searchData){
    callback(null, {"action":"fail", "msg":"Failed to convert search data to url"});
  }
  request({
    url: CRM_URL + '/search/?' + searchData,
    method: 'GET',
    headers: {
      'oauth-token': sessionID,
    },
    json: true,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

function recordAction(sessionID, module, id, type, callback){
    request({
    url: CRM_URL + '/' + module + '/' + id + '/' + type,
    method: 'POST',
    headers: {
      'oauth-token': sessionID,
    },
    json: true,
  }, function (err, req, body) {
    if (body.success == true) {
        return callback(body)
    } else {
        return callback(body, err);
    }
  });
}

function buildURL(data) {
   var components = [];
   for (var i in data){
     components.push('&');
     components.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
   }
  return components;
}