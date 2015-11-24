"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BUFFER_SIZE = 16 * 16 * 16 * 16 * 3 + 256;

var _require = require("uint4");

var readUInt4LE = _require.readUInt4LE;
var writeUInt4LE = _require.writeUInt4LE;

module.exports = loader;

function loader(mcVersion) {
    Block = require("prismarine-block")(mcVersion);
    return Chunk;
}

var Block;

var exists = function exists(val) {
    return val !== undefined;
};

var getArrayPosition = function getArrayPosition(pos) {
    var n = pos.y >> 4;
    var y = pos.y % 16;
    return n * 4096 + y * 256 + pos.z * 16 + pos.x;
};

var getBlockCursor = function getBlockCursor(pos) {
    return getArrayPosition(pos) * 2 + 0;
};

var getBlockLightCursor = function getBlockLightCursor(pos) {
    return getArrayPosition(pos) * 0.5 + 131072;
};

var getSkyLightCursor = function getSkyLightCursor(pos) {
    return getArrayPosition(pos) * 0.5 + 163840;
};

var getBiomeCursor = function getBiomeCursor(pos) {
    return 16 * 16 * 16 * 16 * 3 + pos.z * 16 + pos.x; // X and Z may need to be flipped
};

var Chunk = (function () {
    function Chunk() {
        _classCallCheck(this, Chunk);

        this.data = new Buffer(BUFFER_SIZE);
        this.data.fill(0);
    }

    _createClass(Chunk, {
        getBlock: {
            value: function getBlock(pos) {
                var block = new Block(this.getBlockType(pos), this.getBiome(pos), this.getBlockData(pos));
                block.light = this.getBlockLight(pos);
                block.skyLight = this.getSkyLight(pos);
                return block;
            }
        },
        setBlock: {
            value: function setBlock(pos, block) {
                if (exists(block.type)) this.setBlockType(pos, block.type);
                if (exists(block.metadata)) this.setBlockData(pos, block.metadata);
                if (exists(block.biome)) this.setBiome(pos, block.biome.id);
                if (exists(block.skyLight)) this.setSkyLight(pos, block.skyLight);
                if (exists(block.light)) this.setBlockLight(pos, block.light);
            }
        },
        getBlockType: {
            value: function getBlockType(pos) {
                var cursor = getBlockCursor(pos);
                return this.data.readUInt16LE(cursor) >> 4;
            }
        },
        getBlockData: {
            value: function getBlockData(pos) {
                var cursor = getBlockCursor(pos);
                return this.data.readUInt16LE(cursor) & 15;
            }
        },
        getBlockLight: {
            value: function getBlockLight(pos) {
                var cursor = getBlockLightCursor(pos);
                return readUInt4LE(this.data, cursor);
            }
        },
        getSkyLight: {
            value: function getSkyLight(pos) {
                var cursor = getSkyLightCursor(pos);
                return readUInt4LE(this.data, cursor);
            }
        },
        getBiome: {
            value: function getBiome(pos) {
                var cursor = getBiomeCursor(pos);
                return this.data.readUInt8(cursor);
            }
        },
        setBlockType: {
            value: function setBlockType(pos, id) {
                var cursor = getBlockCursor(pos);
                var data = this.getBlockData(pos);
                this.data.writeUInt16LE(id << 4 | data, cursor);
            }
        },
        setBlockData: {
            value: function setBlockData(pos, data) {
                var cursor = getBlockCursor(pos);
                var id = this.getBlockType(pos);
                this.data.writeUInt16LE(id << 4 | data, cursor);
            }
        },
        setBlockLight: {
            value: function setBlockLight(pos, light) {
                var cursor = getBlockLightCursor(pos);
                writeUInt4LE(this.data, light, cursor);
            }
        },
        setSkyLight: {
            value: function setSkyLight(pos, light) {
                var cursor = getSkyLightCursor(pos);
                writeUInt4LE(this.data, light, cursor);
            }
        },
        setBiome: {
            value: function setBiome(pos, biome) {
                var cursor = getBiomeCursor(pos);
                this.data.writeUInt8(biome, cursor);
            }
        },
        dump: {
            value: function dump() {
                return this.data;
            }
        },
        load: {
            value: function load(data) {
                if (!Buffer.isBuffer(data)) throw new Error("Data must be a buffer");
                if (data.length != BUFFER_SIZE) throw new Error("Data buffer not correct size (was " + data.size() + ", expected " + BUFFER_SIZE + ")");
                this.data = data;
            }
        }
    });

    return Chunk;
})();