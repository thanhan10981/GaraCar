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
    public class SoQuysController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public SoQuysController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/SoQuys
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SoQuy>>> GetSoQuys()
        {
            return await _context.SoQuys.ToListAsync();
        }

        // GET: api/SoQuys/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SoQuy>> GetSoQuy(string id)
        {
            var soQuy = await _context.SoQuys.FindAsync(id);

            if (soQuy == null)
            {
                return NotFound();
            }

            return soQuy;
        }

        // PUT: api/SoQuys/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSoQuy(string id, SoQuy soQuy)
        {
            if (id != soQuy.MaPhieu)
            {
                return BadRequest();
            }

            _context.Entry(soQuy).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SoQuyExists(id))
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

        // POST: api/SoQuys
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SoQuy>> PostSoQuy(SoQuy soQuy)
        {
            _context.SoQuys.Add(soQuy);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SoQuyExists(soQuy.MaPhieu))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSoQuy", new { id = soQuy.MaPhieu }, soQuy);
        }

        // DELETE: api/SoQuys/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSoQuy(string id)
        {
            var soQuy = await _context.SoQuys.FindAsync(id);
            if (soQuy == null)
            {
                return NotFound();
            }

            _context.SoQuys.Remove(soQuy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SoQuyExists(string id)
        {
            return _context.SoQuys.Any(e => e.MaPhieu == id);
        }
    }
}
