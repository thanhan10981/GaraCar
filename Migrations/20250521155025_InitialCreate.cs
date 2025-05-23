using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaraCar.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DichVus",
                columns: table => new
                {
                    MaDichVu = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenDichVu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DichVus", x => x.MaDichVu);
                });

            migrationBuilder.CreateTable(
                name: "KhachHangs",
                columns: table => new
                {
                    MaKhachHang = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenKhachHang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgaySinh = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GioiTinh = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LoaiKhach = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaSoThue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CmndCccd = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Facebook = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HinhAnh = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NguoiTao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayTao = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhachHangs", x => x.MaKhachHang);
                });

            migrationBuilder.CreateTable(
                name: "LoaiHangs",
                columns: table => new
                {
                    MaLoaiHang = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenLoaiHang = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoaiHangs", x => x.MaLoaiHang);
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCaps",
                columns: table => new
                {
                    MaNCC = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenNCC = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhuongXa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CongTy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaSoThue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NhomNCC = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HinhAnh = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhaCungCaps", x => x.MaNCC);
                });

            migrationBuilder.CreateTable(
                name: "NhanViens",
                columns: table => new
                {
                    MaNhanVien = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenNhanVien = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GioiTinh = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ChucVu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TaiKhoanDangNhap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CmndCccd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Facebook = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HinhAnh = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhanViens", x => x.MaNhanVien);
                });

            migrationBuilder.CreateTable(
                name: "SoQuys",
                columns: table => new
                {
                    MaPhieu = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ThoiGian = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GiaTri = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NguoiNhan = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LoaiThuChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NguoiTao = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NhanVien = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DoiTuongNhan = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoQuys", x => x.MaPhieu);
                });

            migrationBuilder.CreateTable(
                name: "XeKhachHangs",
                columns: table => new
                {
                    BienSoXe = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaKhachHang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TenXe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KhachHangMaKhachHang = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_XeKhachHangs", x => x.BienSoXe);
                    table.ForeignKey(
                        name: "FK_XeKhachHangs_KhachHangs_KhachHangMaKhachHang",
                        column: x => x.KhachHangMaKhachHang,
                        principalTable: "KhachHangs",
                        principalColumn: "MaKhachHang");
                });

            migrationBuilder.CreateTable(
                name: "SanPhams",
                columns: table => new
                {
                    MaSanPham = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenSanPham = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvatarPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaLoaiHang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GiaBan = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GiaVon = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TonKho = table.Column<int>(type: "int", nullable: false),
                    ThoiGianTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DuKienHetSanPham = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LoaiHangMaLoaiHang = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SanPhams", x => x.MaSanPham);
                    table.ForeignKey(
                        name: "FK_SanPhams_LoaiHangs_LoaiHangMaLoaiHang",
                        column: x => x.LoaiHangMaLoaiHang,
                        principalTable: "LoaiHangs",
                        principalColumn: "MaLoaiHang");
                });

            migrationBuilder.CreateTable(
                name: "YeuCauSuaChuas",
                columns: table => new
                {
                    MaYeuCau = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BienSoXe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayDat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ThoiGianTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    XeKhachHangBienSoXe = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YeuCauSuaChuas", x => x.MaYeuCau);
                    table.ForeignKey(
                        name: "FK_YeuCauSuaChuas_XeKhachHangs_XeKhachHangBienSoXe",
                        column: x => x.XeKhachHangBienSoXe,
                        principalTable: "XeKhachHangs",
                        principalColumn: "BienSoXe");
                });

            migrationBuilder.CreateTable(
                name: "HoaDons",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaSanPham = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaKhachHang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    ThoiGian = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayGiaoDuKien = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NguoiBan = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhuThu = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SanPhamMaSanPham = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    KhachHangMaKhachHang = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDons", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK_HoaDons_KhachHangs_KhachHangMaKhachHang",
                        column: x => x.KhachHangMaKhachHang,
                        principalTable: "KhachHangs",
                        principalColumn: "MaKhachHang");
                    table.ForeignKey(
                        name: "FK_HoaDons_SanPhams_SanPhamMaSanPham",
                        column: x => x.SanPhamMaSanPham,
                        principalTable: "SanPhams",
                        principalColumn: "MaSanPham");
                });

            migrationBuilder.CreateTable(
                name: "NhapHangs",
                columns: table => new
                {
                    MaNhapHang = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaSanPham = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaNCC = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Soluong = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThoiGianTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TienNhap = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SanPhamMaSanPham = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NhaCungCapMaNCC = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhapHangs", x => x.MaNhapHang);
                    table.ForeignKey(
                        name: "FK_NhapHangs_NhaCungCaps_NhaCungCapMaNCC",
                        column: x => x.NhaCungCapMaNCC,
                        principalTable: "NhaCungCaps",
                        principalColumn: "MaNCC");
                    table.ForeignKey(
                        name: "FK_NhapHangs_SanPhams_SanPhamMaSanPham",
                        column: x => x.SanPhamMaSanPham,
                        principalTable: "SanPhams",
                        principalColumn: "MaSanPham",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HoaDonSuaChuas",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaYeuCau = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaNhanVien = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayLap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ThoiGianHoanThanhDuKien = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    YeuCauSuaChuaMaYeuCau = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    NhanVienMaNhanVien = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDonSuaChuas", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK_HoaDonSuaChuas_NhanViens_NhanVienMaNhanVien",
                        column: x => x.NhanVienMaNhanVien,
                        principalTable: "NhanViens",
                        principalColumn: "MaNhanVien",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HoaDonSuaChuas_YeuCauSuaChuas_YeuCauSuaChuaMaYeuCau",
                        column: x => x.YeuCauSuaChuaMaYeuCau,
                        principalTable: "YeuCauSuaChuas",
                        principalColumn: "MaYeuCau");
                });

            migrationBuilder.CreateTable(
                name: "PhieuBaoHanhs",
                columns: table => new
                {
                    MaPhieuBaoHanh = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaSanPham = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaHoaDon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaKhachHang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThoiGianBaoHanh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SanPhamMaSanPham = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HoaDonMaHoaDon = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    KhachHangMaKhachHang = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuBaoHanhs", x => x.MaPhieuBaoHanh);
                    table.ForeignKey(
                        name: "FK_PhieuBaoHanhs_HoaDons_HoaDonMaHoaDon",
                        column: x => x.HoaDonMaHoaDon,
                        principalTable: "HoaDons",
                        principalColumn: "MaHoaDon");
                    table.ForeignKey(
                        name: "FK_PhieuBaoHanhs_KhachHangs_KhachHangMaKhachHang",
                        column: x => x.KhachHangMaKhachHang,
                        principalTable: "KhachHangs",
                        principalColumn: "MaKhachHang");
                    table.ForeignKey(
                        name: "FK_PhieuBaoHanhs_SanPhams_SanPhamMaSanPham",
                        column: x => x.SanPhamMaSanPham,
                        principalTable: "SanPhams",
                        principalColumn: "MaSanPham",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CT_HoaDon_DichVus",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaDichVu = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HoaDonSuaChuaMaHoaDon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DichVuMaDichVu = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_HoaDon_DichVus", x => new { x.MaHoaDon, x.MaDichVu });
                    table.ForeignKey(
                        name: "FK_CT_HoaDon_DichVus_DichVus_DichVuMaDichVu",
                        column: x => x.DichVuMaDichVu,
                        principalTable: "DichVus",
                        principalColumn: "MaDichVu",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_HoaDon_DichVus_HoaDonSuaChuas_HoaDonSuaChuaMaHoaDon",
                        column: x => x.HoaDonSuaChuaMaHoaDon,
                        principalTable: "HoaDonSuaChuas",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CT_HoaDon_PhuTungs",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaSanPham = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HoaDonSuaChuaMaHoaDon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SanPhamMaSanPham = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_HoaDon_PhuTungs", x => new { x.MaHoaDon, x.MaSanPham });
                    table.ForeignKey(
                        name: "FK_CT_HoaDon_PhuTungs_HoaDonSuaChuas_HoaDonSuaChuaMaHoaDon",
                        column: x => x.HoaDonSuaChuaMaHoaDon,
                        principalTable: "HoaDonSuaChuas",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_HoaDon_PhuTungs_SanPhams_SanPhamMaSanPham",
                        column: x => x.SanPhamMaSanPham,
                        principalTable: "SanPhams",
                        principalColumn: "MaSanPham",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CT_HoaDon_DichVus_DichVuMaDichVu",
                table: "CT_HoaDon_DichVus",
                column: "DichVuMaDichVu");

            migrationBuilder.CreateIndex(
                name: "IX_CT_HoaDon_DichVus_HoaDonSuaChuaMaHoaDon",
                table: "CT_HoaDon_DichVus",
                column: "HoaDonSuaChuaMaHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_CT_HoaDon_PhuTungs_HoaDonSuaChuaMaHoaDon",
                table: "CT_HoaDon_PhuTungs",
                column: "HoaDonSuaChuaMaHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_CT_HoaDon_PhuTungs_SanPhamMaSanPham",
                table: "CT_HoaDon_PhuTungs",
                column: "SanPhamMaSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_KhachHangMaKhachHang",
                table: "HoaDons",
                column: "KhachHangMaKhachHang");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_SanPhamMaSanPham",
                table: "HoaDons",
                column: "SanPhamMaSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonSuaChuas_NhanVienMaNhanVien",
                table: "HoaDonSuaChuas",
                column: "NhanVienMaNhanVien");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonSuaChuas_YeuCauSuaChuaMaYeuCau",
                table: "HoaDonSuaChuas",
                column: "YeuCauSuaChuaMaYeuCau");

            migrationBuilder.CreateIndex(
                name: "IX_NhapHangs_NhaCungCapMaNCC",
                table: "NhapHangs",
                column: "NhaCungCapMaNCC");

            migrationBuilder.CreateIndex(
                name: "IX_NhapHangs_SanPhamMaSanPham",
                table: "NhapHangs",
                column: "SanPhamMaSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuBaoHanhs_HoaDonMaHoaDon",
                table: "PhieuBaoHanhs",
                column: "HoaDonMaHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuBaoHanhs_KhachHangMaKhachHang",
                table: "PhieuBaoHanhs",
                column: "KhachHangMaKhachHang");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuBaoHanhs_SanPhamMaSanPham",
                table: "PhieuBaoHanhs",
                column: "SanPhamMaSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_SanPhams_LoaiHangMaLoaiHang",
                table: "SanPhams",
                column: "LoaiHangMaLoaiHang");

            migrationBuilder.CreateIndex(
                name: "IX_XeKhachHangs_KhachHangMaKhachHang",
                table: "XeKhachHangs",
                column: "KhachHangMaKhachHang");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauSuaChuas_XeKhachHangBienSoXe",
                table: "YeuCauSuaChuas",
                column: "XeKhachHangBienSoXe");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CT_HoaDon_DichVus");

            migrationBuilder.DropTable(
                name: "CT_HoaDon_PhuTungs");

            migrationBuilder.DropTable(
                name: "NhapHangs");

            migrationBuilder.DropTable(
                name: "PhieuBaoHanhs");

            migrationBuilder.DropTable(
                name: "SoQuys");

            migrationBuilder.DropTable(
                name: "DichVus");

            migrationBuilder.DropTable(
                name: "HoaDonSuaChuas");

            migrationBuilder.DropTable(
                name: "NhaCungCaps");

            migrationBuilder.DropTable(
                name: "HoaDons");

            migrationBuilder.DropTable(
                name: "NhanViens");

            migrationBuilder.DropTable(
                name: "YeuCauSuaChuas");

            migrationBuilder.DropTable(
                name: "SanPhams");

            migrationBuilder.DropTable(
                name: "XeKhachHangs");

            migrationBuilder.DropTable(
                name: "LoaiHangs");

            migrationBuilder.DropTable(
                name: "KhachHangs");
        }
    }
}
