using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaraCar.Migrations
{
    /// <inheritdoc />
    public partial class updat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SanPhamHoaDon_HoaDons_HoaDonMaHoaDon",
                table: "SanPhamHoaDon");

            migrationBuilder.DropForeignKey(
                name: "FK_SanPhamHoaDon_SanPhams_SanPhamMaSanPham",
                table: "SanPhamHoaDon");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SanPhamHoaDon",
                table: "SanPhamHoaDon");

            migrationBuilder.RenameTable(
                name: "SanPhamHoaDon",
                newName: "SanPhamHoaDons");

            migrationBuilder.RenameIndex(
                name: "IX_SanPhamHoaDon_SanPhamMaSanPham",
                table: "SanPhamHoaDons",
                newName: "IX_SanPhamHoaDons_SanPhamMaSanPham");

            migrationBuilder.RenameIndex(
                name: "IX_SanPhamHoaDon_HoaDonMaHoaDon",
                table: "SanPhamHoaDons",
                newName: "IX_SanPhamHoaDons_HoaDonMaHoaDon");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ThoiGian",
                table: "SoQuys",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaTri",
                table: "SoQuys",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TenSanPham",
                table: "SanPhams",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MaLoaiHang",
                table: "SanPhams",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AvatarPath",
                table: "SanPhams",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<decimal>(
                name: "TienNo",
                table: "NhapHangs",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<decimal>(
                name: "TienNhap",
                table: "NhapHangs",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ThoiGianTao",
                table: "NhapHangs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NguoiTao",
                table: "NhapHangs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MaNhanVien",
                table: "HoaDons",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "KieuBanHang",
                table: "HoaDons",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SanPhamMaSanPham",
                table: "SanPhamHoaDons",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SanPhamHoaDons",
                table: "SanPhamHoaDons",
                column: "MaSPHD");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_MaNhanVien",
                table: "HoaDons",
                column: "MaNhanVien");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDons_NhanViens_MaNhanVien",
                table: "HoaDons",
                column: "MaNhanVien",
                principalTable: "NhanViens",
                principalColumn: "MaNhanVien",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SanPhamHoaDons_HoaDons_HoaDonMaHoaDon",
                table: "SanPhamHoaDons",
                column: "HoaDonMaHoaDon",
                principalTable: "HoaDons",
                principalColumn: "MaHoaDon");

            migrationBuilder.AddForeignKey(
                name: "FK_SanPhamHoaDons_SanPhams_SanPhamMaSanPham",
                table: "SanPhamHoaDons",
                column: "SanPhamMaSanPham",
                principalTable: "SanPhams",
                principalColumn: "MaSanPham",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDons_NhanViens_MaNhanVien",
                table: "HoaDons");

            migrationBuilder.DropForeignKey(
                name: "FK_SanPhamHoaDons_HoaDons_HoaDonMaHoaDon",
                table: "SanPhamHoaDons");

            migrationBuilder.DropForeignKey(
                name: "FK_SanPhamHoaDons_SanPhams_SanPhamMaSanPham",
                table: "SanPhamHoaDons");

            migrationBuilder.DropIndex(
                name: "IX_HoaDons_MaNhanVien",
                table: "HoaDons");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SanPhamHoaDons",
                table: "SanPhamHoaDons");

            migrationBuilder.DropColumn(
                name: "KieuBanHang",
                table: "HoaDons");

            migrationBuilder.RenameTable(
                name: "SanPhamHoaDons",
                newName: "SanPhamHoaDon");

            migrationBuilder.RenameIndex(
                name: "IX_SanPhamHoaDons_SanPhamMaSanPham",
                table: "SanPhamHoaDon",
                newName: "IX_SanPhamHoaDon_SanPhamMaSanPham");

            migrationBuilder.RenameIndex(
                name: "IX_SanPhamHoaDons_HoaDonMaHoaDon",
                table: "SanPhamHoaDon",
                newName: "IX_SanPhamHoaDon_HoaDonMaHoaDon");

            migrationBuilder.AlterColumn<string>(
                name: "ThoiGian",
                table: "SoQuys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "GiaTri",
                table: "SoQuys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "TenSanPham",
                table: "SanPhams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MaLoaiHang",
                table: "SanPhams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AvatarPath",
                table: "SanPhams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TienNo",
                table: "NhapHangs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "TienNhap",
                table: "NhapHangs",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ThoiGianTao",
                table: "NhapHangs",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "NguoiTao",
                table: "NhapHangs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MaNhanVien",
                table: "HoaDons",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "SanPhamMaSanPham",
                table: "SanPhamHoaDon",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SanPhamHoaDon",
                table: "SanPhamHoaDon",
                column: "MaSPHD");

            migrationBuilder.AddForeignKey(
                name: "FK_SanPhamHoaDon_HoaDons_HoaDonMaHoaDon",
                table: "SanPhamHoaDon",
                column: "HoaDonMaHoaDon",
                principalTable: "HoaDons",
                principalColumn: "MaHoaDon");

            migrationBuilder.AddForeignKey(
                name: "FK_SanPhamHoaDon_SanPhams_SanPhamMaSanPham",
                table: "SanPhamHoaDon",
                column: "SanPhamMaSanPham",
                principalTable: "SanPhams",
                principalColumn: "MaSanPham");
        }
    }
}
