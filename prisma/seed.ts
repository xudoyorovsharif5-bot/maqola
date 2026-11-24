import { PrismaClient, Role, ArticleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma=new PrismaClient();
async function main(){
 const adminEmail=process.env.ADMIN_EMAIL?.trim().toLowerCase();
 const adminPassword=process.env.ADMIN_PASSWORD;
 if(!adminEmail||!adminPassword) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
 if(adminPassword.length<14) throw new Error("ADMIN_PASSWORD must contain at least 14 characters");
 const passwordHash=await bcrypt.hash(adminPassword,12);
 const user=await prisma.user.upsert({where:{email:adminEmail},update:{passwordHash,role:Role.SUPER_ADMIN,name:"Super Admin"},create:{email:adminEmail,name:"Super Admin",passwordHash,role:Role.SUPER_ADMIN}});
 const category=await prisma.category.upsert({where:{slug:"sogliq"},update:{},create:{name:"Sog‘liq",slug:"sogliq"}});
 await prisma.article.upsert({where:{slug:"profilaktik-tekiruvlar"},update:{},create:{title:"Profilaktik tekshiruvlar: salomatlikni saqlashning eng samarali yo‘li",shortDescription:"Kasallik belgilaridan oldin xavf omillarini aniqlash haqida demo maqola.",content:"<p>Profilaktik tekshiruvlar shaxsiy tibbiy tarix va yoshga mos tanlanadi.</p>",slug:"profilaktik-tekiruvlar",status:ArticleStatus.PUBLISHED,publishedAt:new Date(),authorId:user.id,categoryId:category.id,seoTitle:"Profilaktik tekshiruvlar | MEDIAN",seoDescription:"Tibbiy tekshiruvlar haqida ishonchli ma’lumot."}});
 await prisma.expert.upsert({where:{slug:"aziza-karimova"},update:{},create:{name:"Aziza Karimova",slug:"aziza-karimova",specialty:"Yurak-qon tomir shifokori",experience:12,qualification:"Oliy tibbiy ma’lumot; demo profil",bio:"Profilaktik va klinik kardiologiya bo‘yicha mutaxassis.",verified:true}});
 console.log("Demo seed data loaded");
}
main().finally(()=>prisma.$disconnect());
