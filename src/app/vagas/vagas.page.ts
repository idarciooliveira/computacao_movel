import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import * as QRCode from 'qrcode';
import { Vaga } from '../models/vaga.model';
import { ProfessorService } from '../services/professor.service';
import { VagaService } from '../services/vaga.service';
import { VeiculoService } from '../services/veiculo.service';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.page.html',
  styleUrls: ['./vagas.page.scss'],
})
export class VagasPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  selectedVaga: Vaga | null;
  isModalOpen = false;
  idProfessor: string;
  idVeiculo: string;

  qrCodeData: any;

  vagas: Vaga[];
  textoPesquisa: string;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private vagaService: VagaService,
    public alertController: AlertController,
    private toastController: ToastController,
    private professorService: ProfessorService,
    private veiculoService: VeiculoService
  ) { }

  ngOnInit() {
    this.carregarVagas();

    this.vagaService.generateQRCode('Dados a serem codificados no QR Code').then(
      (result) => (this.qrCodeData = result)
    );

    this.validations_form = this.formBuilder.group({
      numeroVaga: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      nbi: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      placa: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      periodo: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
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

  carregarVagas() {
    this.vagaService.getVagas().subscribe((vagas: Vaga[]) => {
      this.vagas = vagas;
    });
  }


  filtrarVagas(event: any) {
    this.textoPesquisa = event.target.value;
    if (this.textoPesquisa && this.textoPesquisa.trim() !== '') {
      this.vagas = this.vagas.filter((vaga) => {
        return (
          vaga.idProfessor
            .toLowerCase()
            .indexOf(this.textoPesquisa.toLowerCase()) > -1
        );
      });
    } else {
      this.carregarVagas();
    }
  }

  searchByNbi(nbi: string) {
    this.professorService.getProfessorByNbi(nbi).subscribe((professor) => {
      if (professor.length > 0) {
        this.idProfessor = professor[0].id;
        this.presentToast('Professor encontrado!');
      } else {
        this.presentToast('Professor não encontrado!');
      }
    });
  }

  searchByPlaca(placa: string) {
    this.veiculoService.getVeiculoByPlaca(placa).subscribe((veiculo) => {
      if (veiculo.length > 0) {
        this.idVeiculo = veiculo[0].id;
        this.presentToast('Veículo encontrado!');
      } else {
        this.presentToast('Veículo não encontrado!');
      }
    });
  }

  async generateQRCode(data: string) {
    return QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
    }).then((url) => {
      return url;
    });
  }

  onSubmit(vaga: Vaga) {
    try {
      if (!this.selectedVaga) {
        this.vagaService.addVaga({
          ...vaga,
          idProfessor: this.idProfessor,
          idVeiculo: this.idVeiculo,
        });
        this.validations_form.reset();
        this.presentToast('Adicionado com sucesso!');
      } else {
        this.vagaService.updateVaga(this.selectedVaga.id, vaga).then(() => {
          this.validations_form.reset();
          this.selectedVaga = null;
          this.isModalOpen = false;
          this.presentToast('Atualizado com sucesso!');
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async excluirVaga(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja excluir este vaga?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.vagaService.deleteVaga(id);
          },
        },
      ],
    });

    await alert.present();
  }

  edit(vaga: Vaga) {
    this.selectedVaga = vaga;
    this.validations_form.setValue({
      numeroVaga: vaga.numeroVaga,
      periodo: vaga.periodo,
    });
    this.setOpen(true);
  }

  //Chama Modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
