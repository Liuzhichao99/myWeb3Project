import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
 
//User & Document 就是把两个类的字段和方法放到一个新的类里
/**
 * 这个类型的对象，既有 User 里的字段（比如 name、email）
也有 Document 里的字段和方法（比如 _id、.save()、.remove() 等）
 */
export type UserDocument = User & Document; //Service层中使用

 
/** 下面只是1.设计房子、 并没有3注册房子和2.建房子，注册房子写在users.module.ts里了 ，建房子写在了最后一行
 * 不用注解要写两个代码
 * 下面这个类似于写出1.设计图
 * 只是一个普通的 TypeScript 类，没有任何 Mongoose 或 NestJS 的装饰器或功能。
它的作用就是告诉 TypeScript：“User 类型有哪些字段”
相当于你用 TypeScript 写了一份字段定义的“说明书”或“草图”
但它 不能直接用于数据库操作
 * 
 * export class User {
  name: string;
  email: string;
  createdAt: Date;
}
//然后下面相当于是2.建房子
这是真正的 Mongoose schema 构造函数
每个字段的类型、规则都定义清楚了
这是 Mongoose 能直接识别的对象
可以拿来注册到 NestJS 的模块中使用

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

3.注册没有写在user.schema.ts里，而是写到了users.module.ts里
然后再注册UserSchema,注册名字是User，这样你才可以在service层里使用User注入
//下面就相当于3.把房子给业务员登记注册。
这里注册模型名 'User'，这个字符串就是数据库中的集合名（collection）
它和 schema 绑定：UserSchema

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})
export class UserModule {}

直接用@Schema()注解，就相当写了上面的两个类和注册了
 */
/**
 * @Schema() 和 User 类的关系
User 是一个普通的 TypeScript 类，里面定义了属性和类型。

@Schema() 是一个装饰器（Decorator），它“标记”了这个类，让 NestJS/Mongoose 把这个类当作一个 Mongoose Schema定义的“设计图” 来处理。

所以，加了 @Schema() 后，这个 User 类就变成了一个带有元数据的 Schema 类定义。
 * 加了 @Schema() 的 User 类，就等同于 Mongoose 的 Schema 类定义。
 */
@Schema()
//写User这个命名没问题，应该是单个用户。不用改Users
export class User {
  /**
   * 1. @Prop() 的作用
它告诉 NestJS/Mongoose 这个类属性是一个Schema字段，会被映射到 MongoDB 的文档中

并且可以配置字段的类型、校验规则、默认值等

2. 如果你不写 @Prop()：
这个属性不会被包含进 Mongoose Schema

也就是说，这个字段不会被保存到数据库

访问这个字段在代码里是有的，但存库时不会生效

总结：如果你想字段在 MongoDB 里有对应数据，一定要写 @Prop()
可以写个空的
@Prop()
   */

  // @Prop({ required: true})
  // _id: string;
  
  @Prop({ required: true })
  name: string;
 
  @Prop({ required: true })
  email: string;
 
  @Prop({ default: Date.now })
  createdAt: Date;
}
 
/**
 * //然后下面相当于是2.建房子
1.如果不用注解，则使用 Mongoose schema 构造函数，创建Mongoose 的Schema类.例如new mongoose.Schema({})
2.而用了注解，则可以使用SchemaFactory.createForClass(加了注解的类名)创建Schema类
可以拿来注册到 NestJS 的模块中使用.注册的代码在3.注册房子里，也就是users.module.ts里
 */
export const UserSchema = SchemaFactory.createForClass(User);