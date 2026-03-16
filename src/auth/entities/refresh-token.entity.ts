import { BaseEntity, Column, Entity } from "typeorm";

@Entity()
export class RefreshToken extends BaseEntity {
  @Column()
  token: string;

  @Column()
  expires_at: Date;
}
