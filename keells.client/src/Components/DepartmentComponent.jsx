import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const departmentSchema = z.object({
    departmentCode: z.string().min(1, 'Department code is required'),
    departmentName: z.string().min(1, 'Department name is required'),
});

const DepartmentComponent = () => {
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const { control, handleSubmit, reset } = useForm({
        resolver: zodResolver(departmentSchema),
        defaultValues: { departmentCode: "", departmentName: "" }
    });

    const fetchDepartments = async () => {
        try {
            const response = await fetch('department');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                await fetch(`department/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } else {
                await fetch('department', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }
            fetchDepartments();
            reset();
            setOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handleEdit = (department) => {
        reset(department);
        setEditId(department.departmentId);
        setIsEditing(true);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`department/${id}`, {
                method: 'DELETE',
            });
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    return (
        <Box>
            <Button variant="contained" onClick={() => { reset({ departmentCode: "", departmentName: "" }); setOpen(true); setIsEditing(false); }}>
                Add Department
            </Button>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Department Code</TableCell>
                            <TableCell>Department Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((department) => (
                            <TableRow key={department.departmentId}>
                                <TableCell>{department.departmentCode}</TableCell>
                                <TableCell>{department.departmentName}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(department)}>
                                        Edit
                                    </Button>
                                    <Button color="error" onClick={() => handleDelete(department.departmentId)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Department</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="departmentCode"
                            control={control}
                            render={({ field }) => (
                                <TextField label="Department Code" fullWidth {...field} />
                            )}
                        />
                        <Controller
                            name="departmentName"
                            control={control}
                            render={({ field }) => (
                                <TextField label="Department Name" fullWidth {...field} />
                            )}
                        />
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default DepartmentComponent;                           