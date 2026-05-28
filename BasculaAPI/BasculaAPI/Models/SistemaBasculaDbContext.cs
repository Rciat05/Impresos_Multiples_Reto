using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BasculaAPI.Models;

public partial class SistemaBasculaDbContext : DbContext
{
    public SistemaBasculaDbContext()
    {
    }

    public SistemaBasculaDbContext(DbContextOptions<SistemaBasculaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<RegistroPeso> RegistroPesos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=SistemaBasculaDB;Integrated Security=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RegistroPeso>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Registro__3214EC07787B20E6");

            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PesoKg).HasColumnType("decimal(10, 3)");
            entity.Property(e => e.PesoLb).HasColumnType("decimal(10, 3)");
            entity.Property(e => e.UnidadOrigen)
                .HasMaxLength(5)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
