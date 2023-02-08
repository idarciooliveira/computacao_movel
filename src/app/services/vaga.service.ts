import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as QRCode from 'qrcode';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Vaga } from '../models/vaga.model';

@Injectable({
  providedIn: 'root',
})
export class VagaService {
  private vagaCollection = this.afs.collection<Vaga>('vagas');

  constructor(private afs: AngularFirestore) { }

  generateQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }

  getVagas(): Observable<Vaga[]> {
    return this.vagaCollection.snapshotChanges().pipe(
      mergeMap((actions) => {
        const requests = actions.map((a) => {
          console.log(a)
          const data = a.payload.doc.data();
          console.log(data)
          return this.generateQRCode(data.id).then((qrCode) => {
            return { ...data, qrCode };
          });
        });
        return from(Promise.all(requests));
      })
    );
  }

  addVaga(vaga: Vaga) {
    return this.vagaCollection.add(vaga).then((docRef) => {
      vaga.id = docRef.id;
      this.updateVaga(docRef.id, vaga);
    });
  }

  updateVaga(id: string, vaga: Vaga) {
    return this.vagaCollection.doc(id).update(vaga);
  }

  deleteVaga(id: string) {
    return this.vagaCollection.doc(id).delete();
  }

  filtrarVagas(query: string): Observable<Vaga[]> {
    return this.afs
      .collection<Vaga>('vagas', (ref) => ref.where('nome', '==', query))
      .valueChanges();
  }
}
