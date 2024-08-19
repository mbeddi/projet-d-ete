// src/app/signup/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  type: string = "password";
  eyeIcon: string = "fa-eye-slash";

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      cv: [''] // Optionnel sauf si le rôle est Teacher
    });
  }

  hideShowPass() {
    this.type = this.type === "password" ? "text" : "password";
    this.eyeIcon = this.eyeIcon === "fa-eye-slash" ? "fa-eye" : "fa-eye-slash";
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.handleSignup();
    } else {
      ValidateForm.validateAllFormFileds(this.signUpForm);
      alert("Your form is invalid");
    }
  }

  handleSignup() {
    const signupData = this.signUpForm.value;
    // Envoyez signupData à votre API backend pour créer un nouvel utilisateur
    this.authService.signup(signupData).subscribe({
      next: () => {
        alert("Signup successful");
        // Redirection ou autre action après inscription réussie
      },
      error: () => {
        alert("Signup failed");
      }
    });
  }
}
