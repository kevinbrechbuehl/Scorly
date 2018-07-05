using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Scorly.Infrastructure.Api.Hubs;

namespace Scorly.Infrastructure.Api
{
    public static class Bootstrapper
    {
        public static void AddScorlyWeb(this IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc();
            services.AddSignalR();
        }

        public static void UseScorlyWeb(this IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // todo: correctly configure CORS
            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            app.UseSignalR(routes =>
            {
                routes.MapHub<ScoreChangeHub>("/scoreChange");
            });

            app.UseMvc();
        }
    }
}