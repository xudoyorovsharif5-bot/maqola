import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest){const {email}=await req.json();if(typeof email!=="string"||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({error:"Email noto‘g‘ri"}, {status:400});return NextResponse.json({ok:true,demo:true})}
