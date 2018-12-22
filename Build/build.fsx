#r "paket:
nuget Fake.Core.Environment
nuget Fake.Core.Target
nuget Fake.BuildServer.AppVeyor
nuget Fake.DotNet.Cli
nuget Fake.IO.FileSystem
nuget Fake.IO.Zip
nuget Fake.JavaScript.Npm //"
#load "./.fake/build.fsx/intellisense.fsx"

open Fake.BuildServer
open Fake.Core
open Fake.DotNet
open Fake.IO
open Fake.IO.Globbing.Operators
open Fake.JavaScript

// Properties
let outputDir = __SOURCE_DIRECTORY__ + "/Output"
let tempDir = __SOURCE_DIRECTORY__ + "/Temp"

let backendDir = __SOURCE_DIRECTORY__ + "/../Backend"
let backendBuildDir = backendDir + "/src/Scorly.Startup/bin/Release/netcoreapp2.2/publish"
let backendTempDir = tempDir + "/Backend"
let backendStartupProject = backendDir + "/src/Scorly.Startup/Scorly.Startup.csproj"
let backendSolutionFile = backendDir + "/Scorly.sln"
let backendTestResultsFile = tempDir + "/test_results.trx"
let backendOutputFile = outputDir + "/Scorly.Backend.zip"

let frontendDir = __SOURCE_DIRECTORY__ + "/../Frontend"
let frontendBuildDir = frontendDir + "/build"
let frontendTempDir = tempDir + "/Frontend"
let frontendTestResultsFile = frontendDir + "/junit.xml"
let frontendOutputFile = outputDir + "/Scorly.Frontend.zip"

// Targets
Target.create "Clean" (fun _ ->
  Shell.deleteDirs [ backendBuildDir; frontendBuildDir; outputDir; tempDir ]
)

Target.create "Build" (fun _ ->
  // Build Backend
  DotNet.build id (backendSolutionFile)
  DotNet.publish id (backendStartupProject)
  Shell.copyDir backendTempDir backendBuildDir (fun _ -> true)

  // Build Frontend
  Npm.install (fun o -> { o with WorkingDirectory = frontendDir })
  Npm.run "build" (fun o -> { o with WorkingDirectory = frontendDir })
  Shell.copyDir frontendTempDir frontendBuildDir (fun _ -> true)
)

Target.create "Test" (fun _ ->
  // Test Backend
  try
    DotNet.test (fun o -> { o with Logger = Some ("trx;LogFileName=" + backendTestResultsFile) }) (backendSolutionFile)
  finally
    if BuildServer.buildServer = BuildServer.AppVeyor then
      AppVeyor.defaultTraceListener.Write (TraceData.ImportData (ImportData.Mstest, backendTestResultsFile))

    // Test Frontend
    try
      Npm.test (fun o -> { o with WorkingDirectory = frontendDir })
    finally
      if BuildServer.buildServer = BuildServer.AppVeyor then
        AppVeyor.defaultTraceListener.Write (TraceData.ImportData (ImportData.Junit, frontendTestResultsFile))
)

Target.create "Pack" (fun _ ->
  Shell.mkdir outputDir
  
  // Pack Backend
  !! (backendTempDir + "/**/*.*")
    |> Zip.zip backendTempDir (backendOutputFile)
  
  // Pack Frontend
  !! (frontendTempDir + "/**/*.*")
    |> Zip.zip frontendTempDir (frontendOutputFile)
)

Target.create "Build-Test-Pack" ignore

// Dependencies
open Fake.Core.TargetOperators

"Clean"
  ==> "Build"
  ==> "Test"
  ==> "Pack"
  ==> "Build-Test-Pack"

Target.runOrDefault "Build-Test-Pack"