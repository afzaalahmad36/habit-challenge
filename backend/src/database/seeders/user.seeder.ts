import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/schema/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const users = [
    {
      email: 'admin@test.com',
      password: await bcrypt.hash('Admin@123', 10),
    },
    {
      email: 'user@test.com',
      password: await bcrypt.hash('User@123', 10),
    },
  ];

  for (const user of users) {
    const exists = await userModel.findOne({ email: user.email });
    if (!exists) {
      await userModel.create(user);
      console.log(`✅ Created user: ${user.email}`);
    } else {
      console.log(`⚠️ User already exists: ${user.email}`);
    }
  }

  await app.close();
}

bootstrap();
