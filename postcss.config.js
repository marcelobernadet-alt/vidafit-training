import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/login");
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/icons") ||
    pathname === "/favicon.ico";

  if (isPublicAsset) return response;

  // Sin sesión -> solo puede ver /login
  if (!user) {
    if (!isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Con sesión, buscar rol para decidir el home correcto
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "student";

  // Ya logueado, no debería ver /login
  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = role === "coach" ? "/admin" : "/hoy";
    return NextResponse.redirect(url);
  }

  // Alumno intentando entrar al panel de coach
  if (isAdminRoute && role !== "coach") {
    const url = request.nextUrl.clone();
    url.pathname = "/hoy";
    return NextResponse.redirect(url);
  }

  // Ruta raíz -> redirigir según rol
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = role === "coach" ? "/admin" : "/hoy";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|icons).*)"],
};
