import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Usuario } from '../models/user.model';
import { AuthenticateService } from '../services/authentication.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  selectedUsuario: Usuario | null;
  isModalOpen = false;

  usuarios: Usuario[];
  textoPesquisa: string;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private professorService: UsuarioService,
    private authService: AuthenticateService,
    public alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.carregarUsuarios();

    this.validations_form = this.formBuilder.group({
      nome: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      morada: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      telefone: new FormControl(
        '',
        Validators.compose([Validators.minLength(9), Validators.required])
      ),
      nbi: new FormControl(
        '',
        Validators.compose([Validators.minLength(14), Validators.required])
      ),
      dataDeNascimento: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  carregarUsuarios() {
    this.professorService.getUsuarios().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
    });
  }

  filtrarUsuarios(event: any) {
    this.textoPesquisa = event.target.value;
    if (this.textoPesquisa && this.textoPesquisa.trim() !== '') {
      this.usuarios = this.usuarios.filter((usuario) => {
        return (
          usuario.nome.toLowerCase().indexOf(this.textoPesquisa.toLowerCase()) >
          -1
        );
      });
    } else {
      this.carregarUsuarios();
    }
  }

  onSubmit(usuario: Usuario) {
    try {
      if (!this.selectedUsuario) {
        this.professorService.addUsuario(usuario).then(() => {
          this.validations_form.reset();
          this.presentToast('Utilizador Cadastrado!');
          this.authService.registerUser(usuario);
        });
      } else {
        this.professorService
          .updateUsuario(this.selectedUsuario.id, usuario)
          .then(() => {
            this.validations_form.reset();
            this.selectedUsuario = null;
            this.isModalOpen = false;
            this.presentToast('Utilizador Actualizado!');
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async excluirUsuario(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja excluir este utilizador?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.professorService.deleteUsuario(id);
          },
        },
      ],
    });

    await alert.present();
  }

  edit(usuario: Usuario) {
    this.selectedUsuario = usuario;
    this.validations_form.setValue({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      morada: usuario.morada,
      dataDeNascimento: usuario.dataDeNascimento,
      nbi: usuario.nbi,
    });
    this.setOpen(true);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
