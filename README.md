# MEDIAN — tibbiy axborot portali

Next.js 16, TypeScript, Tailwind CSS, Prisma va PostgreSQL asosidagi professional tibbiy media portali.

## Namuna ma’lumotlari

Shifokor, maqola, yangilik va ensiklopediya ma’lumotlari **demo** hisoblanadi. Ular real shifokor tasdig‘ini bildirmaydi.

## Ishga tushirish

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Admin panel

Birlamchi administrator login va paroli quyidagi muhit o‘zgaruvchilari bilan yaratiladi:

```bash
ADMIN_EMAIL=admin@median.uz
ADMIN_PASSWORD=kuhli-parolingiz
```

Ma’lumotlarni bazaga joylashdan keyin administratorni yarating:

```bash
npm run db:seed
```

Kirish manzili: `/admin/login`.

`/admin` sahifasi sessiyasiz ochilmaydi. Productionda `NEXTAUTH_SECRET` uchun uzun tasodifiy qiymat, PostgreSQL paroli, HTTPS domeni va kuchli admin parolini ishlating.

Sayt: `http://localhost:3000`

Admin: `http://localhost:3000/admin`

## Docker

```bash
docker compose up --build
```

## Production

```bash
npm run db:deploy
npm run build
npm start
```

## Zaxira va tiklash

Zaxira:

```bash
docker compose exec db pg_dump -U median -d median -Fc > median.dump
```

Tiklash:

```bash
docker compose exec -T db pg_restore -U median -d median --clean --if-exists < median.dump
```

Production hostda `.env` ichida kuchli `NEXTAUTH_SECRET`, PostgreSQL paroli va HTTPS domeni o‘rnating. Reverse proxy orqali 3000-portni Caddy/Nginx bilan ulash tavsiya etiladi.
