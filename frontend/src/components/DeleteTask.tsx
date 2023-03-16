import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@apollo/client';
import { DELETE_TASK } from '../queries/taskMutations';
import { FC } from 'react';
import { GET_TASKS } from '../queries/taskQueries';
import { useNavigate } from 'react-router-dom';

type DeleteTaskProps = {
  id: number;
  userId: number;
};

export const DeleteTask: FC<DeleteTaskProps> = ({ id, userId }) => {
  const navigate = useNavigate();
  const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK);

  const handleDeleteTask = async () => {
    try {
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      });
      alert('タスクが削除されました');
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        localStorage.getItem('token');
        alert('トークンの有効期限が切れました。サインイン画面に遷移します。');
        navigate('/signin');
        return;
      }
      alert('タスクの削除に失敗しました');
    }
  };

  return (
    <div>
      <Tooltip title='削除'>
        <IconButton onClick={handleDeleteTask}>
          <DeleteIcon color='action' />
        </IconButton>
      </Tooltip>
    </div>
  );
};
