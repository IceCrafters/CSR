// Definitions

const pkgRevision = "130r3"
const pkgVer = "13.0.3"
const sha512 = "ead88599effd09280a2d096fc5b48b720460f72bb22c5b70ba5e01a836464802dc9f8f7b093fcae68c2f7c1374d0aadbd3233091d9c1307c891091608bade0cd";

// Metadata

setMeta(MetaBuilder
.id("newtonsoft-json")
.version(semVer(pkgVer))
.authors(author("James Newton-King", "james.newtonking.com"))
.maintainer(author("WithLithum", "WithLithum@outlook.com"))
.pluginMaintainer(author("WithLithum", "WithLithum@outlook.com"))
.license("Apache-2.0")
.date(new Date('2023-03-08T14:22:45Z'))
.dependency("dotnet-8.0-sdk", semRangeAtLeast("8.0.0"))
.build()
);

setOrigin(`https://github.com/JamesNK/Newtonsoft.Json/archive/refs/tags/${pkgVer}.tar.gz`);
sha512sum(sha512);

onExpand(function (artefact, to) {
    CompressedArchive.expand(artefact, to, true)
});

onPreprocess(function (temp, to) {
    // Build package
    Packages.importEnvironment(Packages.getLatestInstalledPackage("dotnet-8.0-sdk"))
    let projectFile = Fs.joinPath(temp, `Newtonsoft.Json-${pkgVer}`, "Src", "Newtonsoft.Json", "Newtonsoft.Json.csproj")

    if (Os.system(`dotnet pack "${projectFile}" --configuration Release --output "${to}" --verbosity quiet -p:VersionPrefix=${pkgVer} -p:VersionSuffix="" -p:ApiCompatGenerateSuppressionFile=true --nologo --ucr`) != 0) {
        throw new Error("Build failed")
    }
});

onConfigure(function (path) {
    // Perform pottery installation
    Packages.importEnvironment(Packages.getLatestInstalledPackage("pottery", true))

    let potteryInstance = Fs.joinPath(AppBasePath, "pottery")
    let nugetFile = `Newtonsoft.Json.${pkgVer}.nupkg`

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
        "Newtonsoft.Json",
        pkgVer) != 0) {
            mconsole.warnEx("Unable to remove package from pottery")
    }
});

onExportEnv(function (path) {
})
