import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
 
@Injectable()
export class ContactProvider {

  public PATH = 'anuncios/'

  constructor(public http: HttpClient, public db: AngularFireDatabase) {
    console.log('Hello ContactProvider Provider');
  }

  getAll() {
    return this.db.list(this.PATH).valueChanges(); 
  }

  getAllKey() {
    return this.db.list(this.PATH, ref => ref.orderByChild('name'))
    .snapshotChanges()
    .map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    })
  }

  getAllKeyUser(anuncianteID) {
    try{
    return this.db.list(this.PATH, ref => ref.orderByChild('anuncianteID').equalTo(anuncianteID))
    .snapshotChanges()
    .map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    })
    }catch{
      return this.db.list(this.PATH).valueChanges(); 
    }
  }

  get(key: string) {
    return this.db.object(this.PATH + key).valueChanges();
  }

  save(contact: any) {
    return new Promise((resolve, reject) => {
      if (contact.key) {
        this.db.list(this.PATH)
          .update(contact.key, { 
            name: contact.name, 
            tel: contact.tel, 
            latitude: contact.latitude,
            longitude: contact.longitude,
            categoria: contact.categoria,
            descricao: contact.descricao,
            anuncianteID: contact.anuncianteID })
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ 
            name: contact.name, 
            tel: contact.tel, 
            latitude: contact.latitude,
            longitude: contact.longitude,
            categoria: contact.categoria,
            descricao: contact.descricao,
            anuncianteID: contact.anuncianteID })
          .then(() => resolve());
      }
    })
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }

}
