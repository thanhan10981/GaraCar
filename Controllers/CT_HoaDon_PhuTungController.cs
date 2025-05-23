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
    public class CT_HoaDon_PhuTungController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public CT_HoaDon_PhuTungController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/CT_HoaDon_PhuTung
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CT_HoaDon_PhuTung>>> GetCT_HoaDon_PhuTungs()
        {
            return await _context.CT_HoaDon_PhuTungs.ToListAsync();
        }

        // GET: api/CT_HoaDon_PhuTung/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CT_HoaDon_PhuTung>> GetCT_HoaDon_PhuTung(string id)
        {
            var cT_HoaDon_PhuTung = await _context.CT_HoaDon_PhuTungs.FindAsync(id);

            if (cT_HoaDon_PhuTung == null)
            {
                return NotFound();
            }

            return cT_HoaDon_PhuTung;
        }

        // PUT: api/CT_HoaDon_PhuTung/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCT_HoaDon_PhuTung(string id, CT_HoaDon_PhuTung cT_HoaDon_PhuTung)
        {
            if (id != cT_HoaDon_PhuTung.MaHoaDon)
            {
                return BadRequest();
            }

            _context.Entry(cT_HoaDon_PhuTung).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CT_HoaDon_PhuTungExists(id))
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

        // POST: api/CT_HoaDon_PhuTung
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CT_HoaDon_PhuTung>> PostCT_HoaDon_PhuTung(CT_HoaDon_PhuTung cT_HoaDon_PhuTung)
        {
            _context.CT_HoaDon_PhuTungs.Add(cT_HoaDon_PhuTung);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CT_HoaDon_PhuTungExists(cT_HoaDon_PhuTung.MaHoaDon))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCT_HoaDon_PhuTung", new { id = cT_HoaDon_PhuTung.MaHoaDon }, cT_HoaDon_PhuTung);
        }

        // DELETE: api/CT_HoaDon_PhuTung/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCT_HoaDon_PhuTung(string id)
        {
            var cT_HoaDon_PhuTung = await _context.CT_HoaDon_PhuTungs.FindAsync(id);
            if (cT_HoaDon_PhuTung == null)
            {
                return NotFound();
            }

            _context.CT_HoaDon_PhuTungs.Remove(cT_HoaDon_PhuTung);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CT_HoaDon_PhuTungExists(string id)
        {
            return _context.CT_HoaDon_PhuTungs.Any(e => e.MaHoaDon == id);
        }
    }
}
