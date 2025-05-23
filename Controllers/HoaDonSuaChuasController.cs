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
    public class HoaDonSuaChuasController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public HoaDonSuaChuasController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/HoaDonSuaChuas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDonSuaChua>>> GetHoaDonSuaChuas()
        {
            return await _context.HoaDonSuaChuas.ToListAsync();
        }

        // GET: api/HoaDonSuaChuas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HoaDonSuaChua>> GetHoaDonSuaChua(string id)
        {
            var hoaDonSuaChua = await _context.HoaDonSuaChuas.FindAsync(id);

            if (hoaDonSuaChua == null)
            {
                return NotFound();
            }

            return hoaDonSuaChua;
        }

        // PUT: api/HoaDonSuaChuas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHoaDonSuaChua(string id, HoaDonSuaChua hoaDonSuaChua)
        {
            if (id != hoaDonSuaChua.MaHoaDon)
            {
                return BadRequest();
            }

            _context.Entry(hoaDonSuaChua).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HoaDonSuaChuaExists(id))
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

        // POST: api/HoaDonSuaChuas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HoaDonSuaChua>> PostHoaDonSuaChua(HoaDonSuaChua hoaDonSuaChua)
        {
            _context.HoaDonSuaChuas.Add(hoaDonSuaChua);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (HoaDonSuaChuaExists(hoaDonSuaChua.MaHoaDon))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetHoaDonSuaChua", new { id = hoaDonSuaChua.MaHoaDon }, hoaDonSuaChua);
        }

        // DELETE: api/HoaDonSuaChuas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoaDonSuaChua(string id)
        {
            var hoaDonSuaChua = await _context.HoaDonSuaChuas.FindAsync(id);
            if (hoaDonSuaChua == null)
            {
                return NotFound();
            }

            _context.HoaDonSuaChuas.Remove(hoaDonSuaChua);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HoaDonSuaChuaExists(string id)
        {
            return _context.HoaDonSuaChuas.Any(e => e.MaHoaDon == id);
        }
    }
}
