"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var deasyncp = require("./deasyncp");

var WorldSync = (function () {
  function WorldSync(world) {
    _classCallCheck(this, WorldSync);

    this.world = world;
  }

  _createClass(WorldSync, [{
    key: "getColumn",
    value: function getColumn(chunkX, chunkZ) {
      return deasyncp(this.world.getColumn.bind(this.world))(chunkX, chunkZ);
    }
  }, {
    key: "setColumn",
    value: function setColumn(chunkX, chunkZ, chunk) {
      deasyncp(this.world.setColumn.bind(this.world))(chunkX, chunkZ, chunk);
    }
  }, {
    key: "getColumns",
    value: function getColumns() {
      return deasyncp(this.world.getColumns.bind(this.world))();
    }
  }, {
    key: "getColumnAt",
    value: function getColumnAt(pos) {
      return deasyncp(this.world.getColumnAt.bind(this.world))(pos);
    }
  }, {
    key: "setBlock",
    value: function setBlock(pos, block) {
      deasyncp(this.world.setBlock.bind(this.world))(pos, block);
    }
  }, {
    key: "getBlock",
    value: function getBlock(pos) {
      return deasyncp(this.world.getBlock.bind(this.world))(pos);
    }
  }, {
    key: "getBlockType",
    value: function getBlockType(pos) {
      return deasyncp(this.world.getBlockType.bind(this.world))(pos);
    }
  }, {
    key: "getBlockData",
    value: function getBlockData(pos) {
      return deasyncp(this.world.getBlockType.bind(this.world))(pos);
    }
  }, {
    key: "getBlockLight",
    value: function getBlockLight(pos) {
      return deasyncp(this.world.getBlockLight.bind(this.world))(pos);
    }
  }, {
    key: "getSkyLight",
    value: function getSkyLight(pos) {
      return deasyncp(this.world.getSkyLight.bind(this.world))(pos);
    }
  }, {
    key: "getBiome",
    value: function getBiome(pos) {
      return deasyncp(this.world.getBiome.bind(this.world))(pos);
    }
  }, {
    key: "setBlockType",
    value: function setBlockType(pos, blockType) {
      deasyncp(this.world.setBlockType.bind(this.world))(pos, blockType);
    }
  }, {
    key: "setBlockData",
    value: function setBlockData(pos, data) {
      deasyncp(this.world.setBlockData.bind(this.world))(pos, data);
    }
  }, {
    key: "setBlockLight",
    value: function setBlockLight(pos, light) {
      deasyncp(this.world.setBlockLight.bind(this.world))(pos, light);
    }
  }, {
    key: "setSkyLight",
    value: function setSkyLight(pos, light) {
      deasyncp(this.world.setSkyLight.bind(this.world))(pos, light);
    }
  }, {
    key: "setBiome",
    value: function setBiome(pos, biome) {
      deasyncp(this.world.setBiome.bind(this.world))(pos, biome);
    }
  }]);

  return WorldSync;
})();

module.exports = WorldSync;