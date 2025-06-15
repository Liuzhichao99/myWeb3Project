import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
 
@Injectable()
export class UsersService {
  /**
   * 前面已经3注册房子了，那这里就可以直接用了
   * @param userModel 
   * 直接User.name，vscode会识别User有没有import的这个类。有的话不会报错。否则import那里就提示报错了。
   * @InjectModel(User.name)等价于@InjectModel("User")，但是用User.name会更好，更安全。
   * 
   * 为什么 service 里要用 @InjectModel(...)？
   * 原因：
userModel 是 Mongoose 提供的模型对象，你用它来做：

this.userModel.find()：查数据库

this.userModel.create()：插入数据

等等

➡️ 所以你需要手动告诉 NestJS：“我要注入哪个模型”，而这个模型是在 MongooseModule.forFeature(...) 注册过的

相比controller里注入service不同
@InjectModel(User.name) 👈 是根据你注册的模型名 'User' 找到对应的 Model。
Model<UserDocument> 👈 是这个 Model 的类型，类型注解而已，不参与注入。
userModel 👈 是变量名，你起啥都行（比如 this.db 也行），它就是你注入的模型实例。

为什么用 Model<UserDocument> 而不是 Model<User>？
Mongoose 的 Model 是操作数据库文档的类，实际操作的是数据库中的「文档」。
数据库文档除了你定义的字段外，还有 Mongoose 自动生成的字段（如 _id）和方法。
因此操作数据库的模型必须基于包含这些额外属性和方法的 UserDocument，才能保证类型完整。

Model<UserDocument>只是声明Model的具体实例类型？实际还是@InjectModel来生成的Model
Model<UserDocument> 只是告诉 TypeScript 这个 Model 实例操作的文档是 UserDocument 类型，属于类型声明/类型约束。
实际的 Model 实例，是由 @InjectModel(User.name) 负责注入（由 NestJS 和 Mongoose 底层创建的），它是运行时的对象。
@InjectModel(User.name)：运行时装配、注入 Mongoose 的 Model 实例（对应名为 "User" 的 schema）
Model<UserDocument>：编译时类型声明，告诉 TS 你这个 userModel 变量是个 Model 类型，操作的是 UserDocument

注入的是Model.
Model：是 Mongoose 提供的一个接口，它包含所有你熟悉的数据库操作方法，比如：
.find()
.findById()
.create()
.updateOne()
.deleteOne() 等。


   * 和Service注入的区别
   *  代码	                                         运行时作用	        编译时作用
      @InjectModel(User.name)	根据字符串标识注入      Mongoose Model	  指定 Model 泛型参数的类型
      private readonly usersService: UsersService	  根据类型标识注入    UsersService 实例	确保变量类型安全，方便开发时提示

@InjectModel(User.name)：运行时装配、注入 Mongoose 的 Model 实例（对应名为 "User" 的 schema）
Model<UserDocument>：编译时类型声明，告诉 TS 你这个 userModel 变量是个 Model 类型，操作的是 UserDocument
   */
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {} //schema里的
 
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
 
  async findOne(id: string): Promise<User> {
    /**
     * this.userModel.findById(id)：
      查数据库，找出对应 ID 的用户，找不到就返回 null。
      await ...exec()：
      等待查询结果。
      if (!user)：
      意思是 如果 user 为 null、undefined、false、0、空字符串、NaN 中的任意一个，就进 if 块。
      
      if里null、undefined、false、0n (BigInt零)、0、-0、空字符串、NaN 中的任意一个都是false，其他则为true 

      ===（严格相等，strict equality）
      不做类型转换，只有类型相同且值相同才返回 true。
      也叫“严格等于”。
      例子：
      1 === 1        // true，类型和值都一样
      1 === '1'      // false，类型不同
      null === null  // true
      null === undefined // false，类型不同
      if判断一览表
      | user值      | `user === null` | `user == null` | `!user` |
      | ----------- | --------------- | -------------- | ------- |
      | `null`      | true            | true           | true    |
      | `undefined` | false           | true           | true    |
      | `0`         | false           | false          | true    |
      | `-0`        | false           | false          | true    |
      | `NaN`       | false           | false          | true    |
      | `''`        | false           | false          | true    |
      | `false`     | false           | false          | true    |

      异步方法后面必须写exec的场景很少。调用异步方法时候可以不写后面的exec()。
     */

    /**查询语句整合
     * 1. Mongoose 自带查询方法
      比如你用 find(), findOne(), findById() 等：
     * const user = await this.userModel.findOne({ name: 'Alice' }).exec();
        这类似“SQL 里的 WHERE name = 'Alice'”。

        2. 用 aggregate() 做更复杂的查询（聚合管道）
        const result = await this.userModel.aggregate([
          { $match: { age: { $gt: 20 } } },
          { $group: { _id: '$country', total: { $sum: 1 } } },
        ]).exec();
        相当于 SQL 里的 SELECT country, COUNT(*) FROM users WHERE age > 20 GROUP BY country

        3. 自定义查询（直接写 MongoDB 查询条件）
        const users = await this.userModel.find({
          email: { $regex: /@gmail\.com$/ }, // 邮箱以gmail.com结尾
          createdAt: { $gte: new Date('2023-01-01') }, // 创建时间大于等于2023年1月1日
        }).exec();

        4. 如果你想用原生 MongoDB 驱动执行命令，也可以
        const rawResult = await this.userModel.collection.find({ ... }).toArray();
        但一般不需要。

        5.（age > 20 并且name = '小田'）  或者 (sex是女的)怎么写
        const users = await this.userModel.find({
        $or: [
          { $and: [ { age: { $gt: 20 } }, { name: '小田' } ] },
          { sex: '女' }
        ]
      }).exec();

      6.(（age > 20 并且name = '小田'）  或者 (sex是女的))  或者 (（age > 30 并且name = '小红'）  或者 (sex是男的)) 
      const query = {
      $or: [
        {
          $or: [
            { age: { $gt: 20 }, name: '小田' },
            { sex: '女' }
          ]
        },
        {
          $or: [
            { age: { $gt: 30 }, name: '小红' },
            { sex: '男' }
          ]
        }
      ]
    };

    const users = await this.userModel.find(query).exec();

    7.
    [
{
	"age": "12",
	"name": "tom",
	"sex": "tom@update.com"
},
{
	"age": "20",
	"name": "cat",
	"sex": "cat@update.com"
},
{
	"age": "25",
	"name": "tt",
	"sex": "tt@update.com"
}
]请求体如上、这个list接收，改类似下面的sql拼接。
(（age > 20 并且name = '小田'）  或者 (sex是女的))  或者 (（age > 30 并且name = '小红'）  或者 (sex是男的)) 

/**
   * 根据前端传来的 list 拼接复杂查询条件，查询符合条件的用户列表
   * @param list 前端传来的数组，包含 age, name, sex 字段

  async findByComplexConditions(list: { age: string; name: string; sex: string }[]): Promise<User[]> {
    if (!list || list.length === 0) {
      // 如果没传参数，或者空数组，返回空数组或全部用户，按需求改
      return [];
    }

    // 构造查询条件
    const orConditions = list.map(item => ({
      $or: [
        { age: { $gt: Number(item.age) }, name: item.name },
        { sex: item.sex },
      ],
    }));

    // 最终查询条件
    const query = { $or: orConditions };

    // 执行查询，返回结果
    const users = await this.userModel.find(query).exec();

    if (!users || users.length === 0) {
      throw new NotFoundException('No users found matching conditions');
    }

    return users;
  }
  
  上面的代码解释
  (（age > 20 并且 name = '小田'）或者 (sex是女的)) 
或者 
(（age > 30 并且 name = '小红'）或者 (sex是男的))
  所以query里面存的是javascript对象如下：
{
  $or: [
    { $and: [ {age: {$gt: 20}}, {name: '小田'} ] },
    { sex: '女' },
    { $and: [ {age: {$gt: 30}}, {name: '小红'} ] },
    { sex: '男' }
  ]
}

你用 $or 是因为你的查询是“多个条件组之间，用‘或者’连接”，所以顶层用$or。
$and是内部每组条件的连接方式。

一个对象，里面有 $or 字段
$or 对应一个数组，数组里每个元素是一个条件对象
这些条件组合起来表达了复杂的查询逻辑
其实在 JavaScript 中，变量名是可以以 $ 或者 _ 开头的，和字母一样合法。
只要不是数字开头就行。

     */
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
 
  async create(user: Partial<User>): Promise<User> {
    /**
     * new this.userModel(user) 就是用传入的 user 对象创建了一个新的 Mongoose 文档实例（相当于数据库中的一条新记录），赋值给 newUser
     * 这一步只是创建实例，还没有写入数据库。
     * 
     * newUser.save()
      .save() 是 Mongoose 文档实例的方法，用来把这个新建的文档保存（写入）到数据库。
      它返回一个 Promise，表示保存操作完成后返回的新保存的文档（包含自动生成的 _id、时间戳等字段）。


      接口 A：返回用户基本信息（如 name）
      [
        { "id": "1", "name": "Tom" },
        { "id": "2", "name": "Jerry" }
      ]
      接口 B：返回用户扩展信息（如 sex）
      [
        { "id": "1", "sex": "男" },
        { "id": "2", "sex": "女" }
      ]
        你要把这两个拼接起来，变成：
        [
        { id: "1", name: "Tom", sex: "男" },
        { id: "2", name: "Jerry", sex: "女" }
      ]
        步骤一：拉取两个接口数据（用 axios）
      const dataA = await axios.get('https://api1.com/users'); // 接口 A
      const dataB = await axios.get('https://api2.com/users'); // 接口 B
      步骤二：根据 ID 合并两个列表
      const listA = dataA.data; // [{ id, name }]
      const listB = dataB.data; // [{ id, sex }]

      // 先把 B 转为 Map 结构方便快速查找
      const mapB = new Map<string, any>();
      for (const item of listB) {
        mapB.set(item.id, item);
      }

      // 合并 A 和 B
      const merged = listA.map(itemA => {
        const itemB = mapB.get(itemA.id);
        return {
          id: itemA.id,
          name: itemA.name,
          sex: itemB?.sex ?? null,
        };
      });
      步骤三：保存到数据库
      你现在每条数据都有了 id, name, sex，可以用你的 create() 方法：
      便利 merged 数组，逐条保存到数据库
      for (const user of merged) {
        await this.create(user); // 调用你的 service 方法
      }
      如果你想一次性插入多个，也可以用：
      await this.userModel.insertMany(merged);


     */
    const newUser = new this.userModel(user);
    return newUser.save();
  }
 
  async update(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }
 
  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * mysql和mongodb的区别
   * 主要变化点
      1. ORM 工具变化
      MongoDB 你用的是 Mongoose（基于 Schema 的文档数据库 ORM）；
      MySQL 常用的是 TypeORM 或 Prisma，两者都用在 NestJS 项目中。
      你不能再用：
      new this.userModel(user).save(); // 这是 Mongoose 的写法
      而应该是 TypeORM 的写法：
      await this.userRepository.save(user); // TypeORM
      2. 实体类（Entity）写法不同
      MongoDB（Mongoose）：
      @Schema()
      export class User {
        @Prop() name: string;
        @Prop() sex: string;
      }
      MySQL（TypeORM）：
      @Entity()
      export class User {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        name: string;

        @Column()
        sex: string;
      }
      3. Service 里操作方式变化
      Mongoose
      await this.userModel.insertMany(users);
      TypeORM
      await this.userRepository.save(users); // save 既能新增也能更新
      或者使用批量插入：
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(users)
        .execute();
      4. 注入方式变化
      ✅ Mongoose 注入方式：
      constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
      ) {}
      ✅ TypeORM 注入方式（推荐用 Repository）：
      constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}

   */
}