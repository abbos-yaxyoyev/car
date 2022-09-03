import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';



export class CommonSchema {

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
    // ref: COLLECTIONS.EMPLOYEE,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    // ref: COLLECTIONS.EMPLOYEE,
  })
  updatedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    // ref: COLLECTIONS.EMPLOYEE,
  })
  deletedBy: Types.ObjectId;

  @Prop({ default: undefined })
  deletedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
