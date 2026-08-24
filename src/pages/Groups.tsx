import { GroupsTable, MyGroupsView } from "../features/groups";
import { ROLES, useAuth } from "../features/authentication";

export const GroupsPage = () => {
  const { hasRole } = useAuth();

  return (
    <>
      <title>Meus Pila - Grupos</title>
      {hasRole([ROLES.ADMIN]) ? <GroupsTable /> : <MyGroupsView />}
    </>
  );
};
