// El middleware redirige "/" hacia /login, /hoy o /admin según la sesión y el rol.
// Este componente es un fallback mínimo por si Next necesita renderizar antes del redirect.
export default function RootPage() {
  return null;
}
