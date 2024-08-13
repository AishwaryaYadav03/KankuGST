import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  constructor(
    private service: AuthService,
    private router: Router,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private toast: ToastrService
  ) { }

  loginobj:any={
    username:'',
    password:''
  }




  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    })
  }


  login() {
    this.service.login(this.form.value).subscribe(res => {
      if (res !== null) {
        this.storage.saveToken(res.jwtToken);
        this.service.getCurrentUser().subscribe({
          next: (user) => {
            this.storage.saveUser(user);
            if ( this.storage.getToken() !== null && this.storage.getUserRole() == "ADMIN") {
              this.router.navigate(['/admin-dashboard']);
            }
            else {
              this.toast.warning("Username or Password is incorrect", "Invalid Credentials");
            }
          }
        });
      }
    }, err => {
      this.toast.warning("Username or Password is incorrect", "Invalid Credentials");
    })
  }


  // login() {
  //   debugger
  //   this.service.login(this.loginobj).subscribe(res => {
  //     debugger
  //     console.log('res',res);
  //     localStorage.setItem('token',res.token)
  //     this.router.navigateByUrl('/admin-dashboard')
      
      
  //   })
  // }


}
