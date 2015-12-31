deps_npm = minecraft-data minecraft-protocol prismarine-chunk prismarine-world prismarine-world-sync uuid-1345 vec3
deps_core = parallel-processes

install: $(deps_core) $(deps_npm)
	echo Done

$(deps_npm):
	npm install $@
	cd node_modules/$@ && npm install
	cp -R node_modules/$@/ lib/$@
	echo installed @a in lib/

$(deps_core):
	rm -rf node_modules/$@/
	cd node_modules && git clone https://github.com/109C/$@.git
	cp -R node_modules/$@/ lib/$@

uninstall:
	rm -rf lib/*