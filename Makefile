deps_npm = deasync minecraft-data minecraft-protocol prismarine-chunk prismarine-nbt prismarine-provider-anvil prismarine-world prismarine-world-sync uuid-1345 vec3
deps_core = parallel-processes deasyncp

install: $(deps_core) $(deps_npm) ze_magicks
	echo Done

$(deps_npm):
	npm install $@
	cd node_modules/$@ && npm install
	rm -rf lib/$@
	cp -R node_modules/$@/ lib/$@

$(deps_core):
	rm -rf node_modules/$@/
	cd node_modules && git clone https://github.com/109C/$@.git
	cd node_modules/$@/ && make install
	rm -rf lib/$@
	cp -R node_modules/$@/ lib/$@

ze_magicks:
	cd node_modules/minecraft-data && git clone https://github.com/PrismarineJS/minecraft-data.git
	cp -R node_modules/minecraft-data/minecraft-data/ lib/minecraft-data/minecraft-data