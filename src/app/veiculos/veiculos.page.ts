import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Veiculo } from '../models/veiculo.model';
import { VeiculoService } from '../services/veiculo.service';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.page.html',
  styleUrls: ['./veiculos.page.scss'],
})
export class VeiculosPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  selectedVeiculo: Veiculo | null;
  isModalOpen = false;

  veiculos: Veiculo[];
  textoPesquisa: string;

  validation_messages = {};

  constructor(
    private formBuilder: FormBuilder,
    private veiculoService: VeiculoService,
    public alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.carregarVeiculos();

    this.validations_form = this.formBuilder.group({
      marca: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      modelo: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      cor: new FormControl(
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ),
      ano: new FormControl(''),
      placa: new FormControl(
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

  carregarVeiculos() {
    this.veiculoService.getVeiculos().subscribe((veiculos: Veiculo[]) => {
      this.veiculos = veiculos;
    });
  }

  filtrarVeiculos(event: any) {
    this.textoPesquisa = event.target.value;
    if (this.textoPesquisa && this.textoPesquisa.trim() !== '') {
      this.veiculos = this.veiculos.filter((veiculo) => {
        return (
          veiculo.placa
            .toLowerCase()
            .indexOf(this.textoPesquisa.toLowerCase()) > -1
        );
      });
    } else {
      this.carregarVeiculos();
    }
  }

  onSubmit(veiculo: Veiculo) {
    try {
      if (!this.selectedVeiculo) {
        this.veiculoService.addVeiculo(veiculo);
        this.validations_form.reset();
        this.presentToast('Cadastrado com sucesso!');
      } else {
        this.veiculoService
          .updateVeiculo(this.selectedVeiculo.id, veiculo)
          .then(() => {
            this.validations_form.reset();
            this.selectedVeiculo = null;
            this.isModalOpen = false;
            this.presentToast('Atualizado com sucesso!');
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async excluirVeiculo(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja excluir este veiculo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.veiculoService.deleteVeiculo(id);
          },
        },
      ],
    });

    await alert.present();
  }

  edit(veiculo: Veiculo) {
    this.selectedVeiculo = veiculo;
    this.validations_form.setValue({
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      marca: veiculo.marca,
      cor: veiculo.cor,
    });
    this.setOpen(true);
  }

  //Chama Modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
