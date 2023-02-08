// login.page.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from '../models/user.model';
import { AuthenticateService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form!: FormGroup;
  errorMessage: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
  }

  validation_messages = {
    email: [
      { type: 'required', message: 'Não digitou seu e-mail.' },
      { type: 'pattern', message: 'e-mail inválido.' },
    ],
    password: [
      { type: 'required', message: 'Não digitou sua senha.' },
      {
        type: 'minlength',
        message: 'Password must be at least 5 characters long.',
      },
    ],
  };

  loginUser(value: User) {
    this.authService.loginUser(value).then(
      (res) => {
        this.errorMessage = '';
        this.navCtrl.navigateForward('/dashboard');
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }

}
