import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
 
@Controller('users')
export class UsersController {
  /**
   * 
   * @param usersService 
   * 依赖注入service，相当于java的
   * @Autowired 
   * private  UsersService usersService;
   * 
   * 和Model的区别
   *  代码	                                         运行时作用	        编译时作用
      @InjectModel(User.name)	根据字符串标识注入      Mongoose Model	  指定 Model 泛型参数的类型
      private readonly usersService: UsersService	  根据类型标识注入    UsersService 实例	确保变量类型安全，方便开发时提示
   * 
   */
  constructor(private readonly usersService: UsersService) {}
 
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
 
  /**
   * 
   * @param id 
   * @returns 
   * http://localhost:3000/users/abc123
   * abc123 就会被当成 :id 传进去。
    方法参数通过 @Param('id') 拿到这个值，即：id === 'abc123'
    'id' 是 从 URL 路径中提取的参数名，也就是你在 @Get(':id') 中定义的那部分。
    id（右边） 是 你在方法里的变量名，用来接收这个值 这两个可以不一样。

    async findOne(...) : Promise<User> 分解解释：
🔹 async 关键字：
表示这是一个异步函数。
异步函数内部可以使用 await 等待异步操作（比如数据库查询、HTTP 请求等）。
使用 async 声明的函数，一定会返回一个 Promise。
🔹 : Promise<User>：
表示这个函数返回一个 Promise，它将来会“解析”（resolve）出一个 User 类型的对象。
举个例子对比：
🧱 同步函数
function getUser(): User {
  return { name: 'Tom', email: 'tom@example.com', createdAt: new Date() };
}
直接返回一个 User 对象。
⚙️ 异步函数
async function getUser(): Promise<User> {
  const user = await userModel.findById('123'); // 异步操作
  return user;
}

   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    /**
     * async 函数可以直接 return Promise，不写 await 也行；写了 await 是为了你能在获取结果后做进一步处理。
     * 例如你要写多行语句，后续需要等结果返回了再执行后面的语句。
     * 这里没有写 await，但实际上 NestJS 是在内部“等待”这个异步操作完成的。实际上是“等了一下”，拿到结果再返回
     * 
     * 异步并行+等待 经典案例。
     * 
     *  执行 A（异步）
        同时继续执行 B 和 C（可以同步或异步）
        到了 D 之前，确保 A 已经完成
        然后执行 D
     * 
     *  const aPromise = this.doA(); // 🚀 开始执行 A，但不等
        this.doB(); // ✅ 同步执行
        await this.doC(); // ✅ 或异步执行 C
        await aPromise; // ✅ 在执行 D 之前，确保 A 已经完成
        this.doD(); // 🚀 执行 D

        await既有等待异步线程执行完 ，也有取值的作用。返回值为Promise<User> await后变成了User。
     * 
     */
    //下面的方法声明的时候就是async的，所以是异步方法。
    return this.usersService.findOne(id);
  }
 
  @Post()
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }
 
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: Partial<User>): Promise<User> {
    return this.usersService.update(id, user);
  }
 
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}