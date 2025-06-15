// app/users/page.tsx

/**
 * ✅ type 支持 &、|（联合、交叉）等高级类型操作，非常灵活。A & B
 * 但interface你可以用 extends 间接实现：
 * interface C extends A, B {}
 * 
 * interface和type都可以声明类型。
 * 
 * 接口响应（HTTP Response）结构	interface ✅	因为结构清晰、可扩展、语义上更像“数据结构”
    联合类型（A | B）	type ✅	只有 type 支持
    交叉类型（A & B）	type ✅	type 更灵活，天然支持交叉
    原始类型别名（如 ID = number）	type ✅	interface 不支持
    工具类型（如条件、映射等）	type ✅	type 是高级类型操作的核心
    定义组件 Props（React）	interface ✅（主流约定）	可扩展、语义清晰，支持 extends

    什么是定义组件 Props（React）
    ButtonProps 就是组件 Button 的 Props 类型定义。
    它规定了 Button 组件必须接受两个属性：
    label（按钮文字，字符串）
    onClick（点击回调函数）

 */
interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }
  
  //await既有等待异步线程执行完 ，也有取值的作用。返回值为Promise<User> await后变成了User。
async function getUsers(): Promise<User[]> {
    /**
     * { cache: 'no-store' }
     * 'force-cache' 默认值，使用缓存（SSR 缓存，静态优化）
     * 'no-store' 不使用缓存。每次请求都去“打后台”，适合实时性强的接口（比如用户列表、动态内容）。
     * 'revalidate' 针对 ISR（增量静态更新）场景
     * 
     * fetch方法就是发起请求。不写method默认是GET请求。
     * fetch方法返回一个Promise对象，res.ok表示请求是否成功。
     * res.json()将响应体解析为JSON格式。
     * 如果请求失败，抛出一个错误。
     * method: 'POST'、 method: 'PUT'、 method: 'DELETE'等方法需要在请求头中添加Content-Type: application/json。
     * 想上传数据  必须用 POST/PUT/DELETE，并加 body
     * 
     * 服务端代码中，fetch 需要完整的绝对 URL。不受到跨域访问的影响。
     * 客户端代码中，收到跨域访问的影响，如有跨域问题，需要走代理
     * 
     * 客户端代码
     * useEffect 是React 的 hook，只在客户端组件中执行。不会在服务端执行
     * 综上所述，客户端代码收到跨域访问影响。访问的代理的URL是相对路径。通过next.config.ts 代理信息替换url。
     * useEffect(() => {
         async function fetchUser() {
           const res = await fetch(`/api-backend1/users/${params.id}`);
           const data = await res.json();
           setUser(data);
           setName(data.name);
           setEmail(data.email);
         }
         fetchUser();
       }, [params.id]);
     * 
     */
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch users');
  //这个res.json()是在方法声明里定义好了。本身是类型是 Promise<any>但是方法指定为了Promise<User[]>，然后被await解析成User对象。
    return res.json();
  }
  
  export default async function UsersPage() {
    const users = await getUsers();
  
    return (
      <div>
        <h1>用户列表</h1>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <a href={`/users/${user._id}`}>- {user.name} - {user.email} - {user._id} </a>
            </li>
          ))}
        </ul>
        <a href="/users/create">➕ 添加用户</a>
      </div>
    );
  }
  