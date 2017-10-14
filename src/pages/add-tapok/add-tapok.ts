import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, NavParams } from 'ionic-angular';
import { FireBaseService } from '../../providers/firebase-service';
//import { FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
	selector: 'add-tapok',
	templateUrl: 'add-tapok.html'
})
export class AddTapok {

	event: any;
	name = '';
	date = '';
	time = '';
	venue = '';
	description = '';

	constructor(public viewCtrl: ViewController, public alertCtrl: AlertController, 
		public firebaseService: FireBaseService, public params: NavParams) {
			this.event = params.get('tapok');
			if(this.event != undefined)
				this.editTapok();
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	addTapok() {
		this.event={
			"name": this.name,
			"date": this.date,
			"time": this.time,
			"venue": this.venue,
			"description": this.description
		}
		this.firebaseService.addEvent(this.event);
		this.viewCtrl.dismiss();
		let alert = this.alertCtrl.create({
			title: 'Tapok Added',
			buttons: [ 'OK' ]
		});
		alert.present();
	}

	editTapok(){
		this.name = this.event.name;
		this.date = this.event.date;
		this.time = this.event.time;
		this.venue = this.event.venue;
		this.description = this.event.description;
	}
}
