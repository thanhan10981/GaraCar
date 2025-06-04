using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaraCar.Migrations
{
    /// <inheritdoc />
    public partial class updatesoquy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhuongThucThanhToan",
                table: "SoQuys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhuongThucThanhToan",
                table: "SoQuys");
        }
    }
}
