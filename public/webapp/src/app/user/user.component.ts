import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @ViewChild('profilePic') profilePic: ElementRef;
  imgSrc:string | ArrayBuffer ='http://localhost:4000/uploads/default.jpg';
  form: FormGroup;
  isLoading: boolean = false;
  userList = [];
  buttonActionName = 'Add User';

  constructor(
    public router: Router,
    private apiService: UserService,
    public fb: FormBuilder
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      profilePic: [null],
      id: [''],
    });
  }

  ngOnInit() {
    this.getListOfUser();
  }

  addUser() {
    const formData = new FormData();
    for (const key in this.form.value) {
      formData.append(key, this.form.value[key]);
    }
    this.isLoading = true;
    if (this.form.get('id').value !== '') {
      this.apiService.updateUser(this.form.get('id').value, formData).subscribe(
        (data) => {
          this.isLoading = false;
          this.form.reset();
          this.buttonActionName = 'Add User';
          this.profilePic.nativeElement.value = '';
          alert('User updated');
          this.getListOfUser();
        },
        (err) => {
          alert(err.error.message);
        }
      );
    } else {
      this.apiService.saveUser(formData).subscribe(
        (data) => {
          this.isLoading = false;
          this.form.reset();
          this.profilePic.nativeElement.value = '';
          alert('User Added');
          this.getListOfUser();
        },
        (err) => {
          alert(err.error.message);
        }
      );
    }
  }

  editUser(userData) {
    this.form.patchValue(userData);
    this.imgSrc='http://localhost:4000/'+userData.profilePic;
    this.buttonActionName = 'Update User';
  }

  getListOfUser() {
    this.apiService.getUserList().subscribe(
      (data) => {
        this.userList = data;
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  deleteUser(id) {
    this.isLoading = true;
    this.apiService.deleteUser(id).subscribe(
      (data) => {
        this.isLoading = false;
        alert('User deleted');
        this.getListOfUser();
      },
      (err) => {
        alert(err.error.message);
      }
    );
  }

  uploadFile(event) {
    const file = event.target.files[0] as File;
    this.form.get('profilePic').setValue(file);
    this.form.get('profilePic').updateValueAndValidity();

    const reader = new FileReader();
        reader.onload = e => this.imgSrc = reader.result;

        reader.readAsDataURL(file);
  }
}
