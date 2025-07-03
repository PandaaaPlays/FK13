import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getEvents(): Observable<any[]> {
    const eventsRef = collection(this.firestore, 'events') as CollectionReference<DocumentData>;
    console.log('Type of collection:', typeof collection(this.firestore, 'events'));
    return collectionData(eventsRef, { idField: 'id' }) as Observable<any[]>;
  }

  addItem(item: any) {
    const itemsRef = collection(this.firestore, 'items');
    return addDoc(itemsRef, item);
  }
}
