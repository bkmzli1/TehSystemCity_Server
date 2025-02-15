import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {AppComponent} from '../app.component';
import {delay} from 'rxjs/operators';

class User {
  id: string;
  name: string;
  img: string;
  email: string;
  telephone: string;
  lastName = ' ';
  firstName = ' ';
  middleName = ' ';
}


class Img {
  img: string;
  name: string;
}

class Massages {
  user: User;
  imgs: Img[];
  text = ' ';

}

class Orders {
  name: string;
  done: boolean;
  doneCrate: boolean;
  executed: string;
  creationDate: string;
  creator: User = new User();
  executor: User[] = [];
  text = ' ';
  imgs: Img[] = [];
  id = ' ';
  massages: Massages[] = [];
  crate: string;
  deletes;
  adopted = false;
  rejected = false;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  id: string;
  orders: Orders = new Orders();
  massages: Massages[];
  massage: Massages = new Massages();
  private fileToUpload: FormData;
  uploader;

  constructor(private route: ActivatedRoute, public app: AppService, private http: HttpClient, private router: Router, public appc: AppComponent) {
    this.appc.cont = true;
    this.route.params.subscribe((params: any) => this.id = params.id);
    this.uploader = false;
    this.uploadMessage();

  }


  uploadMessage(): any {

    if (this.uploader == null) {

      return;
    }
    if (!this.uploader) {

      this.http.get(this.app.serverURL + 'task/get/' + this.id).subscribe((next: any) => {
        this.orders = next;
        this.uploader = true;
        this.http.post(this.app.serverURL + 'task/get/' + this.id, true).subscribe((next2: Orders) => {
          console.log(next2);
          this.orders.massages = next2.massages;
          this.orders.done = next2.done;
          this.orders.deletes = next2.deletes;
          this.orders.adopted = next2.adopted;
          this.orders.rejected = next2.rejected;
          this.uploadMessage();
        }, error => this.uploadMessage());
        this.uploadMessage();
      }, error => this.uploadMessage());

    } else {
      this.http.post(this.app.serverURL + 'task/get/' + this.id, true).subscribe((next: Orders) => {
        console.log(next);
        this.orders.massages = next.massages;
        this.orders.done = next.done;
        this.orders.deletes = next.deletes;
        this.orders.adopted = next.adopted;
        this.orders.rejected = next.rejected;
        this.uploadMessage();
      }, error => this.uploadMessage());

    }
  }

  ngOnInit(): void {
    let inputs = document.querySelectorAll('.input__file');
    Array.prototype.forEach.call(inputs, function(input) {
      let label = input.nextElementSibling,
        labelVal = label.querySelector('.input__file-button-text').innerText;

      input.addEventListener('change', function(e) {
        let countFiles = '';
        if (this.files && this.files.length >= 1) {
          countFiles = this.files.length;
        }

        if (countFiles) {
          label.querySelector('.input__file-button-text').innerText = 'Выбрано файлов: ' + countFiles;
        } else {
          label.querySelector('.input__file-button-text').innerText = labelVal;
        }
      });
    });
  }

  ngOnDestroy() {
    this.uploader = null;
  }


  href(s: string) {

  }

  web_send_msg() {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');

    this.http.post(this.app.serverURL + 'img/' + 'TASK_MS', this.fileToUpload, {headers}).subscribe(
      (next2: string[]) => {
        this.http.post(this.app.serverURL + 'massage', {
          text: this.massage.text,
          imgs: next2,
          id: this.orders.id
        }).subscribe(
          (next: Orders) => {

            this.orders = next;
          }
        );

      },
      error2 => console.log(error2)
    );


  }

  handleFileInput(fileList: FileList) {

    const uploadData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      uploadData.append('mfImg', fileList[i], fileList.item(i).name);
    }
    this.fileToUpload = uploadData;

  }

  isUserEx() {
    let isEx = false;
    let item;
    for (item of this.orders.executor) {

      isEx = (this.app.login.id == item.id);
      if (isEx == true) {
        break;
      }
    }
    return isEx || this.app.isRoot();
  }

  isUserCre() {

    return (this.app.login.id === this.orders.creator.id) || this.app.isRoot();
  }

  exComplete() {
    this.http.get(this.app.serverURL + 'task/bin/' + this.orders.id).subscribe((next: any) => {
      this.orders = next;
    });
  }

  creComplete(b: number) {

    this.http.post(this.app.serverURL + 'task/binCrate/' + this.orders.id, b).subscribe((next: any) => {
      this.orders = next;
    });
  }

  begin() {
    if (this.orders.doneCrate === true) {
      return '(подтверждённое)';
    } else {
      return '(не подтверждённое)';
    }
  }

  del() {
    this.http.delete(this.app.serverURL + 'task/delete/' + this.orders.id).subscribe((next: any) => {
      this.orders = next;
      this.router.navigateByUrl('/ordersCreate');
    });
  }

  ims() {
    return this.orders.imgs != undefined;
  }

  adopted(b: any) {
    if (b) {
      b = 1;
    } else {
      b = 0;
    }
    this.http.put(this.app.serverURL + 'task/adopted/' + this.orders.id, b).subscribe((next: any) => {
      this.orders = next;
    });
  }

  con(b: any) {

  }

  texstDone() {
    if (this.orders.rejected == true) {
      return 'В процессе';
    } else if (this.orders.done == true) {
      return 'Статус: Выполнено' + this.orders.executed;
    } else if (this.orders.done == false) {
      return 'Статус: Не выполнено';
    }

    return 'eroor';
  }
}
