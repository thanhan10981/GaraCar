using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;

namespace GARA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamsController : ControllerBase
    {
        private readonly GaraCarContext _context;
        private readonly IWebHostEnvironment _env;

        public SanPhamsController(GaraCarContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/SanPhams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SanPham>>> GetSanPhams()
        {
            return await _context.SanPhams.ToListAsync();
        }

        // GET: api/SanPhams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SanPham>> GetSanPham(string id)
        {
            var sanPham = await _context.SanPhams.FindAsync(id);

            if (sanPham == null)
            {
                return NotFound();
            }

            return sanPham;
        }

        // PUT: api/SanPhams/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSanPham(string id, [FromForm] SanPham sanPham, IFormFile avatar)
        {
            if (id != sanPham.MaSanPham)
            {
                return BadRequest();
            }

            if (avatar != null && avatar.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(avatar.FileName);
                var folderPath = Path.Combine(_env.WebRootPath, "images");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                sanPham.AvatarPath = $"/images/{fileName}";
            }

            _context.Entry(sanPham).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SanPhamExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SanPhams
        [HttpPost]
        public async Task<ActionResult<SanPham>> PostSanPham([FromForm] SanPham sanPham, IFormFile avatar)
        {
            if (avatar != null && avatar.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(avatar.FileName);
                var folderPath = Path.Combine(_env.WebRootPath, "images");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                sanPham.AvatarPath = $"/images/{fileName}";
            }

            _context.SanPhams.Add(sanPham);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SanPhamExists(sanPham.MaSanPham))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSanPham", new { id = sanPham.MaSanPham }, sanPham);
        }

        // DELETE: api/SanPhams/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSanPham(string id)
        {
            var sanPham = await _context.SanPhams.FindAsync(id);
            if (sanPham == null)
            {
                return NotFound();
            }

            _context.SanPhams.Remove(sanPham);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SanPhamExists(string id)
        {
            return _context.SanPhams.Any(e => e.MaSanPham == id);
        }
    }
}