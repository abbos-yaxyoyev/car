import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { COLLECTIONS } from '../../../../constant/collection';
import { CommonSchema } from '../common.model';

export type CategoryDocument = Category & Document;


@Schema({ collection: COLLECTIONS.CATEGORY, timestamps: true })
export class Category extends CommonSchema {

  @Prop({ trim: true, required: true })
  public name: string;

  @Prop({ trim: true, required: true })
  public imgUrl: string;

  @Prop({
    type: Types.ObjectId,
    ref: COLLECTIONS.CATEGORY,
  })
  parentId: Category;
}

export const CategorySchema = SchemaFactory.createForClass(Category);