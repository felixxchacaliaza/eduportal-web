import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AreaService, SubjectService } from './core/api';



@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('eduportal-web');

/*   private readonly areaService = inject(AreaService);
  private readonly subjectService = inject(SubjectService); */

}

export class HeroeSimple {
  // Propiedades básicas (datos que tiene el héroe):
  alias: string = "xxx";
  puntosDeVida: number;

  // El constructor se ejecuta automáticamente cuando nace el héroe con 'new':
  constructor(alias: string, puntosDeVida: number) {
    this.alias = alias;
    this.puntosDeVida = puntosDeVida;
  }

  // Método (acción que puede realizar):
  private saludar(): string {
    return `¡Hola! Soy ${this.alias} y tengo ${this.puntosDeVida} puntos de vida.`;
  }
  public mostrarSaludo(): void {
    console.log(this.saludar());
  }
}

export class HeroeSeguro extends HeroeSimple {

    constructor(alias: string, puntosDeVida: number) {
        super(alias, puntosDeVida);
        this.mostrarSaludo();
    }


}

export class HeroeInmutable {
  // 'readonly': Una vez que se le asigna un valor, ¡NUNCA MÁS se puede cambiar!
  public readonly universo: string = 'Tierra-616';

  constructor(
    public readonly idHeroe: string,    // Solo se asigna al nacer
    public alias: string,                  // Este sí puede cambiar con el tiempo
  ) {}
}

const flash = new HeroeInmutable('HERO-001', 'Flash');
flash.alias = 'Flash Reborn'; // Esto es válido, ya que 'alias' no es readonly

export interface HeroeContrato {
  alias: string;
  presentarse(): string;
}

export interface ApiResponse<T> {
  response: T;
  readonly codeError: string;
  readonly messageError: string;
}



export abstract class PersonajeBase implements HeroeContrato {
  public readonly universo: string = 'Tierra-616';

  constructor(
    public readonly alias: string,
    protected cuartelSecreto: string,
    private _identidadReal: string,
    public puntosDeVida: number = 100
  ) {}

  // Método Concreto: Lógica compartida que TODOS los héroes heredan gratis:
  public curarse(puntos: number): void {
    this.puntosDeVida += puntos;
  }

  public presentarse(): string {
    return `¡Soy ${this.alias} del universo ${this.universo}!`;
  }

  // Método Abstracto: ¡Obligación pura! Cada héroe ataca de manera diferente:
  public abstract atacar(): string;
}


