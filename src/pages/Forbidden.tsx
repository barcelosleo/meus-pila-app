import { EmptyState, ShieldIcon } from "../components/ui";

const Forbidden = () => (
  <>
    <title>Meus Pila - Acesso Negado</title>
    <EmptyState
      title="Acesso negado"
      description="Você não tem permissão para acessar esta página."
      icon={<ShieldIcon sx={{ fontSize: 30 }} />}
    />
  </>
);

export default Forbidden;
