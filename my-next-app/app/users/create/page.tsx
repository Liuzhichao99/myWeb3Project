// app/users/create/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUserPage() {
  /**
   * 这段代码是 React（尤其是 Next.js 里）用来管理组件状态和路由跳转的典型写法
   * 1. const [name, setName] = useState('');
这是 React 的 状态钩子（useState）。
创建了一个状态变量 name，初始值是空字符串 ''。
setName 是修改 name 状态的函数，调用它会触发组件重新渲染。
setName('Alice'); // 更新 name 为 'Alice'

什么是 useState？
useState 是 React Hook（钩子）之一。
它让你在函数组件里声明一个“状态变量”（state），这个变量会保存一些数据，并且当数据改变时，组件会自动重新渲染。
具体看 useState('')：
const [value, setValue] = useState('');
useState 里面传的参数 '' 是状态的初始值，这里是空字符串。
它返回一个数组，包含两个元素：
当前状态的值，比如这里的 value，初始就是 ''。
一个函数，用来更新这个状态，比如这里的 setValue

3. const router = useRouter();
这是 Next.js 提供的一个钩子，用来访问 路由对象。
你可以用它实现编程式导航，比如跳转页面：
router.push('/users'); // 跳转到 /users 页面

   */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  /**
   * 
   * @param e 
   * FormEvent
   * e.preventDefault() ,表示这是一个表单提交事件的监听逻辑，典型的浏览器交互行为
   * alert()、router.push() 使用了浏览器弹窗和页面跳转，显然属于前端逻辑
   * 因此属于客户端代码。
   * 
   * 服务端代码和客户端代码的区别
   * 服务端代码返回的是“生成好的 HTML 页面”，而客户端代码负责让页面变得“有交互”。它们的目标相同：返回前端页面，但职责和运行时机不同。
   *  特点	                服务端代码返回页面	        客户端代码返回页面
      运行位置	            Node.js（服务器）	          浏览器
      返回方式	            返回生成好的 HTML（SSR）	   动态更新/构建页面的内容（CSR）
      初次加载是否需要 JS	   否，可以是纯 HTML	         是，必须加载 JS 后运行
      是否可交互	          页面加载后还需 JS 才能交互	  本身具备交互能力
      场景	                SEO友好、初始渲染快	        响应用户操作、事件绑定

      客户端代码和服务端代码的使用时机
      问题	                                          建议使用的代码
      变量来自数据库、API，需要在页面首次渲染时显示	      ✅ 服务端代码（SSR/SSG）
      变量依赖用户行为（输入、点击、登录状态等）	        ✅ 客户端代码（useState, useEffect）
      变量涉及敏感信息（如 token、数据库密钥）	         ✅ 服务端代码（防止暴露）
      页面首次加载就必须看到该变量的内容	               ✅ 服务端代码（更快，更 SEO 友好）
      变量只影响小范围局部交互	                        ✅ 客户端代码（表单、弹窗、按钮逻辑等）

      场景	          推荐
      商品详情页	      服务端（页面加载前就需要数据）
      商品数量加减按钮	客户端（用户点了才变）
      用户登录状态检查	服务端（防止未登录访问页面）或客户端（UI 更新）
      博客文章内容	    服务端（利于 SEO）
      评论框文字输入	  客户端（即时响应）

      决策技巧口诀：
      数据先天存在于服务器，就用服务端代码；数据后天由用户产生，就用客户端代码。

      服务端例子：
      // 服务端获取用户列表，页面一加载就展示
      export default async function UsersPage() {
        const res = await fetch('https://api.example.com/users', { cache: 'no-store' });
        const users = await res.json();

        return (
          <ul>
            {users.map(u => <li key={u.id}>{u.name}</li>)}
          </ul>
        );
      }

    客户端代码的好例子
    'use client';

    export default function CreateUserPage() {
      const [name, setName] = useState('');

      return (
        <input value={name} onChange={(e) => setName(e.target.value)} />
      );
    }

   */

  /**
   * 
   * @param e 
   * 页面点击 submit 按钮 后，会自动调用你绑定在 <form onSubmit={...}> 上的函数变量（比如 handleSubmit）。
   * 
   * (e: FormEvent<HTMLFormElement>) => {}
   * 是 TypeScript 中一个“带类型注解的箭头函数”
   *  e	函数的参数，通常是“事件对象”
      FormEvent<HTMLFormElement>	说明 e 的类型是一个 HTML 表单的事件对象
      => { ... }	箭头函数的主体，用来处理这个事件（比如阻止默认行为、提交数据）

      总结
      这是一个接收 HTMLFormElement 提交事件的函数，它会处理这个事件。
      {...} 是函数的主体，里面可以写你想要执行的代码，比如阻止默认行为、提交数据等。

      可以写成：
      const handleSubmit = (e) => {
        e.preventDefault();
      }
      但是这样 TypeScript 不知道 e 是什么类型，所以不智能、容易出错。
      加上 FormEvent<HTMLFormElement> 后：
      编辑器能自动提示你有哪些方法
      比如 .preventDefault()、.target 等
      也更符合严格的类型检查

      FormEvent<HTMLFormElement>
      事件类型<HTMLElement类型>
      FormEvent	表示“表单事件”的类型，是 React 内置的类型（比如提交）
      <HTMLFormElement>	泛型参数，告诉 TypeScript：这个事件是由哪个 HTML 元素触发的，这里是 <form>

      常见写法表格总结
      用法	                            适用于	              示例
      FormEvent<HTMLFormElement>	      表单 <form> 提交事件	onSubmit
      ChangeEvent<HTMLInputElement>	    输入框内容改变事件	   onChange
      ChangeEvent<HTMLTextAreaElement>	文本域改变事件	      onChange
      MouseEvent<HTMLButtonElement>	    鼠标点击按钮	        onClick
      KeyboardEvent<HTMLInputElement>	  键盘事件	            onKeyDown
      FocusEvent<HTMLInputElement>	    获取焦点或失去焦点	   onFocus, onBlur
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // 阻止默认的事件行为
    e.preventDefault();

    /**
     * const name = "Alice";
        const email = "alice@example.com";
        你写：
        JSON.stringify({ name, email });
        等同于：
        JSON.stringify({ name: name, email: email });
        结果会是一个 JSON 格式的字符串：
        '{"name":"Alice","email":"alice@example.com"}'
     */
    const res = await fetch('/api-backend1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    //如果 HTTP 响应成功（状态码是 200～299 之间）就执行接下来的逻辑
    if (res.ok) {
      /**
       * 是在 Next.js（基于 React 的框架）中，用于跳转页面的操作，相当于在代码中执行一个路由跳转。
       * 要使用这句代码，你通常需要先从 next/navigation（或旧版是 next/router）中导入 router 对象。
       *  跳转到 /users 页面
       * 本质上是发起了一个 GET 请求
       * 前端页面跳转默认都是 GET 请求
       */
      router.push('/users');
    } else {
      //弹出一个浏览器自带的对话框，显示文字 “提交失败”。
      alert('提交失败');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>添加用户</h1>
      {/* 
      1. value={name}
      把输入框的值绑定到 React 里的状态变量 name。
      也就是说，输入框显示的内容 总是由 name 这个状态控制。
      这是所谓的“受控组件”，输入框的值不直接存在 DOM 里，而是受 React 状态控制。

      2. onChange={(e) => setName(e.target.value)}
      onChange 是输入框的事件监听器，监听用户输入（每次键入、删除时触发）。
      当用户输入时，事件对象 e 会传入，e.target.value 是输入框的当前文本。
      调用 setName(e.target.value) 把最新输入保存到状态 name 里。

      为什么这样写？
      这样就实现了输入框的值和 React 状态的同步：
      输入变化时，状态更新
      状态变化时，输入框内容更新
      便于表单数据管理、验证、提交等操作。

      完整流程：
      React 受控组件中 input 改变的完整流程：
      1.用户在输入框里输入文字 —— 触发了 onChange 事件。
      2.事件处理函数执行：
      (e) => setName(e.target.value)
      通过 e.target.value 读取输入框最新的内容。
      调用 setName 更新 React 组件中的 name 状态。
      3.React 状态 name 被更新。
      4.React 重新渲染组件。
      5.输入框的 value={name} 属性得到新的 name 值，输入框显示的内容更新，和状态保持同步。

      React 状态和普通变量的区别：
      方面	        普通变量 let name = 'Alice'	     React 状态 const [name, setName] = useState('Alice')
      作用	        存储数据	                       存储会影响组件渲染的数据
      更新时机	     手动赋值，UI不变	                调用更新函数后，React自动重新渲染
      是否引起渲染	 不引起	                          会引起组件重新渲染
      生命周期	     只存在于函数执行期间	             持续存在于组件生命周期内

      name 的值是在你调用 setName(newValue) 之后 由 React 在下一次渲染时更新的。
      用户输入触发 onChange，调用了：
      setName(e.target.value);
      setName 并不是马上修改 name 变量的值，而是告诉 React：
      “状态要更新为新值 e.target.value，请准备重新渲染组件。”
      React 批量处理状态更新，然后触发组件重新渲染。
      在下一次渲染时，React 会用最新的状态值（也就是刚才传给 setName 的新值）来渲染组件。
      于是这次渲染中，name 就是新值了，value={name} 绑定的输入框内容也会更新。

      React 有点像“排队处理状态变化”，不会一改就马上改。
      保证了性能和界面的一致性。

      先说浏览器原生 <input> 的行为
      浏览器原生 <input> 元素本身会自动响应用户输入，显示你键入的内容，这是浏览器的默认行为。
      如果你不干预，输入框里的值就由 DOM 自己管理，用户输入什么它显示什么。

      当你用 React 管理 <input>，写成这样：
      <input value={name} onChange={e => setName(e.target.value)} />
      这里的 value={name} 让 React “接管”了这个输入框的值。
      这时输入框的内容不再由浏览器 DOM 自己完全控制，而是由 React 里的状态 name 决定。
      每次用户输入时，触发 onChange，通过 setName 更新状态，React 重新渲染组件，把新的 name 赋给 value。
      这样才能保证输入框的显示内容和 React 的状态保持一致，不会出现输入框和状态不匹配的情况。

      重新渲染的作用
      更新 UI 以反映最新的状态。
      React 通过重新渲染，把 name 的最新值赋给输入框的 value 属性。
      确保组件里的状态（name）和页面显示内容（输入框）同步一致。
      这也是 React 的声明式编程核心：UI 由状态驱动。

      1. 浏览器原生 <input>（非受控组件）
      性能优势：
      输入框的内容由浏览器 DOM 直接管理，用户每输入一个字符，浏览器直接更新显示。
      不涉及 React 组件的重新渲染，响应速度非常快，开销很小。
      缺点：
      React 无法直接读取或控制输入值，处理数据和校验需要额外操作（比如用 ref 取值）。
      表单状态和 UI 不在 React 状态管理体系内，逻辑复杂时维护难度大。
      2. React 受控组件（value 绑定状态 + onChange 更新）
      性能开销：
      每次用户输入，都会调用 setState 更新状态，触发组件重新渲染。
      重新渲染会执行组件函数，创建虚拟 DOM，然后 React 对比虚拟 DOM，最后更新真实 DOM。
      对于简单输入框性能影响通常很小，现代浏览器和 React 优化得很好。
      优势：
      表单值由 React 管理，状态和 UI 保持同步，方便做校验、格式化、条件渲染等复杂逻辑。
      代码更声明式、可维护性更强。

      3. 性能对比总结
      方面	        原生 <input>（非受控）	       React 受控组件
      输入响应速度	非常快，直接操作 DOM	          稍慢，受状态更新和重新渲染影响
      状态管理	    浏览器自己管理，需要额外代码	   React 统一管理状态和 UI
      适用场景	    简单表单，性能要求极高时	      大多数复杂交互和动态 UI
      维护难度	    较高，需要手动同步状态	        低，数据流清晰易维护

      4. React 性能优化小建议
      使用受控组件时，避免无谓的重新渲染（比如用 React.memo、拆分组件）。
      对大批量输入或超复杂表单，考虑用非受控组件（ref 方式）配合手动取值。
      现代 React 性能非常好，一般受控组件完全够用。
      */}
      <input
        placeholder="姓名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="邮箱"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">提交</button>
    </form>
  );
}
