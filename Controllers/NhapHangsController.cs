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
    public class NhapHangsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public NhapHangsController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/NhapHangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhapHang>>> GetNhapHangs()
        {
            return await _context.NhapHangs.ToListAsync();
        }

        // GET: api/NhapHangs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NhapHang>> GetNhapHang(string id)
        {
            var nhapHang = await _context.NhapHangs.FindAsync(id);

            if (nhapHang == null)
            {
                return NotFound();
            }

            return nhapHang;
        }

        // PUT: api/NhapHangs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhapHang(string id, NhapHang nhapHang)
        {
            if (id != nhapHang.MaNhapHang)
            {
                return BadRequest();
            }

            _context.Entry(nhapHang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NhapHangExists(id))
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

        // POST: api/NhapHangs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NhapHang>> PostNhapHang(NhapHang nhapHang)
        {
            _context.NhapHangs.Add(nhapHang);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (NhapHangExists(nhapHang.MaNhapHang))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetNhapHang", new { id = nhapHang.MaNhapHang }, nhapHang);
        }

        // DELETE: api/NhapHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhapHang(string id)
        {
            var nhapHang = await _context.NhapHangs.FindAsync(id);
            if (nhapHang == null)
            {
                return NotFound();
            }

            _context.NhapHangs.Remove(nhapHang);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NhapHangExists(string id)
        {
            return _context.NhapHangs.Any(e => e.MaNhapHang == id);
        }
    }
}
