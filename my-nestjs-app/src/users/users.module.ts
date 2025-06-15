import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// 数据库3.注册房子的代码 ， 1.设计房子和2.建房子的代码都在user.schema.ts里
/**
 * 把 schema 注册进 NestJS 系统供依赖注入使用
 * 注册完后可以在service里注入并使用。进行数据库操作。
 * // 注册 Schema → 转为 Model,后续可以注入并使用Model进行 .create() .find() 等操作
 * @Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})


 * 
 */

/**
 * 关于控制器controller
 * 为什么要在Module 里面写 controllers？
1. NestJS 的模块系统是基于 依赖注入（DI）和元数据注册 的
NestJS 需要知道 哪些控制器属于当前模块，才能帮你自动实例化它们，监听路由，接收请求。

如果你不在模块里声明控制器，NestJS 不会加载它们，你的路由就不会生效。
 */
/**
 * 关于服务service
 * 服务（provider）需要被模块注册，才能被 Nest 的依赖注入容器管理，才能在控制器里用构造函数注入。

控制器也需要注册，Nest才知道“我要监听哪些路由”，并且自动帮你实例化控制器。
 */
@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], //// 注册 Schema → 转为 Model
  controllers: [UsersController],// 注册控制器，让Nest知道有哪些路由要响应
  providers: [UsersService],// 注册服务，供控制器controller和其它服务依赖注入调用
})
export class UsersModule {}
