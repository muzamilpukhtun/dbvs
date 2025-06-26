import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // You can add OAuth providers later if needed
  pages: {
    signIn: '/login',
    error: '/auth-error', // Custom error page
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      
      // 1. Define ALL public routes (no auth needed)
      const publicRoutes = [
        '/login',
        '/create-user',
        '/api/auth/.*',   // NextAuth API routes
        '/_next/.*',      // Next.js static files
        '/favicon.ico',
      ];
      
      // 2. Define protected routes
      const protectedRoutes = [
        '/public-polls',
        '/my-polls',
        '/create-polls',
        '/results',
        '/logout'
      ];

      // 3. Check if current route is public
      const isPublicRoute = publicRoutes.some(route => {
        const regex = new RegExp(`^${route.replace('*', '.*')}$`);
        return regex.test(pathname);
      });

      if (isPublicRoute) return true;

      // 4. Check if route is protected
      const isProtectedRoute = protectedRoutes.some(route => {
        const regex = new RegExp(`^${route.replace('*', '.*')}$`);
        return regex.test(pathname);
      });

      // 5. Get auth tokens from cookies (compatible with your AuthContext)
      const authToken = request.cookies.get('authToken')?.value;
      const userData = request.cookies.get('userData')?.value;

      // 6. Handle protected routes
      if (isProtectedRoute) {
        if (!authToken || !userData) {
          // Redirect to login with callback URL
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('callbackUrl', pathname);
          return Response.redirect(loginUrl);
        }

        // Verify token expiration (matches your AuthContext logic)
        const expiresAt = request.cookies.get('expiresAt')?.value;
        if (expiresAt && Date.now() > parseInt(expiresAt)) {
          const response = Response.redirect(new URL('/login', request.url));
          // Clear expired tokens
          response.cookies.delete('authToken');
          response.cookies.delete('userData');
          response.cookies.delete('expiresAt');
          return response;
        }
      }

      // 7. Allow access to all other routes (neither public nor protected)
      return true;
    },
  },
  cookies: {
    sessionToken: {
      name: 'authToken',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 24 * 60 * 60, // 10 days (matches your AuthContext)
      },
    },
    userData: {
      name: 'userData',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 24 * 60 * 60,
      },
    },
    expiresAt: {
      name: 'expiresAt',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 24 * 60 * 60,
      },
    },
  },
} satisfies NextAuthConfig;