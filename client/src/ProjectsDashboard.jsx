import { useEffect, useMemo, useRef, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
} from "@mui/material";
import {
  InfiniteRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  RowStyleModule,
  TextFilterModule,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import AppHeader from "./AppHeader";
import TaskDialog from "./TaskDialog";
import { deleteTask, listProjects, listTasks } from "./api";

ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  NumberFilterModule,
  RowApiModule,
  RowStyleModule,
  TextFilterModule,
]);

const gridTheme = themeQuartz.withParams({
  accentColor: "#17c1e8",
  headerBackgroundColor: "#f8f9fa",
  borderColor: "#e9ecef",
  fontFamily: "Roboto, Arial, sans-serif",
  fontSize: 13,
  spacing: 8,
});
const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" });
const hours = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
const date = (value) => (value ? new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU") : "");

const projectColumns = [
  { field: "id", headerName: "ID", width: 85 },
  { field: "name", headerName: "Проект", flex: 1, minWidth: 200 },
  {
    field: "budget_kopecks",
    headerName: "Бюджет",
    width: 150,
    valueFormatter: ({ value }) => money.format(Number(value ?? 0) / 100),
  },
  {
    field: "start_date",
    headerName: "Дата начала",
    width: 145,
    valueFormatter: ({ value }) => date(value),
  },
  { field: "priority", headerName: "Приоритет", width: 115 },
];
const taskColumns = [
  { field: "id", headerName: "ID", width: 85 },
  { field: "title", headerName: "Задача", flex: 1, minWidth: 220 },
  {
    colId: "effort_hours",
    headerName: "Трудоёмкость, ч",
    width: 165,
    valueGetter: ({ data }) => (data ? data.effort_minutes / 60 : null),
    valueFormatter: ({ value }) => (value == null ? "" : `${hours.format(value)} ч`),
  },
  { field: "end_date", headerName: "Срок", width: 125, valueFormatter: ({ value }) => date(value) },
  { field: "priority", headerName: "Приоритет", width: 115 },
];
const projectDefaults = { resizable: true, sortable: false, filter: false };
const taskDefaults = { resizable: true, sortable: true, filter: true };

export default function ProjectsDashboard({ username, onLogout, logoutError }) {
  const projectsGrid = useRef(null);
  const tasksGrid = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [totalProjects, setTotalProjects] = useState(null);
  const [projectError, setProjectError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dialog, setDialog] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const selectedProjectId = selectedProject?.id;
  const selectedTaskId = selectedTask?.id;

  const datasource = useMemo(
    () => ({
      async getRows(params) {
        try {
          const result = await listProjects(params.endRow - params.startRow, params.startRow);
          setTotalProjects(result.meta.total);
          setProjectError("");
          params.successCallback(result.data, result.meta.total);
        } catch (error) {
          setProjectError(error instanceof Error ? error.message : "Не удалось загрузить проекты.");
          params.failCallback();
        }
      },
    }),
    []
  );

  useEffect(() => {
    projectsGrid.current?.api?.redrawRows();
  }, [selectedProjectId]);

  useEffect(() => {
    tasksGrid.current?.api?.redrawRows();
  }, [selectedTaskId, tasks]);

  useEffect(() => {
    if (!selectedProjectId) return;
    let active = true;
    listTasks(selectedProjectId)
      .then((rows) => {
        if (!active) return;
        setTasks(rows);
        setSelectedTask((current) => rows.find((row) => row.id === current?.id) ?? rows[0] ?? null);
      })
      .catch((error) => {
        if (active)
          setTaskError(error instanceof Error ? error.message : "Не удалось загрузить задачи.");
      })
      .finally(() => {
        if (active) setLoadingTasks(false);
      });
    return () => {
      active = false;
    };
  }, [selectedProjectId, refreshKey]);

  function selectProject(project) {
    if (selectedProject?.id === project.id) return;
    setSelectedProject(project);
    setSelectedTask(null);
    setTasks([]);
    setLoadingTasks(true);
    setTaskError("");
  }

  async function removeTask() {
    if (!selectedProject || !selectedTask) return;
    setDeleting(true);
    setTaskError("");
    try {
      await deleteTask(selectedProject.id, selectedTask.id);
      setSelectedTask(null);
      setLoadingTasks(true);
      setRefreshKey((key) => key + 1);
      setConfirmDelete(false);
    } catch (error) {
      setTaskError(error instanceof Error ? error.message : "Не удалось удалить задачу.");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <AppHeader
        title="Проекты и задачи"
        username={username}
        onLogout={onLogout}
        logoutError={logoutError}
      />
      <SoftBox mb={3}>
        <SoftTypography variant="h4" fontWeight="bold">
          Проекты и задачи
        </SoftTypography>
        <SoftTypography variant="body2" color="text">
          Выберите проект, чтобы просмотреть и изменить его задачи.
        </SoftTypography>
      </SoftBox>

      <Card sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <SoftBox
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
          mb={2}
        >
          <SoftTypography variant="h6" fontWeight="bold">
            Проекты {totalProjects === null ? "" : `· ${totalProjects}`}
          </SoftTypography>
          <SoftTypography variant="caption" color="text">
            Новые записи загружаются при прокрутке
          </SoftTypography>
        </SoftBox>
        {projectError && (
          <Alert
            severity="error"
            role="alert"
            sx={{ mb: 2 }}
            action={
              <Button onClick={() => projectsGrid.current?.api?.purgeInfiniteCache()}>
                Повторить
              </Button>
            }
          >
            {projectError}
          </Alert>
        )}
        <div className="grid-container project-grid" aria-label="Таблица проектов">
          <AgGridReact
            ref={projectsGrid}
            theme={gridTheme}
            rowModelType="infinite"
            datasource={datasource}
            cacheBlockSize={50}
            maxBlocksInCache={4}
            columnDefs={projectColumns}
            defaultColDef={projectDefaults}
            onRowClicked={({ data }) => {
              if (data) selectProject(data);
            }}
            rowClassRules={{ "active-grid-row": ({ data }) => data?.id === selectedProject?.id }}
          />
        </div>
      </Card>

      <Card sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <SoftBox>
            <SoftTypography variant="h6" fontWeight="bold">
              Задачи {selectedProject ? `· ${tasks.length}` : ""}
            </SoftTypography>
            <SoftTypography variant="caption" color="text">
              {selectedProject
                ? `Проект: ${selectedProject.name}`
                : "Выберите проект в таблице выше"}
            </SoftTypography>
          </SoftBox>
          <SoftBox display="flex" flexWrap="wrap" gap={1}>
            <Button
              variant="contained"
              color="info"
              startIcon={<Icon>add</Icon>}
              disabled={!selectedProject}
              onClick={() => setDialog("create")}
            >
              Добавить запись
            </Button>
            <Button
              className="task-action task-action-edit"
              variant="outlined"
              color="info"
              startIcon={<Icon>edit</Icon>}
              disabled={!selectedTask}
              onClick={() => setDialog("edit")}
            >
              Изменить
            </Button>
            <Button
              className="task-action task-action-delete"
              variant="outlined"
              color="error"
              startIcon={<Icon>delete</Icon>}
              disabled={!selectedTask || deleting}
              onClick={() => setConfirmDelete(true)}
            >
              Удалить
            </Button>
          </SoftBox>
        </SoftBox>
        {taskError && (
          <Alert
            severity="error"
            role="alert"
            sx={{ mb: 2 }}
            action={
              selectedProject ? (
                <Button
                  onClick={() => {
                    setTaskError("");
                    setLoadingTasks(true);
                    setRefreshKey((key) => key + 1);
                  }}
                >
                  Повторить
                </Button>
              ) : undefined
            }
          >
            {taskError}
          </Alert>
        )}
        {loadingTasks && (
          <SoftTypography variant="caption" color="text">
            Загрузка задач…
          </SoftTypography>
        )}
        <div className="grid-container task-grid" aria-label="Таблица задач">
          <AgGridReact
            ref={tasksGrid}
            theme={gridTheme}
            rowData={tasks}
            columnDefs={taskColumns}
            defaultColDef={taskDefaults}
            getRowId={({ data }) => String(data.id)}
            onRowClicked={({ data }) => setSelectedTask(data ?? null)}
            rowClassRules={{ "active-grid-row": ({ data }) => data?.id === selectedTask?.id }}
            overlayNoRowsTemplate={
              selectedProject
                ? '<span class="empty-grid">У проекта пока нет задач</span>'
                : '<span class="empty-grid">Выберите проект</span>'
            }
          />
        </div>
      </Card>

      {dialog && selectedProject && (
        <TaskDialog
          key={`${dialog}-${selectedTask?.id ?? "new"}`}
          project={selectedProject}
          task={dialog === "edit" ? selectedTask : null}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            setSelectedTask(null);
            setLoadingTasks(true);
            setRefreshKey((key) => key + 1);
          }}
        />
      )}
      <Dialog
        open={confirmDelete}
        onClose={deleting ? undefined : () => setConfirmDelete(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Удалить задачу?</DialogTitle>
        <DialogContent>
          «{selectedTask?.title}» будет удалена из проекта «{selectedProject?.name}».
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} disabled={deleting}>
            Отмена
          </Button>
          <Button color="error" onClick={() => void removeTask()} disabled={deleting}>
            {deleting ? "Удаление…" : "Удалить"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
