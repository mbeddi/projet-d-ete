using Microsoft.EntityFrameworkCore;

namespace project.Server.Data
{
    using Microsoft.EntityFrameworkCore;
    using project.Server.Models;

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
    }

}
