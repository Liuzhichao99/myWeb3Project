import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 打印环境变量以验证配置
  console.log('Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('ETHEREUM_RPC_URL:', process.env.ETHEREUM_RPC_URL);
  console.log('MESSAGE_BOARD_ADDRESS:', process.env.MESSAGE_BOARD_ADDRESS);
  console.log('ADMIN_PRIVATE_KEY:', process.env.ADMIN_PRIVATE_KEY ? '***' : undefined);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
