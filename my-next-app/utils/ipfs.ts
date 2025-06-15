export async function uploadToIPFS(file: File, name: string, description: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('description', description);

  const res = await fetch('/api/nft/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`上传失败: ${text}`);
  }

  const data = await res.json();
  return data.url;
}
