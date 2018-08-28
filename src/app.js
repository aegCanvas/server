const express=require('express');
const request=require('request');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const cors=require('cors');
const app=express()

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.post('/upload',(req,res)=>{
	////
//komponen ass parsing
var menit_awal=[];
var menit_akhir=[];
var index=[];
var style=[];
var line=[];
///
var json=[];
var json_dua=[1,2,3,4,5];
let isiass=decodeURI(req.body.data);
//console.log(isiass);
var timecode_awal=isiass.match(/Dialogue: \d+.(\d+):(\d+):(\d+.\d+),/g);
var timecode_akhir=isiass.match(/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,[\w\d]+../g);
var dialog=isiass.match(/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,[\w\d\s+-]+,([\w\d]+|),\d+,\d+,\d+,(\w+|),(.*)/g);
//onsole.log(timecode_akhir);
for(x in timecode_awal){
	var temp=/Dialogue: \d+,(\d+):(\d+):(\d+.\d+)/.exec(timecode_awal[x]);
	var initial_time=(temp[1]*3600)+(temp[2]*60)+(Math.round(temp[3].replace(/^0/,'')));
	menit_awal.push(initial_time);
}
for(x in timecode_akhir){
	var temp=/Dialogue: \d+.\d+:\d+:\d+.\d+,(\d+):(\d+):(\d+.\d+)/.exec(timecode_akhir[x]);
	var temp2=/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,([\w\d]+)../.exec(timecode_akhir[x]);
	var existing_time=(temp[1]*3600)+(temp[2]*60)+(Math.round(temp[3].replace(/^0/,'')));
	style.push(temp2[1]);
	menit_akhir.push(existing_time);
}

for(x in dialog){
	var dial=/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,[\w\d\s+-]+,([\w\d]+|),\d+,\d+,\d+,(\w+|),(.*)/.exec(dialog[x]);
	line.push(dial[3]);
}

for(x=1;x<=timecode_awal.length;x++){
	index.push(x);
}
//console.log(menit_awal.length);
//console.log(menit_akhir.length);
//console.log(style.length);
//console.log(line.length);
for(x=0;x<menit_awal.length;x++){
var payload={};	
payload['index']=index[x];
payload['start']=menit_awal[x];
payload['end']=menit_akhir[x];
payload['style']=style[x];
payload['actor']='#';
payload['effect']='#';
payload['line']=line[x];
json.push(payload);
}
//console.log(json[0]['line']);
res.send(json);
})

app.get('/link', (req,res) => {
////
//komponen ass parsing
var menit_awal=[];
var menit_akhir=[];
var index=[];
var style=[];
var line=[];
///
var json=[];
var json_dua=[1,2,3,4,5];
var ass=req.query.ass;

	request.get(ass, (err,response) => {
	if(err) throw err;
	try {
		let isiass=decodeURI(response.body);
	//console.log(isiass);
	var timecode_awal=isiass.match(/Dialogue: \d+.(\d+):(\d+):(\d+.\d+),/g);
	var timecode_akhir=isiass.match(/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,[\w\d]+../g);
	var dialog=isiass.match(/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,[\w\d\s+-]+,([\w\d]+|),\d+,\d+,\d+,(\w+|),(.*)/g);
	//onsole.log(timecode_akhir);
	for(x in timecode_awal){
		var temp=/Dialogue: \d+,(\d+):(\d+):(\d+.\d+)/.exec(timecode_awal[x]);
		var initial_time=(temp[1]*3600)+(temp[2]*60)+(Math.round(temp[3].replace(/^0/,'')));
		menit_awal.push(initial_time);
	}
	for(x in timecode_akhir){
		var temp=/Dialogue: \d+.\d+:\d+:\d+.\d+,(\d+):(\d+):(\d+.\d+)/.exec(timecode_akhir[x]);
		var temp2=/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,([\w\d]+)../.exec(timecode_akhir[x]);
		var existing_time=(temp[1]*3600)+(temp[2]*60)+(Math.round(temp[3].replace(/^0/,'')));
		style.push(temp2[1]);
		menit_akhir.push(existing_time);
	}

	for(x in dialog){
		var dial=/Dialogue: \d+,\d+:\d+:\d+.\d+,\d+:\d+:\d+.\d+,[\w\d\s+-]+,([\w\d]+|),\d+,\d+,\d+,(\w+|),(.*)/.exec(dialog[x]);
		line.push(dial[3]);
	}

	for(x=1;x<=timecode_awal.length;x++){
		index.push(x);
	}
	//console.log(menit_awal.length);
	//console.log(menit_akhir.length);
	//console.log(style.length);
	//console.log(line.length);
	for(x=0;x<menit_awal.length;x++){
	var payload={};	
	payload['index']=index[x];
	payload['start']=menit_awal[x];
	payload['end']=menit_akhir[x];
	payload['style']=style[x];
	payload['actor']='#';
	payload['effect']='#';
	payload['line']=line[x];
	json.push(payload);
	}
	//console.log(json[0]['line']);
	res.send(json);
	} catch (error) {
		res.send('KONTOLLLL');
	}
	
	});

});

app.get('/', (req,res) => {
res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
console.log('Example app listening on port 3000!')
});