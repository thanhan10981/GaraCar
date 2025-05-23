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
    public class XeKhachHangsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public XeKhachHangsController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/XeKhachHangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<XeKhachHang>>> GetXeKhachHangs()
        {
            return await _context.XeKhachHangs.ToListAsync();
        }

        // GET: api/XeKhachHangs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<XeKhachHang>> GetXeKhachHang(string id)
        {
            var xeKhachHang = await _context.XeKhachHangs.FindAsync(id);

            if (xeKhachHang == null)
            {
                return NotFound();
            }

            return xeKhachHang;
        }

        // PUT: api/XeKhachHangs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutXeKhachHang(string id, XeKhachHang xeKhachHang)
        {
            if (id != xeKhachHang.BienSoXe)
            {
                return BadRequest();
            }

            _context.Entry(xeKhachHang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XeKhachHangExists(id))
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

        // POST: api/XeKhachHangs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<XeKhachHang>> PostXeKhachHang(XeKhachHang xeKhachHang)
        {
            _context.XeKhachHangs.Add(xeKhachHang);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (XeKhachHangExists(xeKhachHang.BienSoXe))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetXeKhachHang", new { id = xeKhachHang.BienSoXe }, xeKhachHang);
        }

        // DELETE: api/XeKhachHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteXeKhachHang(string id)
        {
            var xeKhachHang = await _context.XeKhachHangs.FindAsync(id);
            if (xeKhachHang == null)
            {
                return NotFound();
            }

            _context.XeKhachHangs.Remove(xeKhachHang);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool XeKhachHangExists(string id)
        {
            return _context.XeKhachHangs.Any(e => e.BienSoXe == id);
        }
    }
}
