import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/verify-otp`, {
            email: credentials.email,
            otp: credentials.otp,
          });
          
          if (res.data) {
            return {
              id: res.data._id,
              name: res.data.name,
              email: res.data.email,
              image: res.data.image,
            };
          }
          return null;
        } catch (error) {
          console.error("Credentials Auth Error");
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`, {
            email: user.email,
            name: user.name,
            image: user.image,
          });
          
          const dbUser = res.data;
          // Store phone number on the user session object if it exists
          (user as any).phoneNumber = dbUser.phoneNumber;
          return true;
        } catch (error) {
          console.error("Error saving user to DB during sign in", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          // Fetch the latest user data to ensure we have the phone number
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`, {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          });
          (session.user as any).phoneNumber = res.data.phoneNumber;
        } catch (error) {
          console.error("Error fetching user data for session", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
