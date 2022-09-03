import { BaseEntity } from "../base.entity";

export class CarEntity extends BaseEntity {

  card: number;

  price: number;

  year: number;

  categoryId: string;

  description: string;

  marka: string;

  tonirovka: string;

  motor: string;

  color: string;

  distance: string;

  gearbok: string;

  isBrone?: boolean;

  broneDate?: Date;

  isAvailable?: boolean;

}