import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Users
  const creator = await prisma.user.upsert({
    where: { email: 'creator@stemverse.com' },
    update: {},
    create: {
      email: 'creator@stemverse.com',
      displayName: 'Original Creator',
      role: 'creator',
      isVerified: true,
    },
  });

  const remixer = await prisma.user.upsert({
    where: { email: 'remixer@stemverse.com' },
    update: {},
    create: {
      email: 'remixer@stemverse.com',
      displayName: 'AI Remixer',
      role: 'remixer',
      isVerified: true,
    },
  });

  const consumer = await prisma.user.upsert({
    where: { email: 'fan@stemverse.com' },
    update: {},
    create: {
      email: 'fan@stemverse.com',
      displayName: 'Music Fan',
      role: 'consumer',
    },
  });

  console.log(`Users seeded: creator (${creator.id}), remixer (${remixer.id}), consumer (${consumer.id})`);

  // 2. Create Wallets
  await prisma.userWallet.upsert({
    where: { userId: creator.id },
    update: {},
    create: {
      userId: creator.id,
      balanceUsd: 15000, // $150.00
      totalEarned: 25000,
    },
  });

  await prisma.userWallet.upsert({
    where: { userId: remixer.id },
    update: {},
    create: {
      userId: remixer.id,
      balanceUsd: 5000, // $50.00
      totalEarned: 5000,
    },
  });

  console.log('Wallets seeded.');

  // 3. Create a Song
  const song = await prisma.song.create({
    data: {
      ownerId: creator.id,
      title: 'Summer Breeze',
      genre: 'Synthwave',
      bpm: 110.0,
      key: 'Am',
      mood: 'Retro',
      tags: ['synth', 'retrowave', 'summer'],
      fileUrl: 'https://r2.cloudflarestorage.com/stemverse-audio/summer-breeze.mp3',
      duration: 180,
      licenseType: 'remix',
      remixAllowed: true,
      royaltySplitRemixer: 20.00,
      royaltySplitPlatform: 10.00,
      processingStatus: 'done',
      isPublished: true,
      stems: {
        create: [
          { type: 'vocal', fileUrl: 'https://r2.cloudflarestorage.com/stemverse-audio/summer-breeze-vocals.wav', duration: 180 },
          { type: 'drums', fileUrl: 'https://r2.cloudflarestorage.com/stemverse-audio/summer-breeze-drums.wav', duration: 180 },
          { type: 'bass', fileUrl: 'https://r2.cloudflarestorage.com/stemverse-audio/summer-breeze-bass.wav', duration: 180 },
          { type: 'melody', fileUrl: 'https://r2.cloudflarestorage.com/stemverse-audio/summer-breeze-melody.wav', duration: 180 },
        ],
      },
      analysis: {
        create: {
          bpm: 110.0,
          key: 'Am',
          mood: 'Retro',
          waveform: [0.1, 0.3, 0.5, 0.4, 0.6, 0.8, 0.2, 0.1, 0.5],
          duration: 180,
        },
      },
      licenseConfig: {
        create: {
          personalPrice: 99, // $0.99
          commercialPrice: 2999, // $29.99
          remixPrice: 499, // $4.99
          exclusivePrice: 19999, // $199.99
        },
      },
    },
  });

  console.log(`Song seeded: ${song.title} (${song.id})`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
