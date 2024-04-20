import { Component,OnInit} from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{
  mailUsuario: string = '';
  passwordUsuario: string = '';
  usuarioId: string = '';

  constructor(private storage: Storage) {}
  
  async ngOnInit() {
    await this.initStorage();
    await this.storage.clear();//borro el local storage despues de cada refresh(opcinal)
  }

  async initStorage() {
    await this.storage.create();
  }

  generarIdUnico(): string {
    return uuidv4();
  }

  async guardarCredenciales() {
    this.usuarioId = this.generarIdUnico(); 
    try {
      await this.storage.set(`email_${this.usuarioId}`, this.mailUsuario);
      await this.storage.set(`password_${this.usuarioId}`, this.passwordUsuario);
      console.log('Credenciales guardadas con éxito para el usuario con ID:', this.usuarioId);
    } catch (error) {
      console.error('Error al guardar las credenciales para el usuario con ID:', this.usuarioId, error);
    }
  }

  async getAllData() {
    const keys = await this.storage.keys();
    
    const allData: { [key: string]: any } = {}; 

    for (const key of keys) {
      const value = await this.storage.get(key);
      allData[key] = value;
    }
  
    return allData;
  }

  async verificarCredenciales() {
    try {
      const allData = await this.getAllData();
           
      for (const key in allData) {
        if (key.startsWith('email_')) {
          const storedMail = allData[key];
          const storedPassword = allData[`password_${key.substr(6)}`];
          
          
          if (storedMail === this.mailUsuario && storedPassword === this.passwordUsuario) {
            console.log('Credenciales válidas para el usuario con correo:', this,this.mailUsuario);
            alert(`Hola, ${this.mailUsuario}`);
            return true; 
          }
        }
      }
      
      alert("Credenciales Invalidas");
      console.log('Credenciales inválidas');
      return false;
    } catch (error) {
      console.error('Error al verificar las credenciales:', error);
      return false;
    }
  }

  mostrarPasswordMail() {
    console.log('Mail:', this.mailUsuario);
    console.log('Contraseña:', this.passwordUsuario);
  }

  async mostrarTodoLocalStorage() {
    const allData = await this.getAllData();
    console.log(allData);
  }
}