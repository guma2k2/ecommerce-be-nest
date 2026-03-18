import { BaseEntity } from "src/common/base.entity";
import { User } from "src/user/user.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class RefreshToken extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
