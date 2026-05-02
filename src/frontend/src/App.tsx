import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./Layout";

// Lazy-loaded pages
const SplashPage = lazy(() => import("@/pages/SplashPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const ExplorePage = lazy(() => import("@/pages/ExplorePage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const MyProfilePage = lazy(() => import("@/pages/MyProfilePage"));
const PostDetailPage = lazy(() => import("@/pages/PostDetailPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const RequestsPage = lazy(() => import("@/pages/RequestsPage"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const ChatThreadPage = lazy(() => import("@/pages/ChatThreadPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Layout>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SplashPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomePage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: ExplorePage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const profileMeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/me",
  component: MyProfilePage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$username",
  component: ProfilePage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$postId",
  component: PostDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const requestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/requests",
  component: RequestsPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
});

const chatThreadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat/$partnerUsername",
  component: ChatThreadPage,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  homeRoute,
  exploreRoute,
  notificationsRoute,
  profileMeRoute,
  profileRoute,
  postDetailRoute,
  adminRoute,
  requestsRoute,
  chatRoute,
  chatThreadRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
