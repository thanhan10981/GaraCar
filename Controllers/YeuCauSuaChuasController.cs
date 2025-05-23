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
    public class YeuCauSuaChuasController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public YeuCauSuaChuasController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/YeuCauSuaChuas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<YeuCauSuaChua>>> GetYeuCauSuaChuas()
        {
            return await _context.YeuCauSuaChuas.ToListAsync();
        }

        // GET: api/YeuCauSuaChuas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<YeuCauSuaChua>> GetYeuCauSuaChua(string id)
        {
            var yeuCauSuaChua = await _context.YeuCauSuaChuas.FindAsync(id);

            if (yeuCauSuaChua == null)
            {
                return NotFound();
            }

            return yeuCauSuaChua;
        }

        // PUT: api/YeuCauSuaChuas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutYeuCauSuaChua(string id, YeuCauSuaChua yeuCauSuaChua)
        {
            if (id != yeuCauSuaChua.MaYeuCau)
            {
                return BadRequest();
            }

            _context.Entry(yeuCauSuaChua).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!YeuCauSuaChuaExists(id))
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

        // POST: api/YeuCauSuaChuas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<YeuCauSuaChua>> PostYeuCauSuaChua(YeuCauSuaChua yeuCauSuaChua)
        {
            _context.YeuCauSuaChuas.Add(yeuCauSuaChua);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (YeuCauSuaChuaExists(yeuCauSuaChua.MaYeuCau))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetYeuCauSuaChua", new { id = yeuCauSuaChua.MaYeuCau }, yeuCauSuaChua);
        }

        // DELETE: api/YeuCauSuaChuas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteYeuCauSuaChua(string id)
        {
            var yeuCauSuaChua = await _context.YeuCauSuaChuas.FindAsync(id);
            if (yeuCauSuaChua == null)
            {
                return NotFound();
            }

            _context.YeuCauSuaChuas.Remove(yeuCauSuaChua);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool YeuCauSuaChuaExists(string id)
        {
            return _context.YeuCauSuaChuas.Any(e => e.MaYeuCau == id);
        }
    }
}
