import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Task } from '../types/task';
import { CREATE_TASK } from '../queries/taskMutations';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

type AddTaskProps = {
  userId: number;
};

export const AddTask: FC<AddTaskProps> = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      dueDate: '',
      description: '',
    },
  });

  const [createTask] = useMutation<{ createTask: Task }>(CREATE_TASK);
  const handleAddTask = async (data: {
    name: string;
    dueDate: string;
    description?: string;
  }) => {
    const createTaskInput = { ...data, userId };
    try {
      await createTask({
        variables: { createTaskInput },
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
      alert('タスクの登録に失敗しました');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant='contained'
        sx={{ width: '270px' }}
        onClick={handleClickOpen}
      >
        Add Task
      </Button>
      <Dialog fullWidth={true} maxWidth='sm' open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(handleAddTask)}>
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
            <Button type='submit'>Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
