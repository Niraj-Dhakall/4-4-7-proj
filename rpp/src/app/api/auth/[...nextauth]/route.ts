import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
declare module "next-auth" {
    interface User {
        userType?: string;
    }
    interface JWT {
        id?: string;
        userType?: string;
    }
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            userType?: string | null;
        };
    }
}
export const authOptions: NextAuthOptions = {
    debug: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "grit@umbc.edu",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                let usertype = "";
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const student = await prisma.students.findUnique({
                    where: { email: credentials.email },
                });

                const manager = await prisma.managers.findUnique({
                    where: { email: credentials.email },
                });
                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email },
                });

                if (admin) {
                    usertype = "admin";
                } else if (manager) {
                    usertype = "stakeholder";
                } else if (student) {
                    usertype = "student";
                }
                if (!student && !manager && !admin) {
                    return null;
                }

                const user = admin || manager || student;
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user!.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user!.id,
                    email: user!.email,
                    name: user!.name,
                    userType: usertype,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.userType = user.userType;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.userType = token.userType as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
