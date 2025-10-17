import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '../../../../../lib/prisma'
import bcrypt from 'bcryptjs'
declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
const handler = NextAuth({
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                email: {label: "Email", type: "text", placeholder: "grit@umbc.edu"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password){
                    return null
                }
                const student = await prisma.students.findUnique({
                    where:{ email: credentials.email } 
                })

                if(!student){
                    return null;
                }

                // Verify password hash
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    student.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return{
                    id: student.id,
                    email: student.email,
                    name: student.name,
                }
            },
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    }
})

export {handler as GET, handler as POST}