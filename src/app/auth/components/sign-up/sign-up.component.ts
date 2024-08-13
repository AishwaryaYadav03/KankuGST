import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from './ConfirmPasswordValidator'
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthService,
    private toast: ToastrService,
    private router: Router
  ) { }

  form: FormGroup = new FormGroup({
    fullName: new FormControl(''),
    userContact: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  })

  user = {
    fullName: '',
    userContact: '',
    email: '',
    password: '',
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fullName: ["", [Validators.required]],
      userContact: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      confirmPassword: ['', Validators.required],
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      }
    )
  }

  register() {
    this.user = this.form.value;
    this.service.registerUser(this.user).subscribe(res => {
      if (res !== null) {
        this.toast.success("User register successfully", "Suucess");
        this.router.navigate(['/'])
      }
    }, err => {
      this.toast.error("Registration failed!!", "Failed");
    })
  }

}
