using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Scorly.Infrastructure.Api.Dtos;
using Scorly.Infrastructure.Api.Hubs;

namespace Scorly.Infrastructure.Api.Controllers
{
    // TODO: Refactore
    [Route("[controller]")]    
    public class MatchesController : Controller
    {
        private static IList<MatchDto> _matches = new List<MatchDto>();

        private readonly IHubContext<ScoreChangeHub> _hubContext;

        static MatchesController() {
            AddMatch("Sven McLaughlin", "Cali Kuvalis", DateTime.UtcNow.AddDays(1));
            AddMatch("Erna Junk", "Adrian Wintheiser", DateTime.UtcNow.AddDays(2));
            AddMatch("Ceasar Grant", "Abbey Howe", DateTime.UtcNow.AddDays(3));
        }

        public MatchesController(IHubContext<ScoreChangeHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<MatchDto>))]
        public IActionResult GetAll()
        {
            return this.Ok(_matches.OrderBy(e => e.StartTime));
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(MatchDto))]
        public IActionResult GetById(Guid id)
        {
            var match = _matches.FirstOrDefault(e => e.Id == id);
            if (match == null)
            {
                return this.NotFound();    
            }

            return this.Ok(match);
        }

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(MatchDto))]
        public IActionResult Create([FromBody]MatchDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Player1Name) || string.IsNullOrWhiteSpace(dto.Player2Name))
            {
                return this.BadRequest();
            }
            
            var match = AddMatch(dto.Player1Name, dto.Player2Name, dto.StartTime);
            return this.Ok(match);
        }

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(MatchDto))]
        public IActionResult Update(Guid id, [FromBody]MatchDto dto)
        {
            if (id != dto.Id) 
            {
                return this.BadRequest();
            }
            
            var match = _matches.SingleOrDefault(e => e.Id == id);
            if (match == null)
            {
                return this.NotFound();
            }

            _matches.Remove(match);
            _matches.Add(dto);

            this._hubContext.Clients.All.SendAsync("updateScore", dto);

            return this.Ok(dto);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        public IActionResult Delete(Guid id)
        {
            var match = _matches.FirstOrDefault(e => e.Id == id);
            if (match == null)
            {
                return this.NotFound();
            }

            _matches.Remove(match);

            return this.NoContent();
        }

        private static MatchDto AddMatch(string player1Name, string player2Name, DateTime startTime)
        {
            var match = new MatchDto
            {
                Id = Guid.NewGuid(),
                Player1Name = player1Name,
                Player2Name = player2Name, 
                StartTime = startTime
            };

            _matches.Add(match);

            return match;
        }
    }
}
