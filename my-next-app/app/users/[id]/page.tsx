// app/users/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Props {
  params: Promise<{ id: string }>; // 将 params 定义为 Promise
}

export default function UserDetailPage({ params }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 异步解包 params
    async function resolveParams() {
      const resolvedParams = await params; // 解包 Promise
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      const res = await fetch(`/api-backend1/users/${id}`);
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = confirm('确定要删除这个用户吗？');
    if (!confirmed) return;

    await fetch(`/api-backend1/users/${id}`, {
      method: 'DELETE',
    });
    router.push('/users');
  };

  if (!user) return <p>加载中...</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>邮箱：{user.email}</p>
      <p>注册时间：{new Date(user.createdAt).toLocaleString()}</p>
      <a href={`/users/${user._id}/edit`}>✏️ 编辑</a>
      <button onClick={handleDelete} style={{ marginLeft: '1rem', color: 'red' }}>
        🗑 删除
      </button>
      <br />
      <a href="/users">返回列表</a>
    </div>
  );
}