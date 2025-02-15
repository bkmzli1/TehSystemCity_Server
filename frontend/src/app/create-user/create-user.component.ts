import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AppComponent} from '../app.component';
import {FormBuilder, ReactiveFormsModule, FormsModule, NgControl, FormGroup} from '@angular/forms';

class User {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  admin = false;
  executor = false;
  telephone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  nameError = false;
  passwordError = false;
  cPasswordError = false;

}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  user: User = new User();
  error = '';
  successful: string[] = [];
  name: any;

  form: FormGroup;

  constructor(private app: AppService, private http: HttpClient, private router: Router, private cookieService: CookieService, public appc: AppComponent, fb: FormBuilder) {
    this.form = fb.group({
      phone: ['']
    });
    this.appc.cont = true;
  }

  ngOnInit(): void {

  }


  crate() {
    this.successful = [];
    this.error = '';
    const UserRegisterBindingModel = {

      username: this.user.username,
      password: this.user.password,
      confirmPassword: this.user.confirmPassword,
      email: this.user.email,
      admin: this.user.admin,
      executor: this.user.executor,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      middleName: this.user.middleName,
      nameError: this.user.nameError,
      passwordError: this.user.passwordError,
      cPasswordError: this.user.cPasswordError,
      telephone: this.user.telephone,
    };

    this.http.post(this.app.serverURL + 'reg', UserRegisterBindingModel).subscribe((next: any) => {

      this.error = next.error;
      if (next.error == null) {
        this.successful = ['Пользователь создан'];
      }

    });
  }
}
