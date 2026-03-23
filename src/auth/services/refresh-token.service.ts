// import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { RefreshTokenDto } from "src/auth/dto/refresh-token-dto";

// @Injectable()
// export class RefreshTokenService {
//     constructor(private readonly refreshTokenRepository: Repository<RefreshToken>) {}

//     //  Insert

//     async save(refreshTokenDto: RefreshTokenDto) {
//         const refreshToken = new RefreshToken();
//         refreshToken.id = refreshTokenDto.refreshToken;
//         return this.refreshTokenRepository.save(refreshToken);
//     }

//     //  Delete
//     async delete(refreshTokenDto: RefreshTokenDto) {
//         return this.refreshTokenRepository.delete({ id: refreshTokenDto.refreshToken });
//     }

//     async getById(refreshTokenDto: RefreshTokenDto) {
//         return this.refreshTokenRepository.findOneOrFail({
//             where: { id: refreshTokenDto.refreshToken },
//         });
//     }

//     async validate(userId: string, tokenId: string): Promise<boolean> {
//         try {
//             const existedRefreshToken = await this.getByUserId(userId);
//             if (existedRefreshToken?.id !== tokenId) {
//                 throw new UnauthorizedException("Refresh token is not valid");
//             }

//             return existedRefreshToken.id === tokenId;
//         } catch (error) {
//             return false;
//         }
//     }

//     async getByUserId(userId: string) {
//         return (
//             this.refreshTokenRepository.findOne({
//                 where: { user: { id: userId } },
//             }) ?? null
//         );
//     }
// }
