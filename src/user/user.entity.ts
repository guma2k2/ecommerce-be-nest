import { BaseEntity } from "src/common/base.entity";
import { UserRole } from "src/common/enums/user.enum";
import { Column, Entity } from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  is_active: boolean;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
