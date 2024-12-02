import NextAuth, { NextAuthConfig } from "next-auth";
const authConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [],
} satisfies NextAuthConfig;
export const config = { 
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
export const { handlers, auth } = NextAuth(authConfig);