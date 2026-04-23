// Login page bypasses the admin sidebar layout
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
