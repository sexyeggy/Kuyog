import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController } from 'ionic-angular';
import { FireBaseService } from '../../providers/firebase-service';
//import { FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
	selector: 'add-tapok',
	templateUrl: 'add-tapok.html'
})
export class AddTapok {

	event;
	name = '';
	date = '';
	time = '';
	venue = '';
	description = '';

	constructor(public viewCtrl: ViewController, public alertCtrl: AlertController, 
		public firebaseService: FireBaseService) {
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
}