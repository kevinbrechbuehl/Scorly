#r "paket:
nuget Fake.Core.Environment
nuget Fake.Core.Target
nuget Fake.BuildServer.AppVeyor
nuget Fake.IO.FileSystem
nuget Fake.IO.Zip
nuget Fake.JavaScript.Npm
nuget Fake.Testing.Common //"

open Fake.BuildServer
open Fake.Core
open Fake.IO
open Fake.IO.Globbing.Operators
open Fake.JavaScript
open Fake.Testing

// Properties
let outputDir = __SOURCE_DIRECTORY__ + "/Output"
let tempDir = __SOURCE_DIRECTORY__ + "/Temp"

let frontendDir = __SOURCE_DIRECTORY__ + "/../Frontend"
let frontendTempDir = tempDir + "/Frontend"

// Targets
Target.create "Clean" (fun _ ->
  Shell.deleteDirs [ outputDir; tempDir ]
)

Target.create "Build" (fun _ ->
  // Build Backend
  // TODO

  // Build Frontend
  Npm.install (fun o -> { o with WorkingDirectory = frontendDir })
  Npm.run "build" (fun o -> { o with WorkingDirectory = frontendDir })
  Shell.copyDir frontendTempDir (frontendDir + "/build") (fun _ -> true)
)

Target.create "Test" (fun _ ->
  // Test Backend
  // TODO

  // Test Frontend
  try
    Npm.test (fun o -> { o with WorkingDirectory = frontendDir })
  with
    | :? Common.FailedTestsException -> ()

  if BuildServer.buildServer = BuildServer.AppVeyor then
    AppVeyor.defaultTraceListener.Write (TraceData.ImportData (ImportData.Junit, frontendDir + "/junit.xml"))
)

Target.create "Pack" (fun _ ->
  Shell.mkdir outputDir
  
  // Pack Backend
  // TODO
  
  // Pack Frontend
  !! (frontendTempDir + "/**/*.*")
    |> Zip.zip frontendTempDir (outputDir + "/Scorly.Frontend.zip")
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