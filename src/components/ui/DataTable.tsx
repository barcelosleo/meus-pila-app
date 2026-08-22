import { type ReactNode, useCallback, useMemo, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowId,
  type GridSortModel,
} from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  type SxProps,
  TextField,
  type Theme,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  AddIcon,
  ClearIcon,
  DeleteIcon,
  EditIcon,
  RefreshIcon,
  SearchIcon,
  VisibilityIcon,
  WarningIcon,
} from "./icons";

export interface DeleteConfirmationConfig<T> {
  title?: string;
  getMessage?: (row: T) => ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface DataTableProps<T extends Record<string, any>> {
  // Data
  rows: T[];
  columns: GridColDef<T>[];
  totalCount?: number;
  loading?: boolean;
  getRowId?: (row: T) => GridRowId;

  // Pagination & Sorting
  paginationMode?: "client" | "server";
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];
  sortingMode?: "client" | "server";
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;

  // Header configuration
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  totalCountLabel?: string;
  totalCountLabelPlural?: string;
  hideHeader?: boolean;
  headerActions?: ReactNode;

  // Search
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  hideSearch?: boolean;

  // Refresh
  onRefresh?: () => void;
  refreshTooltip?: string;
  hideRefresh?: boolean;

  // Add / Create
  onAdd?: () => void;
  addButtonLabel?: string;
  addButtonIcon?: ReactNode;
  hideAddButton?: boolean;

  // CRUD Actions
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void | Promise<void>;
  onView?: (row: T) => void;
  renderExtraRowActions?: (row: T) => ReactNode;
  actionsColumnWidth?: number;
  actionsColumnHeaderName?: string;
  disableAutoActionsColumn?: boolean;

  // Delete Confirmation Dialog
  deleteConfirmation?: DeleteConfirmationConfig<T> | false;

  // Empty State
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyActionLabel?: string;

  // Styling & DataGrid passthrough
  autoHeight?: boolean;
  density?: "compact" | "standard" | "comfortable";
  cardSx?: SxProps<Theme>;
  gridSx?: SxProps<Theme>;
}

export function DataTable<T extends Record<string, any>>({
  rows,
  columns,
  totalCount,
  loading = false,
  getRowId = (row) => row.id as GridRowId,

  paginationMode = "server",
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 25, 50],
  sortingMode = "server",
  sortModel,
  onSortModelChange,

  title,
  subtitle,
  icon,
  totalCountLabel = "item",
  totalCountLabelPlural = "itens",
  hideHeader = false,
  headerActions,

  searchQuery,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  hideSearch = false,

  onRefresh,
  refreshTooltip = "Recarregar dados",
  hideRefresh = false,

  onAdd,
  addButtonLabel = "Adicionar",
  addButtonIcon = <AddIcon />,
  hideAddButton = false,

  onEdit,
  onDelete,
  onView,
  renderExtraRowActions,
  actionsColumnWidth = 110,
  actionsColumnHeaderName = "Ações",
  disableAutoActionsColumn = false,

  deleteConfirmation,

  emptyTitle = "Nenhum registro encontrado",
  emptyDescription,
  emptyIcon,
  emptyActionLabel,

  autoHeight = true,
  density = "standard",
  cardSx,
  gridSx,
}: DataTableProps<T>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const displayTotalCount =
    typeof totalCount === "number" ? totalCount : rows.length;

  const countBadgeText = useMemo(() => {
    if (typeof totalCount !== "number") return null;
    const label = totalCount === 1 ? totalCountLabel : totalCountLabelPlural;
    return `${totalCount} ${label}`;
  }, [totalCount, totalCountLabel, totalCountLabelPlural]);

  const handleRequestDelete = useCallback(
    (row: T) => {
      if (deleteConfirmation === false) {
        onDelete?.(row);
        return;
      }
      setRowToDelete(row);
      setDeleteDialogOpen(true);
    },
    [deleteConfirmation, onDelete],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!rowToDelete || !onDelete) return;

    setDeleting(true);
    try {
      await onDelete(rowToDelete);
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Error during deletion:", error);
    } finally {
      setDeleting(false);
    }
  }, [onDelete, rowToDelete]);

  // Merge columns with auto CRUD action buttons if specified
  const effectiveColumns = useMemo<GridColDef<T>[]>(() => {
    const hasActions =
      !disableAutoActionsColumn &&
      Boolean(onEdit || onDelete || onView || renderExtraRowActions);

    if (!hasActions) {
      return columns;
    }

    const actionsCol: GridColDef<T> = {
      field: "__actions",
      headerName: actionsColumnHeaderName,
      width: actionsColumnWidth,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 0.75,
            width: "100%",
          }}
        >
          {onView && (
            <Tooltip title="Visualizar" arrow placement="top">
              <IconButton
                size="small"
                aria-label="Visualizar"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(params.row);
                }}
                sx={{
                  color: "text.secondary",
                  bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                  borderRadius: "8px",
                  p: 0.8,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: "text.primary",
                    color: "background.paper",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <VisibilityIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          )}

          {onEdit && (
            <Tooltip title="Editar" arrow placement="top">
              <IconButton
                size="small"
                aria-label="Editar"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(params.row);
                }}
                sx={{
                  color: "primary.main",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  borderRadius: "8px",
                  p: 0.8,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "#fff",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <EditIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          )}

          {onDelete && (
            <Tooltip title="Excluir" arrow placement="top">
              <IconButton
                size="small"
                aria-label="Excluir"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRequestDelete(params.row);
                }}
                sx={{
                  color: "error.main",
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                  borderRadius: "8px",
                  p: 0.8,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "#fff",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          )}

          {renderExtraRowActions?.(params.row)}
        </Box>
      ),
    };

    return [...columns, actionsCol];
  }, [
    columns,
    disableAutoActionsColumn,
    onEdit,
    onDelete,
    onView,
    renderExtraRowActions,
    actionsColumnHeaderName,
    actionsColumnWidth,
    handleRequestDelete,
  ]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #fcfdfe 100%)",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 2px 12px rgba(0,0,0,0.04)",
        ...cardSx,
      }}
    >
      {!hideHeader && (
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          {/* Header Row */}
          {(title || onAdd || headerActions) && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {icon && (
                  <Avatar
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                    }}
                  >
                    {icon}
                  </Avatar>
                )}
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    {typeof title === "string" ? (
                      <Typography
                        variant="h5"
                        component="h1"
                        sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
                      >
                        {title}
                      </Typography>
                    ) : (
                      title
                    )}

                    {countBadgeText && (
                      <Chip
                        size="small"
                        label={countBadgeText}
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                          borderRadius: "6px",
                        }}
                      />
                    )}
                  </Stack>
                  {subtitle && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.25 }}
                    >
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  alignSelf: { xs: "stretch", sm: "auto" },
                }}
              >
                {headerActions}

                {!hideAddButton && onAdd && (
                  <Button
                    variant="contained"
                    startIcon={addButtonIcon}
                    onClick={onAdd}
                    sx={{
                      borderRadius: 2,
                      px: 2.5,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      boxShadow: (theme) =>
                        `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                      "&:hover": {
                        boxShadow: (theme) =>
                          `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                      },
                      flexGrow: { xs: 1, sm: 0 },
                    }}
                  >
                    {addButtonLabel}
                  </Button>
                )}
              </Box>
            </Stack>
          )}

          {(!hideSearch || !hideRefresh) && (
            <>
              {(title || onAdd || headerActions) && (
                <Divider sx={{ mb: 2.5 }} />
              )}

              {/* Search & Refresh Actions Bar */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", sm: "center" },
                }}
              >
                {!hideSearch && onSearchChange && (
                  <TextField
                    size="small"
                    placeholder={searchPlaceholder}
                    value={searchQuery ?? ""}
                    onChange={(e) => onSearchChange(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery ? (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => onSearchChange("")}
                              edge="end"
                            >
                              <ClearIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      },
                    }}
                    sx={{
                      width: { xs: "100%", sm: 300, md: 360 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.04)"
                            : "#ffffff",
                      },
                    }}
                  />
                )}

                <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                  {!hideRefresh && onRefresh && (
                    <Tooltip title={refreshTooltip} arrow>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={onRefresh}
                        disabled={loading}
                        startIcon={
                          <RefreshIcon
                            sx={{
                              fontSize: 18,
                              animation: loading
                                ? "spin 1s linear infinite"
                                : "none",
                              "@keyframes spin": {
                                "0%": { transform: "rotate(0deg)" },
                                "100%": { transform: "rotate(360deg)" },
                              },
                            }}
                          />
                        }
                        sx={{
                          borderRadius: 2,
                          borderColor: "divider",
                          textTransform: "none",
                          fontWeight: 500,
                          color: "text.secondary",
                          "&:hover": {
                            borderColor: "primary.main",
                            color: "primary.main",
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                      >
                        Atualizar
                      </Button>
                    </Tooltip>
                  )}
                </Box>
              </Stack>
            </>
          )}
        </CardContent>
      )}

      {/* Loading Bar */}
      {loading && <LinearProgress sx={{ height: 2 }} />}

      {/* DataGrid */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid<T>
          rows={rows}
          columns={effectiveColumns}
          rowCount={displayTotalCount}
          loading={loading}
          getRowId={getRowId}
          density={density}
          pagination
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortingMode={sortingMode}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          pageSizeOptions={pageSizeOptions}
          disableRowSelectionOnClick
          autoHeight={autoHeight}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  py: 8,
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.04)",
                    color: "text.secondary",
                  }}
                >
                  {emptyIcon || <SearchIcon sx={{ fontSize: 28 }} />}
                </Avatar>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {emptyTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: 380,
                    textAlign: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  {emptyDescription ??
                    (searchQuery
                      ? `Nenhum resultado para "${searchQuery}". Verifique a ortografia ou limpe os filtros.`
                      : "Nenhum item cadastrado no momento.")}
                </Typography>
                {!searchQuery && onAdd && !hideAddButton && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={addButtonIcon}
                    onClick={onAdd}
                    sx={{
                      mt: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {emptyActionLabel || addButtonLabel}
                  </Button>
                )}
              </Box>
            ),
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.03)"
                  : "#f8fafc",
              borderBottom: "1px solid",
              borderColor: "divider",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "text.secondary",
            },
            "& .MuiDataGrid-row": {
              transition: "background-color 0.15s ease",
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.04)"
                    : alpha(theme.palette.primary.main, 0.04),
              },
              "&.Mui-selected": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.22)
                      : alpha(theme.palette.primary.main, 0.12),
                },
              },
            },
            "& .MuiDataGrid-cell": {
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              py: 1.5,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.02)"
                  : "#fafbfc",
            },
            ...gridSx,
          }}
        />
      </Box>

      {/* Generic Delete Confirmation Dialog */}
      {deleteConfirmation !== false && onDelete && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                p: 1,
                maxWidth: 420,
                width: "100%",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.2)",
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              pb: 1,
              pt: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.2)
                    : alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                width: 44,
                height: 44,
              }}
            >
              <WarningIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: "1.1rem" }}
              >
                {deleteConfirmation?.title ?? "Confirmar exclusão"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Esta ação não poderá ser desfeita
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            {rowToDelete && (
              <Typography variant="body2" color="text.secondary">
                {deleteConfirmation?.getMessage ? (
                  deleteConfirmation.getMessage(rowToDelete)
                ) : (
                  <>
                    Tem certeza de que deseja remover este registro? Esta ação é
                    irreversível.
                  </>
                )}
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {deleteConfirmation?.cancelLabel ?? "Cancelar"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleting}
              startIcon={
                deleting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DeleteIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: (theme) =>
                  `0 4px 12px ${alpha(theme.palette.error.main, 0.35)}`,
              }}
            >
              {deleting
                ? "Excluindo..."
                : (deleteConfirmation?.confirmLabel ?? "Excluir")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
}
