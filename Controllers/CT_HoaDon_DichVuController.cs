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
    public class CT_HoaDon_DichVuController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public CT_HoaDon_DichVuController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/CT_HoaDon_DichVu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CT_HoaDon_DichVu>>> GetCT_HoaDon_DichVus()
        {
            return await _context.CT_HoaDon_DichVus.ToListAsync();
        }

        // GET: api/CT_HoaDon_DichVu/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CT_HoaDon_DichVu>> GetCT_HoaDon_DichVu(string id)
        {
            var cT_HoaDon_DichVu = await _context.CT_HoaDon_DichVus.FindAsync(id);

            if (cT_HoaDon_DichVu == null)
            {
                return NotFound();
            }

            return cT_HoaDon_DichVu;
        }

        // PUT: api/CT_HoaDon_DichVu/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCT_HoaDon_DichVu(string id, CT_HoaDon_DichVu cT_HoaDon_DichVu)
        {
            if (id != cT_HoaDon_DichVu.MaHoaDon)
            {
                return BadRequest();
            }

            _context.Entry(cT_HoaDon_DichVu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CT_HoaDon_DichVuExists(id))
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

        // POST: api/CT_HoaDon_DichVu
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CT_HoaDon_DichVu>> PostCT_HoaDon_DichVu(CT_HoaDon_DichVu cT_HoaDon_DichVu)
        {
            _context.CT_HoaDon_DichVus.Add(cT_HoaDon_DichVu);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CT_HoaDon_DichVuExists(cT_HoaDon_DichVu.MaHoaDon))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCT_HoaDon_DichVu", new { id = cT_HoaDon_DichVu.MaHoaDon }, cT_HoaDon_DichVu);
        }

        // DELETE: api/CT_HoaDon_DichVu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCT_HoaDon_DichVu(string id)
        {
            var cT_HoaDon_DichVu = await _context.CT_HoaDon_DichVus.FindAsync(id);
            if (cT_HoaDon_DichVu == null)
            {
                return NotFound();
            }

            _context.CT_HoaDon_DichVus.Remove(cT_HoaDon_DichVu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CT_HoaDon_DichVuExists(string id)
        {
            return _context.CT_HoaDon_DichVus.Any(e => e.MaHoaDon == id);
        }
    }
}
