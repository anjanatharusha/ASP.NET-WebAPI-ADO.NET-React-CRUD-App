import { useState } from 'react';
import {
    Box,
    CssBaseline,
    Container,
    Typography
} from '@mui/material';
import {
    ThemeProvider,
    createTheme
} from '@mui/material/styles';
import {
    Routes,
    Route,
    Link
} from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import DepartmentComponent from './Components/DepartmentComponent';
import EmployeeComponent from './Components/EmployeeComponent';

function App() {
    const theme = createTheme({ palette: 'light' });

    const [navigation, setNavigation] = useState('employees');

    const handleNavigation = (event, newNavigation) => {
        if (newNavigation !== null) {
            setNavigation(newNavigation);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="xl"> 
                <Box
                    sx={{
                        marginTop: 5, 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: '100vh', 
                        alignContent: 'center'
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="center"
                        p={2}
                        sx={{
                            width: '100%',
                            marginBottom: 7
                        }}>

                        <ToggleButtonGroup
                            color="primary"
                            value={navigation}
                            exclusive
                            onChange={handleNavigation}
                            aria-label="navigation"
                        >
                            <ToggleButton value="employees" aria-label="employees" component={Link} to="/employees" >
                                <WorkIcon />
                                <Typography
                                    sx={{ ml: 1 }}
                                    fontWeight="bold"
                                    variant="body2"
                                >
                                    Manage Employees
                                </Typography>
                            </ToggleButton>
                            <ToggleButton value="departments" aria-label="departments" component={Link} to="/departments">
                                <BusinessIcon />
                                <Typography
                                    sx={{ ml: 1 }}
                                    fontWeight="bold"
                                    variant="body2"
                                >
                                    Manage Departments
                                </Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Routes>
                        <Route path="/" element={<EmployeeComponent />} />
                        <Route path="/employees" element={<EmployeeComponent />} />
                        <Route path="/departments" element={<DepartmentComponent />} />
                    </Routes>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;