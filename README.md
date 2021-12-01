# chiavistello-api

This library allows to control Chiavistello Self Check-In.\
See (https://chiavistello.it/api)


## Example

See example.js

Obtain ApiKey in your control panel

```
chiavistelloApi.setKey('myApiKey');
chiavistelloApi.info((err,rsp) => {
	showResult('info',err,rsp);
});
````

