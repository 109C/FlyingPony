# What is FlyingPony?

 A ultramodern JSON Minecraft server written in ES9 with the HTML8 boilerplate and cutting edge jQuery enabled node.js ModernizrifyJS.
 Because of the new ES9 quantum JIT emitters, it's guaranteed 110% uptime, even when restarting. (As long as you don't observe it.)
 
# I don't have ES9 yet, can I still use this?

 Yes you can! Using the babel-coffeJSr-ify runtime decompiler, it's possible to run this using only as ES 0.2 (Beta) jQuery engine.
 In fact, it even works on Netscape 1.33.7, using PWACFJSv9001. (PollyWantACrackerFiller.JS)

## No really, what is this?
 A spoof of flying-squid. More of an anti-flying squid, as it often has major design
 differences. (e.g. spaghetti event emitter callback/promise hell vs needlessly complex, confusing and sluggish event loop.)
 
## This actually works?
 Surprisingly, you can log in and do some stuff, despite all the bugs.
 
## How to install
 ```
 make install
 ```
 If it gets interrupted while installing, `make uninstall` and then `make install` again.
## How to run
 ```
 node Main.js
 ```

## Planned features
- [ ] World
  - [X] Prismarine-world worlds
  - [ ] Switching between worlds
  - [ ] Dynamicly creating / destroying worlds
- [ ] Blocks
  - [X] Regular blocks
  - [ ] Entity blocks / Blocks with inventories
- [ ] Player
  - [X] Movement
  - [ ] Inventory
  - [ ] Block breaking / Block placement
- [ ] Entities
  - [X] Mobs (Cow, Zombie, etc)
  - [ ] Mob AI.
  - [X] Drops
  - [X] Custom entity classes
  - [ ] Entity interaction
- [ ] Plugins
  - [X] Custom events
  - [X] Custom entities
  - [ ] A server - plugin interface
  - [X] Modify the default actions
  
![Zombies flying upwards](http://i.imgur.com/p3WkKVc.png)
*Development... continues.*