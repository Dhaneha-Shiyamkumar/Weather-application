import { Component } from '@angular/core';
import{webSocket} from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Weather-App';
  message='FeedBack';
  subject= webSocket('ws://localhost:8889/');

sendToServer($event){
this.subject.subscribe();
this.subject.next(this.message);
this.subject.complete();
}


}

