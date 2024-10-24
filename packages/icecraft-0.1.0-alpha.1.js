const pkgVer = "0.1.0-alpha.1"

setMeta(MetaBuilder
.id("icecraft")
.version(semVer(pkgVer))
.authors(author("WithLithum", "WithLithum@outlook.com"))
.maintainer(author("WithLithum", "WithLithum@outlook.com"))
.pluginMaintainer(author("WithLithum", "WithLithum@outlook.com"))
.license("GPL-3.0-or-later")
.date(new Date('2024-10-20T11:22:44+0800'))
.dependency("dotnet-8.0-sdk", semRangeAtLeast("8.0.0"))
.unitary()
.build()
);

setOrigin("https://github.com/IceCrafters/IceCraft/archive/refs/tags/v0.1.0-alpha.1.tar.gz");
voidsum();

onExpand(function (artefact, to) {
    CompressedArchive.expand(artefact, to, true)
});

onPreprocess(function (temp, to) {
    Packages.importEnvironment(Packages.getLatestInstalledPackage("dotnet-8.0-sdk"))
    let projectFile = Fs.joinPath(temp, `IceCraft-${pkgVer}`, "src", "IceCraft", "IceCraft.csproj")

    if (Os.system(`dotnet build "${projectFile}" --configuration Release --output "${to}" --verbosity quiet `) != 0) {
        throw new Error("Failed to build IceCraft")
    }
});

onConfigure(function (path) {
    Binary.register("IceCraft", "IceCraft")
});

onRemove(function (path) {
    Fs.rmdir(path, true)
});

onUnConfigure(function (path){
    Binary.unregister("IceCraft")
});

onExportEnv(function (path) {

})
