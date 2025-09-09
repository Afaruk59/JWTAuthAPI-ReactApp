using System;
using AuthServer.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuthService.Data.Configuration;

public class UserAppConfig : IEntityTypeConfiguration<UserApp>
{
    public void Configure(EntityTypeBuilder<UserApp> builder)
    {
        // Role özelliği konfigürasyonu
        builder.Property(x => x.Role)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("User");
    }
}
