local exports = {}
exports.name = "ghoulsrace"
exports.version = "0.0.1"
exports.description = "GhoulsHub(tm) Race Server client script"
exports.license = "GNU General Public License v3.0"
exports.author = { name = "Zed Ahmad" }

local ghoulsrace = exports

function ghoulsrace.startplugin()
	local json = require "json"

	-- config ----------------------------------------------
	local host = "ghoulshub.com"
	local port = "5000"
	local playername = "PLAYERNAME"
	--------------------------------------------------------

	local data = {}
	local frames = 0
	local shake = 0
	local serverConf

	local mem

	local sock = emu.file("wr")
	sock:open("socket." .. host .. ":" .. port)

	emu.register_start(function()
		mem = manager:machine().devices[":maincpu"].spaces["program"]
	end)

	emu.register_frame_done(function()
		frames = frames + 1

		if (shake == 0) then
			-- TODO: Add fixed length header containing size of communication.  Currently just reads 256 bytes
			serverConf = json.decode(sock:read(256))
			if (serverConf ~= nil) then
				print("Your player ID is " .. serverConf.id)
				print("Server set tick to " .. serverConf.tick)
				shake = 1
			end
		end

		-- tick
		if (shake == 1 and (frames % serverConf.tick == 0)) then
			-- TODO: clean up these addresses/read method, cps1 memory is big endian and word addressed so the block below can lead to confusion
			data.playername = playername
			data.armor = mem:read_u8(0xFF07AC)
			data.transform = mem:read_u8(0xFF07AB)
			data.credits = mem:read_u8(0xFF0647)
			data.weapon = mem:read_u8(0xFF07C6)
			data.xpos = mem:read_u16(0xFF079A)
			data.ypos = mem:read_u16(0xFF079E)
			data.xcam = mem:read_u16(0xFF069E)
			data.ycam = mem:read_u16(0xFF06A8)
			data.loop = mem:read_u8(0xFF07D5)
			data.stage = mem:read_u8(0xFF07C8)

			sock:write(json.encode(data))
		end
	end)
end

return exports