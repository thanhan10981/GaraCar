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
    public class HoaDonsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public HoaDonsController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/HoaDons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDon>>> GetHoaDons()
        {
            return await _context.HoaDons.ToListAsync();
        }

        // GET: api/HoaDons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HoaDon>> GetHoaDon(string id)
        {
            var hoaDon = await _context.HoaDons.FindAsync(id);

            if (hoaDon == null)
            {
                return NotFound();
            }

            return hoaDon;
        }

        // PUT: api/HoaDons/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHoaDon(string id, HoaDon hoaDon)
        {
            if (id != hoaDon.MaHoaDon)
            {
                return BadRequest();
            }

            _context.Entry(hoaDon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HoaDonExists(id))
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

        // POST: api/HoaDons
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HoaDon>> PostHoaDon(HoaDon hoaDon)
        {
            _context.HoaDons.Add(hoaDon);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (HoaDonExists(hoaDon.MaHoaDon))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetHoaDon", new { id = hoaDon.MaHoaDon }, hoaDon);
        }

        // DELETE: api/HoaDons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoaDon(string id)
        {
            var hoaDon = await _context.HoaDons.FindAsync(id);
            if (hoaDon == null)
            {
                return NotFound();
            }

            _context.HoaDons.Remove(hoaDon);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HoaDonExists(string id)
        {
            return _context.HoaDons.Any(e => e.MaHoaDon == id);
        }
    }
}
