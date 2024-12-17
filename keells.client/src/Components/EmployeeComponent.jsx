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
    Select,
    MenuItem,
    Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const employeeSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .refine(async (email) => {
            const response = await fetch(`employee/check-email?email=${email}`);
            const result = await response.json();
            return !result.exists; // Validation passes if email does NOT exist
        }, {
            message: 'This email is already in use.',
        }),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    salary: z.number().positive().min(1, 'Salary must be a positive number'),
    //salary: z
    //    .string()
    //    .transform((val) => Number(val))
    //    .refine((val) => !isNaN(val) && val > 0, {
    //        message: 'Salary must be a positive number',
    //    }),
    departmentId: z.number().min(1, 'Department is required'),
});

const EmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            salary: "",
            departmentId: ""
        }
    });
    console.log("Validation Errors:", errors);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('employee');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('department');
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
        console.log("in onsubmit ");
        console.log(data);
        try {
            if (isEditing) {
                await fetch(`employee/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } else {
                await fetch('employee', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }
            fetchEmployees();
            reset();
            setOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    };

    const handleEdit = (employee) => {
        //reset({
        //    ...employee,
        //    salary: employee.salary.toString(),
        //});
        reset(employee);
        setEditId(employee.employeeId);
        setIsEditing(true);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`employee/${id}`, {
                method: 'DELETE',
            });
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <Box>
            <Button variant="contained" onClick={() => {
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
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.employeeId}>
                                <TableCell>{employee.firstName}</TableCell>
                                <TableCell>{employee.lastName}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.dateOfBirth}</TableCell>
                                <TableCell>{employee.salary}</TableCell>
                                <TableCell>{departments.find(d => d.departmentId === employee.departmentId)?.departmentName || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(employee)}>Edit</Button>
                                    <Button onClick={() => handleDelete(employee.employeeId)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{isEditing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    {...field}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="lastName"
                            control={control}
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
                        <Controller
                            name="email"
                            control={control}
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
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    {...field}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dob?.dateOfBirth}
                                />
                            )}
                        />
                        {errors.dateOfBirth && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {errors.dateOfBirth.message}
                            </Typography>
                        )}
                        <Controller
                            name="salary"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="Salary"
                                    type="number"
                                    fullWidth
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    error={!!errors.salary}
                                    helperText={errors.dob?.salary}
                                />
                            )}
                        />
                        {errors.salary && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {errors.salary.message}
                            </Typography>
                        )}
                        <Controller
                            name="departmentId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Department"
                                    {...field}
                                    fullWidth
                                    value={field.value || ''}
                                    error={!!errors.departmentId}
                                    helperText={errors.dob?.departmentId}
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
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {errors.departmentId.message}
                            </Typography>
                        )}
       
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

export default EmployeeComponent;
