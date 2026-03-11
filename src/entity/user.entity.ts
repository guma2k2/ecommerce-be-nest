import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  firstName: string;

  @Column({ length: 255, nullable: true })
  lastName: string;
}
