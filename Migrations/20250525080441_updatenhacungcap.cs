using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaraCar.Migrations
{
    /// <inheritdoc />
    public partial class updatenhacungcap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "NhaCungCaps",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "NhaCungCaps");
        }
    }
}
