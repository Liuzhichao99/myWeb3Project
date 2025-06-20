import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

/**
 * 
 * @param param0 
 * @returns 
 * props 是组件的参数对象，包含你传入组件的所有信息。
解构是把对象里面的字段直接提取出来用，让代码更清晰简洁。
写法	  示例	                                        特点
不解构	function Comp(props) { return props.name; }	  所有参数通过 props.xxx 访问
解构	  function Comp({ name }) { return name; }	    直接取出参数，代码更简洁
类似构造函数里有一个children变量。
typescript中  冒号分割的。声明对象
{
  children: React.ReactNode
}
  children 是属性名；
React.ReactNode 是属性类型，表示它可以是 JSX 元素、字符串、数字、null、数组等 —— 也就是React 组件中可以渲染的所有内容类型。

Readonly<...>
这是 TypeScript 提供的一个内置泛型类型，用于让一个对象类型的属性都变成“只读”（即不能被修改）。

也就是说：
这个对象有一个名为 children 的属性，它是 React 可渲染的内容，并且这个属性是只读的 —— 不能被修改。

{children}: sth
这种写法不是声明对象，而是解构赋值。
children类型为 React.ReactNode

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
相当于声明RootLayout方法的入参是children，而children的类型是React.ReactNode

 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* JSX中注释必须这么写，没有第二种方法。
        return ( ... ) 里面写的内容 就是 JSX

        这个 RootLayout 是 App Router 的布局组件，它定义了网站的全局结构。
        当你访问一个页面，比如 app/page.tsx 中的内容：
        export default function Page() {
          return <div>Hello Next.js</div>
        }
        Next.js 会自动把这个页面的内容**注入到你 layout 中的 {children} 位置！
        */}
        {children}
      </body>
    </html>
  );
}
