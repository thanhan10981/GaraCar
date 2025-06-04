using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaraCar.Migrations
{
    /// <inheritdoc />
    public partial class updatetieno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TienNo",
                table: "NhapHangs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TienNo",
                table: "NhapHangs");
        }
    }
}
