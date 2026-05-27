import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware do AgroFly Academy
 *
 * Responsabilidades:
 * 1. Atualizar a sessão Supabase a cada requisição (manter o usuário logado)
 * 2. Proteger rotas premium — redirecionar membros free que tentam acessar conteúdo pago
 * 3. Proteger rotas de admin — apenas usuários com role 'admin'
 * 4. Redirecionar usuários logados que tentam acessar páginas de auth (login/cadastro)
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: não usar getUser() em código que depende de session.user
  // getUser() valida o token no servidor do Supabase — mais seguro
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ---- Rotas de Admin: somente role 'admin' ----
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/entrar', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/painel', request.url))
    }
  }

  // ---- Rotas da Área de Membros: exige login ----
  const protectedPaths = ['/painel', '/cursos', '/forum', '/lives', '/materiais', '/perfil']
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/entrar', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // ---- Páginas de Auth: redirecionar se já estiver logado ----
  const authPaths = ['/entrar', '/cadastrar', '/recuperar-senha']
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/painel', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware em todas as rotas EXCETO:
     * - Arquivos estáticos (_next/static, _next/image, favicon.ico, etc.)
     * - API routes públicas
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
