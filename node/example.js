// Test utilizzo libreria client API Chiavistello
// vim: tabstop=4:shiftwidth=4

const chiavistelloApi=require('./chiavistello-api.js');

var myKey='xxxxxxxxxxxxxxxxxxxxxxxx';

(async ()=> {
chiavistelloApi.setKey(myKey);
try {
	var r;
	r=await chiavistelloApi.info();
	showResult('info',r);
	r=await chiavistelloApi.switchList();
	showResult('switchList',r);
	r=await chiavistelloApi.partitionList();
	showResult('partitionList',r);
	r=await chiavistelloApi.bookingList();
	showResult('bookingList',r);
	var id=await userPrompt('bookingGetById() - Inserisci ID: ');
	if(id>0) {
		r=await chiavistelloApi.bookingGetById(id);
		showResult('bookingGetById('+id+')',r);
	}
	var xref=await userPrompt('bookingGetByXref() - Inserisci Xref: ');
	if(xref!='') {
		r=await chiavistelloApi.bookingGetByXref(xref);
		showResult('bookingGetByXref('+xref+')',r);
	}
	r=await chiavistelloApi.guestList();
	showResult('guestList',r);
} catch(e) {
	console.log('Error',e);
}
})()

async function userPrompt(prompt) {
	return new Promise((resolve,reject)=>{
		const readline=require('readline').createInterface({input:process.stdin,output:process.stdout});
		readline.question(prompt,name=>{
			resolve(name);
			readline.close();
		});
	});
}
function showResult(method,rsp) {
	console.log('Method: '+method+' Result:',rsp);
}
