import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
    Paper,
    Stack,
    Grid,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const DepartmentComponent = () => {
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editDepartmentCode, setEditDepartmentCode] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const departmentSchema = z.object({
        departmentCode: z
            .string()
            .min(1, 'Department code is required')
            .refine(async (departmentCode) => {
                if (isEditing && departmentCode.trim().toLowerCase() === editDepartmentCode.trim().toLowerCase()) {
                    return true;
                }
                const response = await fetch(`api/department/check-deptCode?deptCode=${departmentCode}`);
                const result = await response.json();
                return !result.exists; // Validation passes if code does NOT exist
            }, {
                message: 'Department code must be unique',
            }),
        departmentName: z.string().min(1, 'Department name is required'),
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(departmentSchema),
        mode: 'all',
        defaultValues: {
            departmentCode: "",
            departmentName: ""
        }
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('api/department');
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
                const response = await fetch(`api/department/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                switch (response.status) {
                    case 200:
                        showSnackbar('Department updated successfully!');
                        break;
                    default:
                        showSnackbar('Failed to update department. Please try again later.', 'error');
                        break;
                }
            } else {
                const response = await fetch('api/department', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                switch (response.status) {
                    case 200:
                        showSnackbar('Department added successfully!');
                        break;
                    default:
                        showSnackbar('Failed to add department. Please try again later.', 'error');
                        break;
                }
            }
            fetchDepartments();
            reset();
            setOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error submitting department data:', error);
            showSnackbar('Failed to save department. Please try again later.', 'error');
        }
    };

    const handleEdit = (department) => {
        reset(department);
        setEditId(department.departmentId);
        setEditDepartmentCode(department.departmentCode);
        setIsEditing(true);
        setOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`api/department/${deleteId}`, {
                method: 'DELETE',
            });
            setConfirmOpen(false);
            setDeleteId(null);
            switch(response.status) {
                case 200:
                    showSnackbar('Department deleted successfully!');
                    break;
                case 500:
                    showSnackbar('Unable to delete the department. It has registered employees.', 'error');
                    break;
                default:
                    showSnackbar('Failed to delete department. Please try again later.', 'error');
                    break;
            }
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
            showSnackbar('Failed to delete department. Please try again later.', 'error');
        }
    };

    return (
        <Container maxWidth="lg">
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => { reset({ departmentCode: "", departmentName: "" }); setOpen(true); setIsEditing(false); }}>
                Add Department
            </Button>

            <Paper sx={{ mt: 3, p: 2 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Department Code</TableCell>
                            <TableCell>Department Name</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((department) => (
                            <TableRow key={department.departmentId}>
                                <TableCell>{department.departmentCode}</TableCell>
                                <TableCell>{department.departmentName}</TableCell>
                                <TableCell align="center" >
                                    <Stack direction="row" spacing={2} justifyContent="center">
                                        <Button startIcon={<EditIcon />} onClick={() => handleEdit(department)}>
                                            Edit
                                        </Button>
                                        <Button startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteClick(department.departmentId)}>
                                            Delete
                                        </Button>
                                    </Stack>  
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>


            {/* Confirmation Dialog */}
            <Dialog
                open={confirmOpen}
                onClose={handleCancelDelete}
            >
                <Box p={2} >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography>
                                Are you sure you want to delete this department? This action cannot be undone.
                            </Typography>
                            <Typography variant="caption" color="warning">
                                Note: Departments which have registered employees cannot be deleted.
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Stack direction="row" spacing={2}>
                            <Button
                                color="primary"
                                variant="outlined"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </Button>

                            <Button
                                color="error"
                                variant="outlined"
                                onClick={handleConfirmDelete}
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </DialogActions>
                </Box>
            </Dialog>


            {/* Department Form */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{isEditing ? 'Edit Department' : 'Add Department'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box p={1} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Controller
                                    name="departmentCode"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            label="Department Code"
                                            fullWidth
                                            {...field}
                                            error={!!errors.departmentCode}
                                            helperText={errors.departmentCode?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <Controller
                                    name="departmentName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            label="Department Name"
                                            fullWidth
                                            {...field}
                                            error={!!errors.departmentName}
                                            helperText={errors.departmentName?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            </Grid>
                        </Box>
                        
                        <DialogActions>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<SaveIcon />}
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </Stack>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>


            {/* Snackbar for Status Alerts */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DepartmentComponent;                           