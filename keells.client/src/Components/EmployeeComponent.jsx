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
    Select,
    MenuItem,
    Typography,
    Grid,
    Container,
    Paper,
    Stack,
    Snackbar,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

//const employeeSchema = (isEditing = false, editEmail = null) =>
//    z.object({
//        firstName: z.string().min(1, 'First name is required'),
//        lastName: z.string().min(1, 'Last name is required'),
//        email: z
//            .string()
//            .min(1, 'Email is required')
//            .email('Invalid email address')
//            .refine(async (email) => {
//                //const isEditing = parent?.isEditing; 
//                //const editEmail = parent?.editEmail;
//                if (email == editEmail) {
//                    return true;
//                }
//                const response = await fetch(`employee/check-email?email=${email}`);
//                const result = await response.json();
//                //if (!result.exists) {
//                //    return true;
//                //}
//                return !result.exists; // Validation passes if email does NOT exist
//            }, {
//                message: 'This email is already registered',
//            }),
//        dateOfBirth: z.string().min(1, 'Date of birth is required'),
//        salary: z
//            .number({ message: "Salary is required" })
//            .min(0, 'Salary must not be negative')
//            .nonnegative(),
//        //salary: z
//        //    .string()
//        //    .transform((val) => Number(val))
//        //    .refine((val) => !isNaN(val) && val > 0, {
//        //        message: 'Salary must be a positive number',
//        //    }),
//        departmentId: z
//            .number({ message: "Department is required" })
//            .positive(),
//        //isEditing: z.boolean().optional(),
//        //editEmail: z.string().optional()
//    });

const EmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editEmail, setEditEmail] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const employeeSchema = 
        z.object({
            firstName: z.string().min(1, 'First name is required'),
            lastName: z.string().min(1, 'Last name is required'),
            email: z
                .string()
                .min(1, 'Email is required')
                .email('Invalid email address')
                .refine(async (email) => {
                    if (isEditing && email.trim().toLowerCase() === editEmail.trim().toLowerCase()) {
                        return true;
                    }
                    const response = await fetch(`api/employee/check-email?email=${email}`);
                    const result = await response.json();
                    return !result.exists; // Validation passes if email does NOT exist
                }, {
                    message: 'This email is already registered',
                }),
            dateOfBirth: z
                .string()
                .min(1, 'Date of birth is required')
                .refine((date) => new Date(date) <= new Date(), {
                    message: 'Date of birth cannot be in the future',
                }),
            salary: z
                .number({ message: "Salary is required" })
                .min(0, 'Salary must not be negative')
                .nonnegative(),
            departmentId: z
                .number({ message: "Department is required" })
                .positive()
        });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(employeeSchema),
        mode: 'all',
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            salary: "",
            departmentId: ""
        }
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch('api/employee');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('api/department');
            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                const response = await fetch(`api/employee/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                switch (response.status) {
                    case 200:
                        showSnackbar('Employee updated successfully!');
                        break;
                    default:
                        showSnackbar('Failed to update employee. Please try again later.', 'error');
                        break;
                }
            } else {
                const response = await fetch('api/employee', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                switch (response.status) {
                    case 200:
                        showSnackbar('Employee added successfully!');
                        break;
                    default:
                        showSnackbar('Failed to add employee. Please try again later.', 'error');
                        break;
                }
            }
            fetchEmployees();
            reset();
            setOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving employee:', error);
            showSnackbar('Failed to save employee. Please try again later.', 'error');
        }
    };

    const handleEdit = (employee) => {
        reset(employee);
        setEditId(employee.employeeId);
        setEditEmail(employee.email);
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
            const response = await fetch(`api/employee/${deleteId}`, {
                method: 'DELETE',
            });
            setConfirmOpen(false); 
            setDeleteId(null);
            switch (response.status) {
                case 200:
                    showSnackbar('Employee deleted successfully!');
                    break;
                default:
                    showSnackbar('Failed to delete employee. Please try again later.', 'error');
                    break;
            }
            fetchEmployees(); 
        } catch (error) {
            console.error('Error deleting employee:', error);
            showSnackbar('Failed to delete employee. Please try again later.', 'error');
        }
    };

    return (
        <>
            <Container maxWidth="lg"> 
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => {
                    reset({
                        defaultValues: {
                            firstName: "",
                            lastName: "",
                            email: "",
                            dateOfBirth: "",
                            salary: "",
                            departmentId: ""
                        }
                    });
                    setOpen(true);
                    setIsEditing(false);
                }}>
                    Add Employee
                </Button>
                <Paper sx={{ mt: 3, p: 2 }}> 
                    <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Age (yrs)</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.employeeId}>
                                    <TableCell>{employee.firstName}</TableCell>
                                    <TableCell>{employee.lastName}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.dateOfBirth}</TableCell>
                                    <TableCell>{employee.age}</TableCell>
                                    <TableCell>{employee.salary}</TableCell>
                                    <TableCell>{departments.find(d => d.departmentId === employee.departmentId)?.departmentName || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() => handleEdit(employee)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteClick(employee.employeeId)}
                                            >
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
            </Container>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmOpen}
                onClose={handleCancelDelete}
            >
                <Box p={2} >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this employee? This action cannot be undone.
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


            {/* Employee Form */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{isEditing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
                <DialogContent>
                    <FormProvider>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box p={1} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <Controller
                                            name="firstName"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <TextField
                                                    label="First Name"
                                                    fullWidth
                                                    {...field}
                                                    inputProps={{
                                                        max: new Date().toISOString().split("T")[0], // Set today's date as max
                                                    }}
                                                    error={!!errors.firstName}
                                                    helperText={errors.firstName?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <Controller
                                            name="lastName"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <TextField
                                                    label="Last Name"
                                                    fullWidth
                                                    {...field}
                                                    error={!!errors.lastName}
                                                    helperText={errors.lastName?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <Controller
                                            name="email"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <TextField
                                                    label="Email"
                                                    fullWidth
                                                    {...field}
                                                    error={!!errors.email}
                                                    helperText={errors.email?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <Controller
                                            name="dateOfBirth"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <TextField
                                                    label="Date of Birth"
                                                    type="date"
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    inputProps={{
                                                        max: new Date().toISOString().split("T")[0], // Set today's date as max
                                                    }}
                                                    {...field}
                                                    error={!!errors.dateOfBirth}
                                                    helperText={errors.dateOfBirth?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <Controller
                                            name="salary"
                                            control={control}
                                            defaultValue={0}
                                            setValueAs={(value) => {
                                                const parsedValue = parseInt(value, 10);
                                                if (isNaN(parsedValue)) {
                                                    return null; // Return null for invalid input (empty or non-numeric)
                                                }
                                                return parsedValue >= 0 ? parsedValue : null; // Only accept positive values
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    label="Salary"
                                                    type="number"
                                                    fullWidth
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    error={!!errors.salary}
                                                    helperText={errors.salary?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <Typography variant="caption" >
                                            Department
                                        </Typography>
                                        <Controller
                                            name="departmentId"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    fullWidth
                                                    value={field.value || ''}
                                                    error={!!errors.departmentId}
                                                    helperText={errors.departmentId?.message}
                                                >
                                                    {departments.map((department) => (
                                                        <MenuItem key={department.departmentId} value={department.departmentId}>
                                                            {department.departmentName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        {errors.departmentId && (
                                            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                                {errors.departmentId.message}
                                            </Typography>
                                        )}
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
                    </FormProvider>
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
        </>
    );
};

export default EmployeeComponent;
