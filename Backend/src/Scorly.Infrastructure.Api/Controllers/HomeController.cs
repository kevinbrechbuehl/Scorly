using Microsoft.AspNetCore.Mvc;

namespace Scorly.Infrastructure.Api.Controllers
{
    [Route("")]
    public class HomeController : Controller
    {
        [HttpGet]
        public string Get()
        {
            return "Scorly is a simple and easy to use live scoring app for Squash matches.";
        }
    }
}
