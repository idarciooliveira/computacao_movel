import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Professor } from '../models/professor.model';
import { ProfessorService } from '../services/professor.service';


@Component({
  selector: 'app-professores',
  templateUrl: './professores.page.html',
  styleUrls: ['./professores.page.scss'],
})
export class ProfessoresPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  selectedProfessor: Professor | null;
  isModalOpen = false;

  professores: Professor[];
  textoPesquisa: string;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private professorService: ProfessorService,
    public alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.carregarProfessores();

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
      position: 'bottom'
    });

    await toast.present();
  }

  carregarProfessores() {
    this.professorService
      .getProfessors()
      .subscribe((professores: Professor[]) => {
        this.professores = professores;
      });
  }

  filtrarProfessores(event: any) {
    this.textoPesquisa = event.target.value;
    if (this.textoPesquisa && this.textoPesquisa.trim() !== '') {
      this.professores = this.professores.filter((professor) => {
        return (
          professor.nome
            .toLowerCase()
            .indexOf(this.textoPesquisa.toLowerCase()) > -1
        );
      });
    } else {
      this.carregarProfessores();
    }
  }

  onSubmit(professor: Professor) {
    try {
      if (!this.selectedProfessor) {
        this.professorService.addProfessor(professor);
        this.validations_form.reset();
        this.presentToast('Professor adicionado com sucesso!')
      } else {
        this.professorService
          .updateProfessor(this.selectedProfessor.id, professor)
          .then(() => {
            this.validations_form.reset();
            this.selectedProfessor = null;
            this.isModalOpen = false;
            this.presentToast('Professor atualizado com sucesso!')
          });
      }
    } catch (error) {
      console.log('Ouve um erro!');
    }
  }

  async excluirProfessor(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja excluir este professor?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.professorService.deleteProfessor(id);
          },
        },
      ],
    });

    await alert.present();
  }

  edit(professor: Professor) {
    this.selectedProfessor = professor;
    this.validations_form.setValue({
      nome: professor.nome,
      email: professor.email,
      telefone: professor.telefone,
      morada: professor.morada,
      dataDeNascimento: professor.dataDeNascimento,
      nbi: professor.nbi,
    });
    this.setOpen(true);
  }

  //Chama Modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
