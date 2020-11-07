#!/usr/bin/lua

local Machine = require 'machine'
local file = io.open(arg[1] or './input.txt')
local input = file:read()
file:close()

local m = Machine()
for x = 0, 99 do
	for y = 0, 99 do
		local rv = m:load(input)
			:set(1, x)
			:set(2, y)
			:run()
			:inspect(0)
		if rv == 19690720 then
			print((100 * x) + y)
			os.exit(0)
		end
	end
end

