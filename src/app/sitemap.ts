import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{
 const base=process.env.NEXTAUTH_URL||"http://localhost:3000";
 return ["","news","diseases","advice","experts","videos"].map(p=>({url:`${base}/${p}`,lastModified:new Date(),changeFrequency:p?"weekly":"daily",priority:p?0.7:1}));
}
