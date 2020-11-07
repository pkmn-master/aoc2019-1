local Object = require 'object'

local Memory = Object:extend()

function Memory:init()
	self.m = {}
	return self
end

function Memory:set(a, v)
	self.m[a + 1] = v
	return self
end

function Memory:at(a)
	return self.m[a + 1]
end

function Memory:size()
	return #self.m
end

local operations = {}

operations[1] = function(p, m, state)
	local left = m:at(m:at(p + 1))
	local right = m:at(m:at(p + 2))
	local position = m:at(p + 3)
	state:debug('(add): [', position, '] = ', left, ' + ', right)
	m:set(position, left + right)
	return p + 4
end
operations[2] = function(p, m, state)
	local left = m:at(m:at(p + 1))
	local right = m:at(m:at(p + 2))
	local position = m:at(p + 3)
	state:debug('(mul): [', position, '] = ', left, ' * ', right)
	m:set(position, left * right)
	return p + 4
end

local m = Object:extend()

function m:init()
	self.debug_mode = false
	return self
end

function m:debug(...)
	if self.debug_mode then print(table.concat({...})) end
end

function m:load(input)
	self.memory = Memory()
	for opcode in string.gmatch(input, '(%d+),?') do
		self.memory:set(self.memory:size(), tonumber(opcode))
	end
	return self
end

function m:run(i, d)
	local opcode
	local p = i or 0
	self.debug_mode = d
	while true do
		opcode = self.memory:at(p)
		self:debug('[', p, ']', ': ', opcode)
		if opcode == 99 then break end
		p = operations[opcode](p, self.memory, self)
	end
	return self
end

function m:set(i, v)
	self.memory:set(i, v)
	return self
end

function m:inspect(i)
	return self.memory:at(i)
end

return m
