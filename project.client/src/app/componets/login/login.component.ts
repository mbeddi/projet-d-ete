import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  type: string = "password";
  eyeIcon: string = "fa-eye-slash";

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.type = this.type === "password" ? "text" : "password";
    this.eyeIcon = this.eyeIcon === "fa-eye-slash" ? "fa-eye" : "fa-eye-slash";
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.authService.getUserRole().subscribe(role => {
            this.redirectBasedOnRole(role);
          });
        },
        error: () => {
          alert("Invalid credentials");
        }
      });
    } else {
      ValidateForm.validateAllFormFileds(this.loginForm);
      alert("Your form is invalid");
    }
  }

  redirectBasedOnRole(role: string) {
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'Teacher') {
      this.router.navigate(['/teacher']);
    } else if (role === 'Student') {
      this.router.navigate(['/home']);
    } else if (role === 'Service') {
      this.router.navigate(['/service']);
    }
  }
}
