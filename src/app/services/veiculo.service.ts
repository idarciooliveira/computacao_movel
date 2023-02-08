import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Veiculo } from '../models/veiculo.model';
import { Professor } from '../models/professor.model';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  private veiculoCollection = this.afs.collection<Veiculo>('veiculos');

  constructor(private afs: AngularFirestore) {}

  getVeiculos() {
    return this.veiculoCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          return { ...data };
        })
      )
    );
  }

  addVeiculo(veiculo: Veiculo) {
    return this.veiculoCollection.add(veiculo).then((docRef) => {
      veiculo.id = docRef.id;
      this.updateVeiculo(docRef.id, veiculo);
    });
  }

  updateVeiculo(id: string, veiculo: Veiculo) {
    return this.veiculoCollection.doc(id).update(veiculo);
  }

  deleteVeiculo(id: string) {
    return this.veiculoCollection.doc(id).delete();
  }

  getVeiculoByPlaca(placa: string) {
    return this.afs
      .collection<Veiculo>('veiculos', (ref) => ref.where('placa', '==', placa))
      .valueChanges();
  }

  filtrarVeiculoes(query: string): Observable<Veiculo[]> {
    return this.afs
      .collection<Veiculo>('veiculos', (ref) => ref.where('nome', '==', query))
      .valueChanges();
  }
}
