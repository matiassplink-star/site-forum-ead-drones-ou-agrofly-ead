import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware de Pass-Through
 * 
 * Como o projeto utiliza um sistema de autenticação simulada (Mock Auth) baseado em 
 * localStorage no lado do cliente, o middleware do Supabase no servidor foi desabilitado 
 * para evitar redirecionamentos incorretos para rotas inexistentes (como '/entrar') 
 * que resultam em erros 404.
 * 
 * O controle de rotas protegidas é realizado no lado do cliente (client-side) nos hooks
 * useEffect das respectivas páginas (/dashboard, /cursos, /negocio, etc.) redirecionando
 * para '/auth' quando necessário.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Aplicar pass-through em todas as rotas
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
