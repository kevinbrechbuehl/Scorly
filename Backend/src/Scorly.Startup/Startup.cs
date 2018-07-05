
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Scorly.Infrastructure.Api;

namespace Scorly.Startup
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScorlyWeb();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseScorlyWeb(env);
        }
    }
}
