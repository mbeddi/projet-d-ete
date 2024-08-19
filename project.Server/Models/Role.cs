namespace project.Server.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; } // Utilisation de `nvarchar(max)` qui est spécifique à SQL Server
    }


}
