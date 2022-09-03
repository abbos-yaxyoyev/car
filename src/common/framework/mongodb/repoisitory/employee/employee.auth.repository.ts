import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { EmployeeException } from '../../../../constant/exceptions';
import { EmployeeEntity } from '../../../../core/entities';
import { DatabaseService } from '../../base.repository';
import { Employee, EmployeeDocument } from './../../model/employee/employee.model';
import { IEmployeeAuthRepository, ILogin, Tokens } from './interface';

export class EmployeeAuthRepository extends DatabaseService<EmployeeDocument> implements IEmployeeAuthRepository<EmployeeEntity>{

  constructor(
    @InjectModel(Employee.name)
    private readonly model: Model<EmployeeDocument>,
    private jwtService: JwtService
  ) {
    super(model);
  }


  public async createEmployee(data: EmployeeEntity): Promise<EmployeeEntity> {

    data.password = await this.generateArgonHash(data.password)

    const result = await this.create<EmployeeEntity>(data);

    return result;

  }

  public async login(password: string, phoneNumber: string): Promise<ILogin> {

    password = await this.generateArgonHash(password)

    const employee = await this.findOne({ isDeleted: false, phoneNumber, password });

    if (!employee) throw EmployeeException.NotFound(phoneNumber);

    const tokens: Tokens = await this.generateTokens(employee._id, employee.phoneNumber);

    await this.updateById(employee._id, { refreshToken: tokens.refreshToken });

    return {
      tokens,
      employee: {
        _id: employee._id,
        fullName: employee.fullName,
        phoneNumber: employee.phoneNumber,
        biography: employee.biography,
        birthday: employee.birthday,
        createdAt: employee.createdAt
      }
    };

  }

  public async refreshToken(id: string, refreshToken: string): Promise<Tokens> {

    const employee = await this.findById(id);

    if (!employee || !employee.refreshToken) throw new Error('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      employee.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new Error('Access Denied');

    const tokens: Tokens = await this.generateTokens(employee._id, employee.phoneNumber);

    await this.updateById(id, { refreshToken: tokens.refreshToken });

    return tokens;

  }

  public async logout(id: string): Promise<string> {
    const result = await this.updateByQuery<EmployeeEntity>({ isDeleted: false, _id: id }, { refreshToken: null })
    return result._id;
  }


  /* --- Utility Functions --- */
  private async generateArgonHash(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  private async generateTokens(id: number, phoneNumber: string): Promise<{ accessToken: string, refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          _id: id,
          phoneNumber,
        },
        {
          secret: 'JWT_ACCESS_TOKEN_SECRET_KEY',
          expiresIn: 5 * 60,
        },
      ),
      this.jwtService.signAsync(
        {
          _id: id,
          phoneNumber,
        },
        {
          secret: 'JWT_REFRESH_TOKEN_SECRET_KEY',
          expiresIn: 24 * 60 * 60,
        },
      ),
    ]);

    return {
      refreshToken,
      accessToken,
    };

  }

}
