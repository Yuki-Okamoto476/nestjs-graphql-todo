import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Task } from '../types/task';
import { EditTask } from './EditTask';
import { DeleteTask } from './DeleteTask';
import { Stack } from '@mui/material';

type TaskTableProps = {
  tasks?: Task[];
  userId: number;
};

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, userId }) => {
  return (
    <TableContainer component={Paper} sx={{ width: '80%', m: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow
              key={task.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {task.name}
              </TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                <Stack spacing={2} direction='row' justifyContent='flex-end'>
                  <EditTask task={task} userId={userId} />
                  <DeleteTask id={task.id} userId={userId}/>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
