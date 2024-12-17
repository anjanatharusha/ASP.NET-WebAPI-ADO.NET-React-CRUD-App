using Keells.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Keells.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly string _connectionString = "Server=LAPTOP-LSCEAEUJ\\SQLEXPRESS;Database=Keells;Trusted_Connection=True;TrustServerCertificate=True;";

        [HttpGet]
        public IActionResult GetEmployees()
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            var command = new SqlCommand("SELECT EmployeeId, FirstName, LastName, Email, DateOfBirth, Salary, DepartmentId FROM Employees;", connection);
            var reader = command.ExecuteReader();

            var employees = new List<EmployeeModel>();
            while (reader.Read())
            {
                employees.Add(new EmployeeModel
                {
                    EmployeeId = (int)reader["EmployeeId"],
                    FirstName = reader["FirstName"].ToString(),
                    LastName = reader["LastName"].ToString(),
                    Email = reader["Email"].ToString(),
                    DateOfBirth = DateOnly.FromDateTime((DateTime)reader["DateOfBirth"]),
                    Salary = (decimal)reader["Salary"],
                    DepartmentId = (int)reader["DepartmentId"]
                });
            }
            return Ok(employees);
        }

        [HttpPost]
        public IActionResult AddEmployee([FromBody] EmployeeModel employee)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            var command = new SqlCommand("INSERT INTO Employees (FirstName, LastName, Email, DateOfBirth, Salary, DepartmentId) VALUES (@firstName, @lastName, @Email, @dob, @salary, @departmentId)", connection);
            command.Parameters.AddWithValue("@firstName", employee.FirstName);
            command.Parameters.AddWithValue("@lastName", employee.LastName);
            command.Parameters.AddWithValue("@Email", employee.Email);
            command.Parameters.AddWithValue("@dob", employee.DateOfBirth);
            command.Parameters.AddWithValue("@salary", employee.Salary);
            command.Parameters.AddWithValue("@departmentId", employee.DepartmentId);
            command.ExecuteNonQuery();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, [FromBody] EmployeeModel employee)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            var command = new SqlCommand("UPDATE Employees SET FirstName = @firstName, LastName = @lastName, Email = @Email, DateOfBirth = @dob, Salary = @salary, DepartmentId = @departmentId WHERE EmployeeId = @id", connection);
            command.Parameters.AddWithValue("@firstName", employee.FirstName);
            command.Parameters.AddWithValue("@lastName", employee.LastName);
            command.Parameters.AddWithValue("@Email", employee.Email);
            command.Parameters.AddWithValue("@dob", employee.DateOfBirth);
            command.Parameters.AddWithValue("@salary", employee.Salary);
            command.Parameters.AddWithValue("@departmentId", employee.DepartmentId);
            command.Parameters.AddWithValue("@id", id);
            command.ExecuteNonQuery();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            var command = new SqlCommand("DELETE FROM Employees WHERE EmployeeId = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            command.ExecuteNonQuery();
            return Ok();
        }

        [HttpGet("check-email")]
        public IActionResult CheckEmail(string email)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();
                var command = new SqlCommand("SELECT COUNT(*) FROM Employees WHERE Email = @Email", connection);
                command.Parameters.AddWithValue("@Email", email);
                var exists = (int)command.ExecuteScalar() > 0;
                return Ok(new { exists }); // { exists: true/false }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error validating email.", error = ex.Message });
            }
        }

    }
}
