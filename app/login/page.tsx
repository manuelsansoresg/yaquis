import { LoginForm } from "@/components/login-form";
export const metadata = { title: "Iniciar sesión" };
export default function LoginPage() {
  return (
    <div className="container-shell page-content">
      <LoginForm />
    </div>
  );
}
