using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiHangsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public LoaiHangsController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/LoaiHangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoaiHang>>> GetLoaiHangs()
        {
            return await _context.LoaiHangs.ToListAsync();
        }

        // GET: api/LoaiHangs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoaiHang>> GetLoaiHang(string id)
        {
            var loaiHang = await _context.LoaiHangs.FindAsync(id);

            if (loaiHang == null)
            {
                return NotFound();
            }

            return loaiHang;
        }

        // PUT: api/LoaiHangs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoaiHang(string id, LoaiHang loaiHang)
        {
            if (id != loaiHang.MaLoaiHang)
            {
                return BadRequest();
            }

            _context.Entry(loaiHang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiHangExists(id))
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

        // POST: api/LoaiHangs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LoaiHang>> PostLoaiHang(LoaiHang loaiHang)
        {
            _context.LoaiHangs.Add(loaiHang);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (LoaiHangExists(loaiHang.MaLoaiHang))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetLoaiHang", new { id = loaiHang.MaLoaiHang }, loaiHang);
        }

        // DELETE: api/LoaiHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoaiHang(string id)
        {
            var loaiHang = await _context.LoaiHangs.FindAsync(id);
            if (loaiHang == null)
            {
                return NotFound();
            }

            _context.LoaiHangs.Remove(loaiHang);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoaiHangExists(string id)
        {
            return _context.LoaiHangs.Any(e => e.MaLoaiHang == id);
        }
    }
}
