import { useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import { createTask, updateTask } from "./api";

function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function TaskDialog({ project, task, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: task?.title ?? "",
    effort_hours: String(Number(((task?.effort_minutes ?? 60) / 60).toFixed(2))),
    end_date: task?.end_date ?? (project.start_date > today() ? project.start_date : today()),
    priority: String(task?.priority ?? 3),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function change(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    const input = {
      title: form.title.trim(),
      effort_minutes: Math.round(Number(form.effort_hours) * 60),
      end_date: form.end_date,
      priority: Number(form.priority),
    };
    if (
      !input.title ||
      form.effort_hours === "" ||
      !Number.isInteger(input.effort_minutes) ||
      input.effort_minutes < 0 ||
      input.effort_minutes > 2147483647
    ) {
      setError("Проверьте название и трудоёмкость задачи.");
      return;
    }
    if (input.end_date < project.start_date) {
      setError("Срок задачи не может быть раньше даты начала проекта.");
      return;
    }
    setSaving(true);
    try {
      if (task) await updateTask(project.id, task.id, input);
      else await createTask(project.id, input);
      onSaved();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось сохранить задачу.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="task-dialog-title"
    >
      <form onSubmit={submit}>
        <DialogTitle id="task-dialog-title">
          {task ? "Изменить задачу" : "Добавить задачу"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: "12px !important" }}>
          <div className="dialog-project">Проект: {project.name}</div>
          <label className="form-label" htmlFor="task-title">
            Название *
            <TextField
              id="task-title"
              value={form.title}
              onChange={change("title")}
              required
              inputProps={{ maxLength: 160 }}
              fullWidth
            />
          </label>
          <label className="form-label" htmlFor="task-effort">
            Трудоёмкость, ч *
            <TextField
              id="task-effort"
              type="number"
              value={form.effort_hours}
              onChange={change("effort_hours")}
              required
              inputProps={{ min: 0, max: 35791394.12, step: 0.01 }}
              fullWidth
            />
          </label>
          <label className="form-label" htmlFor="task-date">
            Срок *
            <TextField
              id="task-date"
              type="date"
              value={form.end_date}
              onChange={change("end_date")}
              required
              inputProps={{ min: project.start_date }}
              fullWidth
            />
          </label>
          <label className="form-label" htmlFor="task-priority">
            Приоритет
            <TextField
              id="task-priority"
              select
              value={form.priority}
              onChange={change("priority")}
              fullWidth
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <MenuItem key={value} value={String(value)}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </label>
          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" color="info" disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
