-- Daimakaimura (daimakai)
-- This script reads Arthur's current armor and weapon state to execute some functions
-- In this case, I copy the specific armor and weapon graphics over some generic file for display in OBS.

local Armor
local Transform
local Weapon
local Credits

local mem = manager:machine().devices[":maincpu"].spaces["program"]

local function writeFile(filename, contents)
	local file = io.open(filename, "w")
	file:write(contents)
	file:close()
end

local function updateArmor()
	if (Transform > 4) then
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\duckjump.png C:\\Stream\\Resources\\InputDisplay\\jump.png")
	else
		if (Armor == 1) then
			os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\nakedjump.png C:\\Stream\\Resources\\InputDisplay\\jump.png")
		elseif (Armor == 2) then
			os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\steeljump.png C:\\Stream\\Resources\\InputDisplay\\jump.png")
		elseif (Armor == 3) then
			os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\goldjump.png C:\\Stream\\Resources\\InputDisplay\\jump.png")
		elseif (Armor == 0) then
			os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\oldjump.png C:\\Stream\\Resources\\InputDisplay\\jump.png")
		end
	end
end

local function updateWeapon()
	if (Weapon == 1) then
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\dagger.png C:\\Stream\\Resources\\InputDisplay\\weapon.png")
	elseif (Weapon == 2) then
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\firewater.png C:\\Stream\\Resources\\InputDisplay\\weapon.png")
	elseif (Weapon == 3) then
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\sword.png C:\\Stream\\Resources\\InputDisplay\\weapon.png")
	elseif (Weapon == 4) then
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\axe.png C:\\Stream\\Resources\\InputDisplay\\weapon.png")
	elseif (Weapon == 5) then
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\discus.png C:\\Stream\\Resources\\InputDisplay\\weapon.png")
	elseif (Weapon == 6) then
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\cannon.png C:\\Stream\\Resources\\InputDisplay\\weapon.png")
	else
		os.execute("xcopy /y C:\\Stream\\Resources\\InputDisplay\\lance.png C:\\Stream\\Resources\\InputDisplay\\weapon.png")
	end
end

emu.register_frame_done(function()
	-- These values seem to differ by some of the mame debugger values by 1 byte for some reason.  But it works consistently.
	local NewArmor = mem:read_u8(0xff07AC)
	local NewTransform = mem:read_u8(0xff07AB)
	local NewCredits = mem:read_u8(0xff0647)
	local NewWeapon = mem:read_u8(0xff07C6)
	local updateA = 0
	
	if (Transform ~= NewTransform and NewTransform >= 0 and NewTransform <= 6) then
		Transform = NewTransform
		updateA = 1
	end
	
	if (Armor ~= NewArmor and NewArmor >= 0 and NewArmor <= 3) then
		Armor = NewArmor
		updateA = 1		
	end
	
	if (updateA == 1) then 
		updateArmor() 
	end
	
	if (Weapon ~= NewWeapon and NewWeapon >= 0 and NewWeapon <= 7) then
		Weapon = NewWeapon
		updateWeapon()
	end
end)