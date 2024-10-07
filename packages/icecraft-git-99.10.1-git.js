setMeta(MetaBuilder
.id("icecraft-git")
.version(semVer("99.10.1-git"))
.authors(author("WithLithum", "WithLithum@outlook.com"))
.maintainer(author("WithLithum", "WithLithum@outlook.com"))
.pluginMaintainer(author("WithLithum", "WithLithum@outlook.com"))
.license("GPL-3.0-or-later")
.date(new Date('2077-12-31T00:00:00Z'))
.dependency("dotnet-8.0-sdk", semRangeAtLeast("8.0.0"))
.unitary()
.build()
);

setOrigin("https://gitlab.com/icecrafters/IceCraft/-/archive/trunk/IceCraft-trunk.tar.gz");
voidsum();

onExpand(function (artefact, to) {
    CompressedArchive.expand(artefact, to, true)
});

onPreprocess(function (temp, to) {
    Packages.importEnvironment(Packages.getLatestInstalledPackage("dotnet-8.0-sdk"))
    let projectFile = Fs.joinPath(temp, "IceCraft-trunk", "src", "IceCraft", "IceCraft.csproj")

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
    Packages.registerVirtual(MetaBuilder
        .id("icecraft")
        .version(semVer("99.10.1-git"))
        .authors(author("WithLithum", "WithLithum@outlook.com"))
        .maintainer(author("WithLithum", "WithLithum@outlook.com"))
        .pluginMaintainer(author("WithLithum", "WithLithum@outlook.com"))
        .license("GPL-3.0-or-later")
        .date(new Date('2077-12-31T00:00:00Z'))
        .dependency("dotnet-8.0-sdk", semRangeAtLeast("8.0.0"))
        .unitary()
        .build()
    )
});

onExportEnv(function (path) {

})
