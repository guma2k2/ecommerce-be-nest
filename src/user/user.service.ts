import { Injectable } from "@nestjs/common";
import { User } from "generated/prisma/browser";
import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async create(user: Omit<User, "id">): Promise<User> {
        return this.prismaService.user.create({
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                is_active: true,
                password: user.password,
            },
        });
    }

    async getById(id: string): Promise<User | null> {
        return this.prismaService.user.findFirst({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prismaService.user.findFirst({ where: { email } });
    }

    async findAll(): Promise<User[]> {
        return this.prismaService.user.findMany();
    }
}
