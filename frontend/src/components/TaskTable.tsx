import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Task } from '../types/task';

type TaskTableProps = {
  tasks?: Task[];
  userId: number;
};

export default function TaskTable({ tasks, userId }: TaskTableProps) {
  return (
    <TableContainer component={Paper} sx={{ width: '80%', m: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell align='right'>Due Date</TableCell>
            <TableCell align='right'>Status</TableCell>
            <TableCell align='right'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks?.map(({ id, name, dueDate, status}) => (
            <TableRow
              key={id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {name}
              </TableCell>
              <TableCell align='right'>{dueDate}</TableCell>
              <TableCell align='right'>{status}</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
