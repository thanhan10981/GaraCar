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
    public class NhaCungCapsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public NhaCungCapsController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/NhaCungCaps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhaCungCap>>> GetNhaCungCaps()
        {
            return await _context.NhaCungCaps.ToListAsync();
        }

        // GET: api/NhaCungCaps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NhaCungCap>> GetNhaCungCap(string id)
        {
            var nhaCungCap = await _context.NhaCungCaps.FindAsync(id);

            if (nhaCungCap == null)
            {
                return NotFound();
            }

            return nhaCungCap;
        }

        // PUT: api/NhaCungCaps/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhaCungCap(string id, NhaCungCap nhaCungCap)
        {
            if (id != nhaCungCap.MaNCC)
            {
                return BadRequest();
            }

            _context.Entry(nhaCungCap).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NhaCungCapExists(id))
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

        // POST: api/NhaCungCaps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NhaCungCap>> PostNhaCungCap(NhaCungCap nhaCungCap)
        {
            _context.NhaCungCaps.Add(nhaCungCap);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (NhaCungCapExists(nhaCungCap.MaNCC))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetNhaCungCap", new { id = nhaCungCap.MaNCC }, nhaCungCap);
        }

        // DELETE: api/NhaCungCaps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhaCungCap(string id)
        {
            var nhaCungCap = await _context.NhaCungCaps.FindAsync(id);
            if (nhaCungCap == null)
            {
                return NotFound();
            }

            _context.NhaCungCaps.Remove(nhaCungCap);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NhaCungCapExists(string id)
        {
            return _context.NhaCungCaps.Any(e => e.MaNCC == id);
        }
    }
}
