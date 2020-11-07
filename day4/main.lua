#!/usr/bin/lua

function is_valid(number, part2)
	local n = nil
	local low = -1
	local last = -1
	local dubs = false
	local cons = 0
	for c in string.gmatch(tostring(number), '%d') do
		n = tonumber(c)
		if n < low then return false end
		low = n

		if not dubs then
			if last == n then
				cons = cons + 1
				dubs = not part2
			else
				dubs = cons == 1
				cons = 0
			end
			last = n
		end
	end 
	return dubs or cons == 1
end

local part1 = 0
local part2 = 0
local start = 147981
local finish = 691423
for cursor = start, finish do
	if (is_valid(cursor)) then 
		part1 = part1 + 1
		if (is_valid(cursor, true)) then 
			part2 = part2 + 1
		end
	end
end

print('part 1: '..part1)
print('part 2: '..part2)
