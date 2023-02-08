import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Professor } from '../models/professor.model';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private professorCollection = this.afs.collection<Professor>('professores');

  constructor(private afs: AngularFirestore) {}

  getProfessors() {
    return this.professorCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          return { ...data };
        })
      )
    );
  }

  addProfessor(professor: Professor) {
    return this.professorCollection.add(professor).then((docRef) => {
      professor.id = docRef.id;
      this.updateProfessor(docRef.id, professor);
    });
  }

  updateProfessor(id: string, professor: Professor) {
    return this.professorCollection.doc(id).update(professor);
  }

  deleteProfessor(id: string) {
    return this.professorCollection.doc(id).delete();
  }

  getProfessorByNbi(nbi: string) {
    return this.afs
      .collection<Professor>('professores', (ref) =>
        ref.where('nbi', '==', nbi)
      )
      .valueChanges();
  }

  filtrarProfessores(query: string): Observable<Professor[]> {
    return this.afs
      .collection<Professor>('professores', (ref) =>
        ref.where('nome', '==', query)
      )
      .valueChanges();
  }
}
