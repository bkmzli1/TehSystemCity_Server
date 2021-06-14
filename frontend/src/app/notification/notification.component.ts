import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notif = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public app: AppService, public appc: AppComponent) {
    this.http.get(this.app.serverURL + 'isemilactive/').subscribe((next: boolean) => {
      this.notif = next;
      console.log(next);
      if (next == null) {
        this.notif = true;
      }
    }, error => {
      this.notif = true;
      console.log(this.notif);
    });
  }

  ngOnInit(): void {
  }

  enableEmail() {
    this.http.get(this.app.serverURL + 'emilactive/').subscribe((next) => {

    });
  }
}
