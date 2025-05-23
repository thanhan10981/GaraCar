using Microsoft.EntityFrameworkCore;

namespace GaraCarAPI.Models
{
    public class GaraCarContext : DbContext
    {
        public GaraCarContext(DbContextOptions<GaraCarContext> options) : base(options) { }

        public DbSet<KhachHang> KhachHangs { get; set; }
        public DbSet<XeKhachHang> XeKhachHangs { get; set; }
        public DbSet<NhanVien> NhanViens { get; set; }
        public DbSet<DichVu> DichVus { get; set; }
        public DbSet<LoaiHang> LoaiHangs { get; set; }
        public DbSet<SanPham> SanPhams { get; set; }
        public DbSet<YeuCauSuaChua> YeuCauSuaChuas { get; set; }
        public DbSet<HoaDonSuaChua> HoaDonSuaChuas { get; set; }
        public DbSet<CT_HoaDon_DichVu> CT_HoaDon_DichVus { get; set; }
        public DbSet<CT_HoaDon_PhuTung> CT_HoaDon_PhuTungs { get; set; }
        public DbSet<NhaCungCap> NhaCungCaps { get; set; }
        public DbSet<NhapHang> NhapHangs { get; set; }
        public DbSet<HoaDon> HoaDons { get; set; }
        public DbSet<PhieuBaoHanh> PhieuBaoHanhs { get; set; }
        public DbSet<SoQuy> SoQuys { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Khóa chính tổ hợp
            modelBuilder.Entity<CT_HoaDon_DichVu>().HasKey(x => new { x.MaHoaDon, x.MaDichVu });
            modelBuilder.Entity<CT_HoaDon_PhuTung>().HasKey(x => new { x.MaHoaDon, x.MaSanPham });
        }
    }
}

