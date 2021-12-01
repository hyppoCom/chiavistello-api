//// 
//// chiavistello-api.js
//// Libreria client API Chiavistello
//// https://chiavistello.it/api
//// vim: tabstop=4:shiftwidth=4
////
'use strict'

const chiavistelloApi={
	apiKey: null,

	//////////////////////////////////////////////////////////////////////////////
	// Hi-Level
	//////////////////////////////////////////////////////////////////////////////
	// Imposta apiKey
	setKey: function(apiKey) {
		this.apiKey=apiKey;
	},
	// Informazioni sul Chiavistello
	info: function(cb) {
		this.apiRequest('info',null,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	// Elenco switch
	switchList: function(cb) {
		this.apiRequest('switchList',null,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	// Elenco partizioni con relativi switch
	partitionList: function(cb) {
		this.apiRequest('partitionList',null,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	// Elenco prenotazioni
	bookingList: function(data,cb) {
		if(!isNaN(data)) {		// Primo argomento un numero: pagina
			data={ page: data };
		}
		if(typeof(data)=='object') {
			this.apiRequest('bookingList',data,(err,rsp)=>{
				cb(err,rsp);
			});
		} else if(typeof(data)=='function') {	// Primo argomento una funzione, era la callback
			this.apiRequest('bookingList',null,(err,rsp)=>{
				data(err,rsp);
			});
		}
	},
	bookingListAll: function(page,cb) {
		var data={ all:true, page:page };
		this.bookingList(data,cb);
	},
	// Recupera prenotazione (base)
	bookingGet: function(data,cb) {
		this.apiRequest('bookingGet',data,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	bookingGetById: function(id,cb) {
		var data={ id:id };
		this.apiRequest('bookingGet',data,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	bookingGetByXref: function(xref,cb) {
		var data={ externalReference:xref };
		this.apiRequest('bookingGet',data,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	// Crea/modifica prenotazione
	bookingSet: function(data,cb) {
		this.apiRequest('bookingSet',data,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	// Elimina prenotazione
	bookingDelete: function(id,cb) {
		var data={ id:id };
		this.apiRequest('bookingDelete',data,(err,rsp)=>{
			cb(err,rsp);
		});
	},
	// Elenco ospiti
	guestList: function(data,cb) {
		if(!isNaN(data)) {		// Primo argomento un numero: pagina
			data={ page: data };
		}
		if(typeof(data)=='object') {
			this.apiRequest('guestList',data,(err,rsp)=>{
				cb(err,rsp);
			});
		} else if(typeof(data)=='function') {	// Primo argomento una funzione, era la callback
			this.apiRequest('guestList',null,(err,rsp)=>{
				data(err,rsp);
			});
		}
	},
	//////////////////////////////////////////////////////////////////////////////
	// Mid-Level
	//////////////////////////////////////////////////////////////////////////////
	apiRequest: function(method,post,cb) {
		if(post==null) post={};
		post.token=this.apiKey;
		post.action=method;
		this.post(post,(err,rsp)=>{
			if(!err) {
				rsp=JSON.parse(rsp);
				if(rsp.error) {
					err=rsp.error;
				}
			}
			cb(err,rsp);
		});
	},
	//////////////////////////////////////////////////////////////////////////////
	// Low-Level
	//////////////////////////////////////////////////////////////////////////////
	post: function(post,cb) {
		var out='';
		var post=JSON.stringify(post);
		var opts={
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': post.length
			},
			method: 'POST'
		};
		try {
		var req=require('https').request('https://wwh.chiavistello.it/api',opts,(rsp)=>{
			rsp.on('end',(x)=>{
				cb(null,out);
			});
			rsp.on('data',(chunk)=>{
				out+=chunk;
			});
		});
		req.on('error',(e)=>{
			cb(e.message,null);
		});
		} catch(e) {
			cb(e.message,null);
		}
		if(req) {
			req.write(post);
			req.end();
		}
	}
};

module.exports=chiavistelloApi;

