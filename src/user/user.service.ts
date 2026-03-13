import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  async getById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
