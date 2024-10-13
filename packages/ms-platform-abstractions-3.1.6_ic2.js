// Definitions

const libName = "Microsoft.DotNet.PlatformAbstractions"
const pkgName = "ms-platform-abstractions"
const libVer = "3.1.6"
const pkgVer = `${libVer}+ic2`
const sha512 = "f580ab8cfc2d55e3109576c2b6f89d5d1ebe920045468bae2fdeeb8debfb1e447ab739a1469a1127314c3b8be86be3a86291467a314d27c0e8e0ef07e1a87c4c";

// Metadata

setMeta(MetaBuilder
.id(pkgName)
.version(semVer(pkgVer))
.authors(author(".NET Foundation", "dot.net"))
.maintainer(author("WithLithum", "WithLithum@outlook.com"))
.pluginMaintainer(author("WithLithum", "WithLithum@outlook.com"))
.license("MIT")
.date(new Date('2024-10-10T11:00:08Z'))
.dependency("dotnet-8.0-sdk", semRangeAtLeast("8.0.0"))
.dependency("pottery", semRangeAny())
.build()
);

setOrigin(`https://gitlab.com/icecrafters/repackages/${pkgName}/-/archive/v${pkgVer}/${pkgName}-v${pkgVer}.tar.gz`);
sha512sum(sha512);

onExpand(function (artefact, to) {
    CompressedArchive.expand(artefact, to, true)
});

onPreprocess(function (temp, to) {
    // Build package
    Packages.importEnvironment(Packages.getLatestInstalledPackage("dotnet-8.0-sdk"))
    let projectFile = Fs.joinPath(temp, `${pkgName}-v${pkgVer}`, libName, `${libName}.csproj`)

    if (Os.system(`dotnet pack "${projectFile}" --configuration Release --output "${to}" --verbosity quiet -p:VersionPrefix=${pkgVer} -p:VersionSuffix="" --nologo --ucr`) != 0) {
        throw new Error("Build failed")
    }
});

onConfigure(function (path) {
    // Perform pottery installation
    Packages.importEnvironment(Packages.getLatestInstalledPackage("pottery", true))

    let potteryInstance = Fs.joinPath(AppBasePath, "pottery")
    let nugetFile = `${libName}.${libVer}.nupkg`

    Fs.mkdir(potteryInstance)
    if (Os.execute("pottery",
        "add",
        potteryInstance,
        Fs.joinPath(path, nugetFile)) != 0) {
        throw new Error("Pottery add failed")
        }
});

onRemove(function (path) {
    Fs.rmdir(path, true)
});

onUnConfigure(function (path){
    // Perform pottery uninstallation
    Packages.importEnvironment(Packages.getLatestInstalledPackage("pottery", true))

    let potteryInstance = Fs.joinPath(AppBasePath, "pottery")

    Fs.mkdir(potteryInstance)
    if (Os.execute("pottery",
        "remove",
        potteryInstance,
        libName,
        pkgVer) != 0) {
            mconsole.warnEx("Unable to remove pottery package.")
        }
});

onExportEnv(function (path) {
})
