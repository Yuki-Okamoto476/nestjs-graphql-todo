import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FC, useState } from 'react';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK } from '../queries/taskMutations';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Task } from '../types/task';
import { TaskStatus } from '../types/taskStatus';

type EditTaskProps = {
  task: Task;
  userId: number;
};

export const EditTask: FC<EditTaskProps> = ({ task, userId }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: task.name,
      dueDate: task.dueDate,
      status: task.status,
      description: task.description,
    },
  });

  const [updateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK);
  const handleEditTask = async (data: {
    name: string;
    dueDate: string;
    status?: TaskStatus;
    description?: string;
  }) => {
    const updateTaskInput = { ...data, id: task.id };
    try {
      await updateTask({
        variables: { updateTaskInput },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      });
      reset();
      setOpen(false);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        localStorage.getItem('token');
        alert('トークンの有効期限が切れました。サインイン画面に遷移します。');
        navigate('/signin');
        return;
      }
      alert('タスクの編集に失敗しました');
    }
  };

  const handleClickOpen = () => {
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title='編集'>
        <IconButton onClick={handleClickOpen}>
          <EditIcon color='action' />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth={true} maxWidth='sm' open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(handleEditTask)}>
          <DialogTitle>Add Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='normal'
              id='name'
              label='タイトル'
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', {
                required: { value: true, message: '名前は必須項目です' },
              })}
            />
            <TextField
              autoFocus
              margin='normal'
              id='dueDate'
              label='期日'
              placeholder='yyyy-mm-dd'
              fullWidth
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              {...register('dueDate', {
                required: { value: true, message: '期日は必須項目です' },
                pattern: {
                  value: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                  message: 'yyyy-mm-dd形式で入力してください',
                },
              })}
            />
            <FormControl fullWidth margin='normal'>
              <InputLabel id='task-status-label'>Status</InputLabel>
              <Select
                labelId='task-status-label'
                id='task-status'
                label='Status'
                defaultValue={task.status}
                {...register('status')}
              >
                <MenuItem value={'NOT_STARTED'}>Not Started</MenuItem>
                <MenuItem value={'IN_PROGRESS'}>In Progress</MenuItem>
                <MenuItem value={'COMPLETED'}>Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin='normal'
              id='description'
              label='説明'
              fullWidth
              multiline
              rows={4}
              {...register('description')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit'>Edit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
