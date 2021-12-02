<?PHP
################################################################################
#### chiavistello-api.class.php
#### vim: tabstop=4:shiftwidth=4
################################################################################

class ChiavistelloAPI {
	var $token=null;
	var $curl=null;
	var $skipTLScheck=false;
	var $curlTimeout=10;
	var $partitionMap=null;
	var $partitionMapFile="chiavistello-api-partmap.json";
	// If using DB
	var $DB=null;
	var $dbPartRead="select data from parameters where id='cvlpart'";
	var $dbPartWrite="update parameters set data='%s' where id='cvlpart'";
	
	################################################################################
	#### __construct($token)
	################################################################################
	function __construct($token) {
		$this->token=$token;
	}
	################################################################################
	#### skipCertificateCheck()
	#### Se non si desidera verifica del certificato (vecchie versioni di PHP/CURL)
	################################################################################
	function skipCertificateCheck() {
		$this->skipTLScheck=true;
	}
	################################################################################
	#### request($action,$post=null)
	################################################################################
	private function request($action,$post=null) {
		if(!is_array($post)) $post=array();
		$post['action']=$action;
		$post['token']=$this->token;
		$url="https://chiavistello.it/api";
		$post=json_encode($post);
		$this->curl=curl_init();
		curl_setopt_array($this->curl,array(
			CURLOPT_URL => $url,
			CURLOPT_CONNECTTIMEOUT => 5,
			CURLOPT_TIMEOUT => $this->curlTimeout,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_ENCODING => "gzip,deflate",
			CURLOPT_POST => true,
			CURLOPT_POSTFIELDS => $post
		));
		if($this->skipTLScheck) {
			curl_setopt_array($this->curl,array(
				CURLOPT_SSL_VERIFYHOST => false,
				CURLOPT_SSL_VERIFYPEER => false
			));
		}
		$this->result=curl_exec($this->curl);
		$this->errno=curl_errno($this->curl);
		if($this->errno!=0) {
			$this->error=curl_error($this->curl);
			return(null);
		}
		// $info=curl_getinfo($this->curl);
		// print_r($info);
		$this->errno=0;
		$this->result=json_decode($this->result,1);
		if(isset($this->result['error'])) {
			$this->error=$this->result['error'];
			$this->errno=1;
		}
		return($this->result);
	}
	################################################################################
	#### info()
	################################################################################
	function info() {
		return($this->request(__FUNCTION__));
	}
	################################################################################
	#### switchList()
	################################################################################
	function switchList() {
		$ls=$this->request(__FUNCTION__);
		if(!isset($ls[__FUNCTION__])) return($ls);
		$r=array();
		foreach($ls[__FUNCTION__] as $item) {
			$r[$item['id']]=$item['name'];
		}
		return($r);
	}
	################################################################################
	#### partitionList()
	#### Partitions changes very rarely, call this ONCE or only if the customer
	#### changes the rooms
	#### Client should maintain the mapping between internal and Chiavistello
	#### partition id
	################################################################################
	function partitionList() {
		$ls=$this->request(__FUNCTION__);
		if(!isset($ls[__FUNCTION__])) return($ls);
		$r=array();
		foreach($ls[__FUNCTION__] as $item) {
			$r[$item['id']]=array("name"=>$item['name'],"switches"=>$item['switches']);
		}
		$this->readPartitionMap();
		$this->partitionMap['list']=$r;
		$this->writePartitionMap();
		return($r);
	}
	################################################################################
	#### readPartitionMap()
	#### Read serialized partition list/map
	################################################################################
	function readPartitionMap() {
		if($this->DB) {
			list($data)=$this->DB->query($this->dbPartRead)->fetch_row();
		} else {
			if(!is_file($this->partitionMapFile)) return(array());
			$data=file_get_contents($this->partitionMapFile);
		}
		$this->partitionMap=json_decode($data,1);
	}
	################################################################################
	#### writePartitionMap()
	################################################################################
	function writePartitionMap() {
		$data=json_encode($this->partitionMap,JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
		if($this->DB) {
			$this->DB->query(sprintf($this->dbPartWrite,addslashes($data)));
		} else {
			file_put_contents($this->partitionMapFile,$data);
		}
	}
	################################################################################
	#### roomPartitionMap($intid,$cvlpid)
	#### Create mapping between client app room and Chiavistello partition id
	################################################################################
	function roomPartitionMap($intid,$cvlpid) {
		if(!is_array($this->partitionMap)) $this->readPartitionMap();
		if(!is_array($this->partitionMap)) $this->partitionMap=array();
		if(!is_array($this->partitionMap['map'])) $this->partitionMap['map']=array();
		if(!is_array($this->partitionMap['rmap'])) $this->partitionMap['rmap']=array();
		$this->partitionMap['map'][$intid]=$cvlpid;
		$this->partitionMap['rmap'][$cvlpid]=$intid;
		$this->writePartitionMap();
	}
	################################################################################
	#### room2partition($intid)
	#### Translate client app room to Chiavistello partition id
	################################################################################
	function room2partition($intid) {
		if(!is_array($this->partitionMap)) $this->readPartitionMap();
		if(!is_array($this->partitionMap['map'])) return(0);
		return($this->partitionMap['map'][$intid]);
	}
	################################################################################
	#### partition2room($cvlpid)
	#### Translate Chiavistello partition id to client app room
	################################################################################
	function partition2room($cvlpid) {
		if(!is_array($this->partitionMap)) $this->readPartitionMap();
		if(!is_array($this->partitionMap['rmap'])) return(0);
		return($this->partitionMap['rmap'][$cvlid]);
	}
	################################################################################
	#### bookingList($page=0,$perPage=50,$all=0)
	################################################################################
	function bookingList($page=0,$perPage=50,$all=0) {
		$rq=array();
		if($page>0) $rq['page']=$page;
		if($perPage>0) $rq['perPage']=$perPage;
		if($all) $rq['all']=1;
		$ls=$this->request(__FUNCTION__,$rq);
		return($ls);
	}
	################################################################################
	#### bookingGet($id=0,$xref=null)
	################################################################################
	function bookingGet($id=0,$xref=null) {
		$rq=array();
		if($id>0) $rq['id']=$id;
		elseif($xref!=null) $rq['externalReference']=$xref;
		else return;
		$r=$this->request(__FUNCTION__,$rq);
		if(isset($r['booking'])) return($r['booking']);
		return($r);
	}
	################################################################################
	#### bookingSet($data)
	################################################################################
	function bookingSet($data) {
		$r=$this->request(__FUNCTION__,$data);
		if(isset($r['booking'])) return($r['booking']);
		return($r);
	}
	################################################################################
	#### bookingDelete($id)
	################################################################################
	function bookingDelete($id) {
		$rq=array();
		if($id>0) $rq['id']=$id;
		$r=$this->request(__FUNCTION__,$rq);
		return($r);
	}
	################################################################################
	#### guestList($page=0,$perPage=50)
	################################################################################
	function guestList($page=0,$perPage=50) {
		$rq=array();
		if($page>0) $rq['page']=$page;
		if($perPage>0) $rq['perPage']=$perPage;
		$r=$this->request(__FUNCTION__,$rq);
		return($r);
	}
	################################################################################
	#### paymentList($page=0,$perPage=50,$all=0)
	################################################################################
	function paymentList($page=0,$perPage=50,$all=0) {
		$rq=array();
		if($page>0) $rq['page']=$page;
		if($perPage>0) $rq['perPage']=$perPage;
		if($all) $rq['all']=1;
		$r=$this->request(__FUNCTION__,$rq);
		return($r);
	}
	################################################################################
	#### paymentGet($id=0,$xref=null)
	################################################################################
	function paymentGet($id=0,$xref=null) {
		$rq=array();
		if($id>0) $rq['id']=$id;
		elseif($xref!=null) $rq['externalReference']=$xref;
		else return;
		$r=$this->request(__FUNCTION__,$rq);
		return($r);
	}
	################################################################################
	#### paymentSet($data)
	################################################################################
	function paymentSet($data) {
		$r=$this->request(__FUNCTION__,$data);
		return($r);
	}
	################################################################################
	#### paymentDelete($id)
	################################################################################
	function paymentDelete($id) {
		$rq=array();
		if($id>0) $rq['id']=$id;
		$r=$this->request(__FUNCTION__,$rq);
		return($r);
	}
}
