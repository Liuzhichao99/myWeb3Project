// app/users/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter,useParams } from 'next/navigation';


interface User {
  _id: string;
  name: string;
  email: string;
}

interface Props {
  params: { id: string };
}

/**
 * useState 是 React Hook（钩子）之一。
 * 它让你在函数组件里声明一个“状态变量”（state），这个变量会保存一些数据，并且当数据改变时，组件会自动重新渲染。
 * create中有代码
 * 
 * 本页有React 的副作用 Hook useEffect 
 * @param param0 
 * @returns 
 */


export default function EditUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  //如果是客户端组件（有 'use client'），参数 params 是同步的，不会是 Promise
  const params = useParams();
  const id = params.id;

  //params三种方式获取
  /**
   * 如果是客户端组件（有 'use client'），参数 params 是同步的，不会是 Promise
   * 方法一：在客户端组件里把 params 作为 props 传进来（不推荐）
你是写的 'use client' 的客户端组件，应该没问题直接同步访问 params。
但是如果 params 是异步传进来的，就要先解构并缓存到一个同步变量，避免在 useEffect 里直接用异步变量。

export default function EditUserPage({ params }: Props) {
  const id = params.id; // 先缓存，保证同步访问
  // ...
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api-backend1/users/${id}`);
      const data = await res.json();
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    }
    fetchUser();
  }, [id]);
  // ...
}

方法二：确认 params 是同步的（不推荐）
如果是客户端组件（有 'use client'），参数 params 是同步的，不会是 Promise
如果你在 page.tsx 里使用 export default async function（服务端组件），你可以直接用 await。
如果是客户端组件（你写了 'use client'），params 应该是同步传入的 props，没必要 await。

方法三：用 useParams() hook 代替（推荐）
在 'use client' 的组件中，可以用 Next.js 的 useParams() hook 获取路由参数：
import { useParams } from 'next/navigation';

export default function EditUserPage() {
  const params = useParams();
  const id = params.id;
  
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api-backend1/users/${id}`);
      const data = await res.json();
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    }
    fetchUser();
  }, [id]);
  // ...
}
这样就不需要从 props 里传 params 了。

总结
报错是因为你在客户端组件里直接用异步的 params.id。
先同步缓存 const id = params.id，然后用 id 作为依赖。
或者用 useParams() 获取参数。
不要直接在 useEffect 依赖数组里写 params.id，会导致 Next.js 警告。
   */

  /**
   * useEffect 是 React 的副作用 Hook，组件渲染后会执行里面的函数。
    依赖数组 [params.id] 表示：

    当 params.id 变化时，useEffect 会重新执行里面的代码。
    没有变化时，不重复执行，避免重复请求。
    fetchUser 是定义在 useEffect 里的异步函数，负责：
    用 fetch 向服务器请求用户数据，URL 是动态拼接的 params.id。
    await res.json() 把服务器响应的 JSON 数据转换成 JavaScript 对象。
    setUser(data) 将用户数据保存到 React 状态 user。
    setName(data.name) 和 setEmail(data.email) 把用户的 name 和 email 单独保存到对应的状态（一般用于绑定表单输入）。
    最后，调用 fetchUser() 执行这个异步请求。

    开头“组件渲染后会执行里面的函数”是什么意思？
    React 组件第一次挂载（首次显示）到页面上时，组件会执行它的函数（函数组件本身就是个函数）。
    useEffect 里写的函数是 React 的“副作用”，意思是：在组件完成渲染（即 DOM 已经更新完毕）之后，React 会调用 useEffect 里的函数执行一些操作。

    当组件第一次显示到页面时，React 渲染完界面后，会执行这个 useEffect 里的函数。
    如果 params.id 变化了（比如路由参数变了），组件重新渲染完后，也会执行一次。
   */
  useEffect(() => {
    /**
     * setUser(data);为什么这里就不写(e) => setUser
     * setUser(data) 是“立刻更新”，用于已有数据时调用。
    (e) => setUser(e) 是“定义函数”，用于事件回调或函数传参时。

    写法	            含义	                      作用场景	                            立即执行还是等待调用
    setUser(data)	    直接调用，传入具体值更新状态	已经拿到数据，马上更新状态	            立即执行
    (e) => setUser(e)	定义一个函数，传入参数时调用	事件处理函数，传入事件对象或参数时调用    仅定义，等触发时调用
     */
    async function fetchUser() {
      const res = await fetch(`/api-backend1/users/${params.id}`);
      const data = await res.json();
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    }
    fetchUser();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api-backend1/users/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    router.push('/users');
  };

  if (!user) return <p>加载中...</p>;

  return (
    <form onSubmit={handleUpdate}>
      <h1>编辑用户</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">更新</button>
    </form>
  );
}
