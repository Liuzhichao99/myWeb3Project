import { NextResponse, type NextRequest} from 'next/server';
import {PinataSDK} from 'pinata';
import { Readable } from 'stream';
import { pinata } from "@/utils/config"

// 关闭默认的 body 解析，自己手动解析 FormData
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const pinata = new PinataSDK({
//   pinataJwt: process.env.PINATA_JWT!,
//   pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
// });


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const { cid } = await pinata.upload.public.file(file);

    const url = await pinata.gateways.public.convert(cid);
    console.log(cid)
    console.log(url)
    return NextResponse.json({ cid, url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}