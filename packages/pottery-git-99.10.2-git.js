setMeta(MetaBuilder
.id("pottery-git")
.version(semVer("99.10.2-git"))
.authors(author("WithLithum", "WithLithum@outlook.com"))
.maintainer(author("WithLithum", "WithLithum@outlook.com"))
.pluginMaintainer(author("WithLithum", "WithLithum@outlook.com"))
.license("Apache-2.0")
.date(new Date('2077-12-31T00:00:00Z'))
.dependency("dotnet-8.0-sdk", semRangeAtLeast("8.0.0"))
.unitary()
.build()
);

setOrigin("https://gitlab.com/icecrafters/pottery/-/archive/main/pottery-main.tar.gz");
voidsum();

onExpand(function (artefact, to) {
    CompressedArchive.expand(artefact, to, true)
});

onPreprocess(function (temp, to) {
    Packages.importEnvironment(Packages.getLatestInstalledPackage("dotnet-8.0-sdk"))
    let projectFile = Fs.joinPath(temp, "pottery-main", "IceCraft.Pottery", "IceCraft.Pottery.csproj")

    if (Os.system(`dotnet build "${projectFile}" --configuration Release --output "${to}" --verbosity quiet `) != 0) {
        throw new Error("Build failed")
    }
});

onConfigure(function (path) {
    Binary.register("pottery", "pottery")
    Packages.registerVirtual(MetaBuilder
    .id("pottery")
    .version(semVer("99.10.2+git-dev"))
    .authors(author("WithLithum", "WithLithum@outlook.com"))
    .maintainer(author("WithLithum", "WithLithum@outlook.com"))
    .pluginMaintainer(author("WithLithum", "WithLithum@outlook.com"))
    .license("Apache-2.0")
    .date(new Date('2077-12-31T00:00:00Z'))
    .build())
});

onRemove(function (path) {
    Fs.rmdir(path, true)
});

onUnConfigure(function (path){
    Binary.unregister("pottery")
});

onExportEnv(function (path) {
    Os.addProcessPath(path)
})
