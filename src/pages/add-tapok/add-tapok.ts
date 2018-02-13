import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController, AlertController, NavParams, LoadingController, NavController } from 'ionic-angular';
import { FireBaseService } from '../../providers/firebase-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import * as moment from 'moment';
//import { FirebaseListObservable } from 'angularfire2/database';

declare var google;
@IonicPage()
@Component({
	selector: 'add-tapok',
	templateUrl: 'add-tapok.html'
})
export class AddTapok {
	@ViewChild('autocomplete') autocompleteElement: ElementRef;
	autocomplete;
	element: any;

	label: any;
	key: any;

	event: any;
	host = '';
	name = '';
	date = moment().format();
	mDate: any;
	time = moment().format();
	mTime: any;
	enddate = '';
	mEndDate: any;
	endtime = '';
	mEndTime: any;
	venue = '';
	description = '';
	tapok = 1;
	search_key = '';
	timestamp = '';
	maxMembers = null;
	classification = 'General';
	dlURL: any;
	tags = 'false';
	lat = null;
	lng = null;

	temp: any;
	tag: any;
	Tags: any;
	tagsTest: any[] = [];

	loading: any;
	selectedPhoto: any;
	photo = '';

	keyword: any;
	word: any;

	addEndDate = false;
	addEndTime = false;

	toggle = false;
	toggleMembers = true;

	onSuccess = (snapshot) => {
		this.photo = snapshot.downloadURL;
		this.loading.dismiss();
	}
	
	onError = (error) => {
		console.log('error', error);
		this.loading.dismiss();
	}

	chat: any;

	constructor(public viewCtrl: ViewController, public navCtrl: NavController, public alertCtrl: AlertController, 
		public firebaseService: FireBaseService, public params: NavParams, public camera: Camera, public loadingCtrl: LoadingController, public geolocation: Geolocation) {
		var y = 0;

		this.host = firebaseService.user;
		this.label = params.get('label');
		this.event = params.get('tapok');
		this.Tags = this.firebaseService.getTempTag();
		if(this.event != undefined)
			this.editTapokInfo();

		
	}

	ionViewDidLoad() {
		/*this.geolocation.getCurrentPosition().then((position) => {
			this.lat = position.coords.latitude;
			this.lng = position.coords.longitude;
		});*/

		//var defaultBounds = new google.maps.LatLngBounds(this.lat, this.lng);
		var options = {
			//bounds: defaultBounds,
			componentRestrictions: {country: "phl"}
		};

		this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteElement.nativeElement, options);

		this.autocomplete.addListener('place_changed', function(){
			console.log('test');
			//var place = this.autocomplete.getPlace();
			//console.log(place);
		});
	}

	toggleOptions(){
		if(this.toggle == false)
			this.toggle = true;
		else{
			this.toggle = false;
			this.maxMembers = null;
		}
	}

	getLat(){
		var place = this.autocomplete.getPlace();
		if(place != undefined)
			var lat = place.geometry.location.lat();

		return lat;
	}

	getLng(){
		var place = this.autocomplete.getPlace();
		if(place != undefined)
			var lng = place.geometry.location.lng();

		return lng;
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	getLocation(){
		this.geolocation.getCurrentPosition().then((position) => {
			this.lat = position.coords.latitude;
			this.lng = position.coords.longitude;
		});
	}

	addTag(){
		if(this.temp!=null && this.temp!=''){
			this.tag = {
				"tags": this.temp
			}
			this.temp = '';
			this.tags = 'true';
			this.firebaseService.addTempTag(this.tag);
		}
	}

	deleteTag(key){
		this.firebaseService.deleteTempTag(key);
	}

	addTapok() {
		var i, y, eventKey;

		if(this.autocomplete.getPlace() != undefined){
			this.lat = this.getLat();
			this.lng = this.getLng();

			this.venue = document.getElementById('autocomplete')["value"];
			console.log(this.venue);
		}

		this.Tags.subscribe(snapshots => {
			this.tagsTest.length = 0;
			y = 0;
			snapshots.forEach(snapshot => {
				this.tagsTest[y] = snapshot.tags;
				y++;
			})
		});
		this.mDate = moment(this.date).format('MMM DD');
		this.mTime = moment(this.time).format('hh:mm a');
		
		if(this.enddate != '')
			this.mEndDate = moment(this.enddate).format('MMM DD');
		else
			this.mEndDate = '';
		if(this.endtime != '')
			this.mEndTime = moment(this.endtime).format('hh:mm a');
		else
			this.mEndTime = '';

		if(this.maxMembers != null){
			this.maxMembers = parseInt(this.maxMembers);
		}

		this.event={
			"host": this.host,
			"name": this.name,
			"photo": this.photo,
			"toggle": "false",
			"date": this.mDate,
			"time": this.mTime,
			"endtime": this.mEndTime,
			"enddate": this.mEndDate,
			"venue": this.venue,
			"description": this.description,
			"tags": this.tags,
			"tapok": this.tapok,
			"max_members": this.maxMembers,
			"search_key": this.name.toLowerCase(),
			"timestamp": 0-Date.now(),
			"latitude": this.lat,
			"longitude": this.lng
		};

		if(this.label == "Add Tapok")
			eventKey = this.firebaseService.addEvent(this.event);
		this.word = this.name.split(" ");
		for(i=0;i<this.word.length;i++){
			this.keyword={
				"keyword": this.word[i].toLowerCase(),
				"key": eventKey
			};
			this.firebaseService.addKeyword(this.keyword);
		}

		for(i=0;i<this.tagsTest.length;i++){
			this.tag={
				"tag": this.tagsTest[i].toLowerCase(),
				"key": eventKey
			}
			this.firebaseService.addTag(this.tag);
			if(i+1 == this.tagsTest.length)
				this.firebaseService.deleteAllTempTag();
		}		
		
		this.cancel(eventKey);
		let alert = this.alertCtrl.create({
			title: 'Tapok Added',
			buttons: [ 
				{
					text: 'close'
				},
				{
					text: 'VIEW EVENT',
					handler: () => {
						this.navCtrl.setRoot('TabsPage');
						this.navCtrl.push('TapokContent', { param1: eventKey});
					}
				}
			]
		});
		alert.present();
	}

	editTapok(){
		var eventKey;
		this.event={
			"host": this.host,
			"name": this.name,
			"photo": this.photo,
			"date": this.date,
			"time": this.time,
			"endtime": this.endtime,
			"enddate": this.enddate,
			"venue": this.venue,
			"description": this.description,
			"search_key": this.name.toLowerCase(),
			"timestamp": 0-Date.now()
		};

		this.word = this.name.split(" ");
		for(let i=0;i<this.word.length;i++){
			this.keyword={
				"keyword": this.word[i].toLowerCase(),
				"key": eventKey
			};
			this.firebaseService.addKeyword(this.keyword);
		}

		this.firebaseService.editEvent(this.key, this.event);
		this.cancel('adasd');
	}

	cancel(key){
		this.viewCtrl.dismiss();
	}

	editTapokInfo(){
		this.key = this.event.$key;
		this.name = this.event.name;
		this.date = this.event.date;
		this.time = this.event.time;
		this.enddate = this.event.enddate;
		this.endtime = this.event.endtime;
		this.venue = this.event.venue;
		this.description = this.event.description;

		if(this.event.enddate != "")
			this.addEndDate = true;
		if(this.event.endtime != "")
			this.addEndTime = true;
	}

	endDate(){
		if(this.addEndDate == false){
			this.addEndDate = true;
			this.enddate = moment().format();
		}
		else{
			this.addEndDate = false;
			this.enddate = '';
		}
	}

	endTime(){
		if(this.addEndTime == false){
			this.addEndTime = true;
			this.endtime = moment().format();
		}
		else{
			this.addEndTime = false;	
			this.endtime = '';
		}
	}

	openGallery(){
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: 0
		  }
		  
		  this.uploadPhoto(options);
	}

	openCamera(){
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		  }

		  this.uploadPhoto(options);
	}

	uploadPhoto(options){
		this.camera.getPicture(options).then((imageData) => {
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();

			this.selectedPhoto = this.dateURItoBlob('data:image/jpeg;base64,' + imageData);

			this.upload();
		}, (err) => {
		});
	}

	dateURItoBlob(dataURI){
		let binary = atob(dataURI.split(',')[1]);
		let array = [];
		for (let i = 0; i < binary.length; i++) {
		  array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
	}

	upload() {
		var key = this.firebaseService.addImageName();

		if (this.selectedPhoto) {
		  this.dlURL = this.firebaseService.uploadPhoto(this.selectedPhoto, key);
		  this.dlURL.then(this.onSuccess, this.onError);  
		}
	}
}
