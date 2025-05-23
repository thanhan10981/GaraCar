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
    public class PhieuBaoHanhsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public PhieuBaoHanhsController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/PhieuBaoHanhs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuBaoHanh>>> GetPhieuBaoHanhs()
        {
            return await _context.PhieuBaoHanhs.ToListAsync();
        }

        // GET: api/PhieuBaoHanhs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuBaoHanh>> GetPhieuBaoHanh(string id)
        {
            var phieuBaoHanh = await _context.PhieuBaoHanhs.FindAsync(id);

            if (phieuBaoHanh == null)
            {
                return NotFound();
            }

            return phieuBaoHanh;
        }

        // PUT: api/PhieuBaoHanhs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhieuBaoHanh(string id, PhieuBaoHanh phieuBaoHanh)
        {
            if (id != phieuBaoHanh.MaPhieuBaoHanh)
            {
                return BadRequest();
            }

            _context.Entry(phieuBaoHanh).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhieuBaoHanhExists(id))
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

        // POST: api/PhieuBaoHanhs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PhieuBaoHanh>> PostPhieuBaoHanh(PhieuBaoHanh phieuBaoHanh)
        {
            _context.PhieuBaoHanhs.Add(phieuBaoHanh);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PhieuBaoHanhExists(phieuBaoHanh.MaPhieuBaoHanh))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPhieuBaoHanh", new { id = phieuBaoHanh.MaPhieuBaoHanh }, phieuBaoHanh);
        }

        // DELETE: api/PhieuBaoHanhs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuBaoHanh(string id)
        {
            var phieuBaoHanh = await _context.PhieuBaoHanhs.FindAsync(id);
            if (phieuBaoHanh == null)
            {
                return NotFound();
            }

            _context.PhieuBaoHanhs.Remove(phieuBaoHanh);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PhieuBaoHanhExists(string id)
        {
            return _context.PhieuBaoHanhs.Any(e => e.MaPhieuBaoHanh == id);
        }
    }
}
