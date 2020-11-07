#!/usr/bin/lua

local file = io.open(arg[1] or './input.txt')
local total = 0
for line in file:lines() do
	local fuel = math.floor(tonumber(line) / 3) - 2
	total = total + fuel
	fuel = math.floor(fuel / 3) - 2
	while fuel > 0 do
		total = total + fuel
		fuel = math.floor(fuel / 3) - 2
	end
end
print(total)

