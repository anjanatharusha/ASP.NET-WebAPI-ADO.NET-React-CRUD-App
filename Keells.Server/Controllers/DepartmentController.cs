using Keells.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Keells.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly string _connectionString = "Server=LAPTOP-LSCEAEUJ\\SQLEXPRESS;Database=Keells;Trusted_Connection=True;TrustServerCertificate=True;";

        [HttpGet]
        public IActionResult GetDepartments()
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

        [HttpPost]
        public IActionResult AddDepartment([FromBody] DepartmentModel department)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            var command = new SqlCommand("INSERT INTO Departments (DepartmentCode, DepartmentName) VALUES (@code, @name)", connection);
            command.Parameters.AddWithValue("@code", department.DepartmentCode);
            command.Parameters.AddWithValue("@name", department.DepartmentName);
            command.ExecuteNonQuery();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, [FromBody] DepartmentModel department)
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

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();
            var command = new SqlCommand("DELETE FROM Departments WHERE DepartmentId = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            command.ExecuteNonQuery();
            return Ok();
        }
    }
}
