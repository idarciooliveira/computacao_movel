import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private professorCollection = this.afs.collection<Usuario>('usuarios');

  constructor(private afs: AngularFirestore) { }

  getUsuarios() {
    return this.professorCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          return { ...data };
        })
      )
    );
  }

  addUsuario(usuario: Usuario) {
    return this.professorCollection.add(usuario).then((docRef) => {
      usuario.id = docRef.id
      this.updateUsuario(docRef.id, usuario);
    });
  }

  updateUsuario(id: string, usuario: Usuario) {
    return this.professorCollection.doc(id).update(usuario);
  }

  deleteUsuario(id: string) {
    return this.professorCollection.doc(id).delete();
  }

  filtrarUsuarioes(query: string): Observable<Usuario[]> {
    return this.afs
      .collection<Usuario>('usuarios', (ref) =>
        ref.where('nome', '==', query)
      )
      .valueChanges();
  }
}
