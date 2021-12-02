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
	info: async function() {
		return await this.apiRequest('info',null);
	},
	// Elenco switch
	switchList: async function() {
		return await this.apiRequest('switchList',null);
	},
	// Elenco partizioni con relativi switch
	partitionList: async function(cb) {
		return await this.apiRequest('partitionList',null);
	},
	// Elenco prenotazioni
	bookingList: async function(data) {
		if(!isNaN(data)) {		// Primo argomento un numero: pagina
			data={ page: data };
		}
		if(typeof(data)=='object') {
			return await this.apiRequest('bookingList',data);
		} else {
			return await this.apiRequest('bookingList',null);
		}
	},
	bookingListAll: async function(page) {
		var data={ all:true, page:page };
		return await this.bookingList(data);
	},
	// Recupera prenotazione (base)
	bookingGet: async function(data) {
		return await this.apiRequest('bookingGet',data);
	},
	bookingGetById: async function(id) {
		var data={ id:id };
		return await this.apiRequest('bookingGet',data);
	},
	bookingGetByXref: async function(xref) {
		var data={ externalReference:xref };
		return await this.apiRequest('bookingGet',data);
	},
	// Crea/modifica prenotazione
	bookingSet: async function(data) {
		return await this.apiRequest('bookingSet',data);
	},
	// Elimina prenotazione
	bookingDelete: async function(id) {
		var data={ id:id };
		return await this.apiRequest('bookingDelete',data);
	},
	// Elenco ospiti
	guestList: async function(data) {
		if(!isNaN(data)) {		// Primo argomento un numero: pagina
			data={ page: data };
		}
		if(typeof(data)=='object') {
			return await this.apiRequest('guestList',data);
		} else {
			return await this.apiRequest('guestList',null);
		}
	},
	//////////////////////////////////////////////////////////////////////////////
	// Mid-Level
	//////////////////////////////////////////////////////////////////////////////
	apiRequest: async function(method,post) {
		return new Promise((resolve, reject) => {
			if(post==null) post={};
			post.token=this.apiKey;
			post.action=method;
			this.post(post)
				.then((rsp)=>{
					rsp=JSON.parse(rsp);
					if(rsp.error) {
						reject(rsp.error);
					} else {
						resolve(rsp);
					}
				})
				.catch((err)=>{
					reject(err);
				})
		});
	},
	//////////////////////////////////////////////////////////////////////////////
	// Low-Level
	//////////////////////////////////////////////////////////////////////////////
	post: async function(postdata) {
		return new Promise((resolve, reject) => {
			postdata=JSON.stringify(postdata);
			var out='';
			var opts={
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': postdata.length
				},
				method: 'POST'
			};
			try {
				var req=require('https').request('https://chiavistello.it/api',opts,(rsp)=>{
					rsp.on('end',(x)=>{
						resolve(out);
					});
					rsp.on('data',(chunk)=>{
						out+=chunk;
					});
				});
				req.on('error',(e)=>{
					reject(e.message);
				});
			} catch(e) {
				reject(e.message);
			}
			if(req) {
				req.write(postdata);
				req.end();
			}
		});
	}
};

module.exports=chiavistelloApi;

