import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../authentication";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Typography,
  alpha,
} from "@mui/material";
import { EmptyState, GroupIcon } from "../../../components/ui";
import type { Group, PaginatedGroups } from "../data/group";
import { formatDateTime } from "../../../utils/formatters";

// Restricted, read-only view of groups the signed-in user owns.
export const MyGroupsView = () => {
  const { api, user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMyGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedGroups>(
        `/group?pageNumber=1&pageSize=100`,
      );
      setGroups(response.items.filter((group) => group.ownerId === user?.id));
      setError(false);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [api, user?.id]);

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  const emptyState = useMemo(
    () => (
      <EmptyState
        title="Nenhum grupo encontrado"
        description="Você ainda não possui grupos."
        icon={<GroupIcon sx={{ fontSize: 30 }} />}
      />
    ),
    [],
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        Meus Grupos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Grupos dos quais você é proprietário.
      </Typography>

      {!loading && !error && groups.length === 0 && emptyState}

      <Grid container spacing={2}>
        {groups.map((group) => {
          const formatted = formatDateTime(group.createdAt);
          return (
            <Grid key={group.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.12),
                        color: "primary.main",
                      }}
                    >
                      {group.name.charAt(0).toUpperCase()}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {group.name}
                    </Typography>
                  </Box>
                  {formatted && (
                    <Typography variant="caption" color="text.secondary">
                      Criado em {formatted.date}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={error}
        autoHideDuration={4000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Erro ao carregar seus grupos.
        </Alert>
      </Snackbar>
    </Box>
  );
};
