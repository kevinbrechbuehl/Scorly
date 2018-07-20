#r "paket:
nuget Fake.IO.FileSystem
nuget Fake.JavaScript.Npm
nuget Fake.Core.Target //"
#load "./.fake/build.fsx/intellisense.fsx"

open Fake.Core
open Fake.IO
open Fake.JavaScript

// Properties
let outputDir = __SOURCE_DIRECTORY__ + "/Output"
let tempDir = __SOURCE_DIRECTORY__ + "/Temp"

let frontendDir = __SOURCE_DIRECTORY__ + "/../Frontend"
let frontendBuildDir = frontendDir + "/build"
let frontendTempDir = tempDir + "/Frontend"

// Targets
Target.create "Clean" (fun _ ->
  Shell.deleteDirs [ outputDir; tempDir ]
)

Target.create "Build" (fun _ ->

  // Build React Frontend
  Npm.install (fun o -> { o with WorkingDirectory = frontendDir })
  Npm.run "build" (fun o -> { o with WorkingDirectory = frontendDir })
  Shell.copyDir frontendTempDir frontendBuildDir (fun _ -> true)
)

Target.create "Test" (fun _ ->

  // Test React Frontend
  Npm.run "test:ci" (fun o -> { o with WorkingDirectory = frontendDir })
)

Target.create "Deploy" (fun _ ->
  Shell.mkdir outputDir

  // Pack React Frontend
  // TODO: Create zip file of frontendTempDir and save into output folder
)

open Fake.Core.TargetOperators

// Dependencies
"Clean"
  ==> "Build"
  ==> "Test"
  ==> "Deploy"

// Start Build
Target.runOrDefault "Deploy"