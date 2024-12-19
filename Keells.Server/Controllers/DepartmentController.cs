using Keells.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Keells.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly string _connectionString = "Server=LAPTOP-LSCEAEUJ\\SQLEXPRESS;Database=Keells;Trusted_Connection=True;TrustServerCertificate=True;";

        [HttpGet]
        public IActionResult GetDepartments()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();
                var command = new SqlCommand("SELECT * FROM Departments", connection);
                var reader = command.ExecuteReader();

                var departments = new List<DepartmentModel>();
                while (reader.Read())
                {
                    departments.Add(new DepartmentModel
                    {
                        DepartmentId = (int)reader["DepartmentId"],
                        DepartmentCode = reader["DepartmentCode"].ToString(),
                        DepartmentName = reader["DepartmentName"].ToString()
                    });
                }
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error quering department", error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult AddDepartment([FromBody] DepartmentModel department)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();
                var command = new SqlCommand("INSERT INTO Departments (DepartmentCode, DepartmentName) VALUES (@code, @name)", connection);
                command.Parameters.AddWithValue("@code", department.DepartmentCode);
                command.Parameters.AddWithValue("@name", department.DepartmentName);
                command.ExecuteNonQuery();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error inseting department", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, [FromBody] DepartmentModel department)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();
                var command = new SqlCommand("UPDATE Departments SET DepartmentCode = @code, DepartmentName = @name WHERE DepartmentId = @id", connection);
                command.Parameters.AddWithValue("@code", department.DepartmentCode);
                command.Parameters.AddWithValue("@name", department.DepartmentName);
                command.Parameters.AddWithValue("@id", id);
                command.ExecuteNonQuery();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating department", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            try{
                using var connection = new SqlConnection(_connectionString);
                connection.Open();
                var command = new SqlCommand("DELETE FROM Departments WHERE DepartmentId = @id", connection);
                command.Parameters.AddWithValue("@id", id);
                command.ExecuteNonQuery();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting department", error = ex.Message });
            }
        }

        [HttpGet("check-deptCode")]
        public IActionResult CheckDepartmentCode(string deptCode)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();
                var command = new SqlCommand("SELECT COUNT(*) FROM Departments WHERE DepartmentCode = @deptCode", connection);
                command.Parameters.AddWithValue("@deptCode", deptCode);
                var exists = (int)command.ExecuteScalar() > 0;
                return Ok(new { exists }); // { exists: true/false }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error validating department code.", error = ex.Message });
            }
        }
    }
}
