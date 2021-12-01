const chiavistelloApi=require('./chiavistello-api.js');


chiavistelloApi.setKey('xxxxxxxxxxxxxxxxxxxxxxxx');
chiavistelloApi.info((err,rsp) => { showResult('info',err,rsp); });
chiavistelloApi.switchList((err,rsp) => { showResult('switchList',err,rsp); });
chiavistelloApi.partitionList((err,rsp) => { showResult('partitionList',err,rsp); });
chiavistelloApi.bookingList((err,rsp) => { showResult('bookingList',err,rsp); });
chiavistelloApi.bookingListAll(0,(err,rsp) => { showResult('bookingList',err,rsp); });
chiavistelloApi.bookingGetById(26124,(err,rsp) => { showResult('bookingGet',err,rsp); });
if(0) {
	var data={
		id: 26124,
		notify: 1
	};
	chiavistelloApi.bookingSet(data,(err,rsp)=>{showResult('bookingSet',err,rsp)});
}
if(0) {
	chiavistelloApi.bookingDelete(26124,(err,rsp)=>{showResult('bookingDelete',err,rsp)});
}
chiavistelloApi.guestList((err,rsp)=>{showResult('guestList',err,rsp)});


function showResult(method,err,rsp) {
	if(err) {
		console.log('Method: '+method+' Error: '+err);
	} else {
		console.log('Method: '+method+' Result:',rsp);
	}
}
