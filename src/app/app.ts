import { Component, signal, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {

  tiempoActual: number = 0;
  estaCorriendo: boolean = false;
  mensajeFinal: string  = '';

  private suscripcion?: Subscription;

  constructor(private cdr: ChangeDetectorRef){}

  private miCronometro$ = new Observable<number>(subcriptor => {
    console.log('!Suscripcion iniciada! El Observable Frio de despierta.');

    let contador = 0;

    const intervaloId = setInterval(() => {
      contador++;
      subcriptor.next(contador);
    }, 1000);

    return () => {
      console.log('Limpiando el intervalo... Suscripcion cerrada.');
      clearInterval(intervaloId);
    };
  });

  empezar(){
    if(this.estaCorriendo) return;

    this.estaCorriendo = true;
    this.mensajeFinal = '';

    this.suscripcion = this.miCronometro$.subscribe({
      next: (valor) =>{
        this.tiempoActual = valor;
        this.cdr.detectChanges();
      }
    });
  }

  reiniciar(){
    if(this.suscripcion){
      this.suscripcion.unsubscribe();
    }
    this.estaCorriendo = false;
    this.tiempoActual = 0;
    this.mensajeFinal = '';
  }

  entregar(){
    if(this.suscripcion){
      this.suscripcion.unsubscribe();
    }
    this.estaCorriendo = false;
    this.mensajeFinal = 'Entrega de cronometro desplegado';
  }

  ngOnDestroy(){
    if(this.suscripcion){
      this.suscripcion.unsubscribe();
    }
  }
}