import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
      <title>Meus Pila</title>
      <div>
        <h1>Auth Layout</h1>
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
