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

local function select_param(mode, mem, p, state, n)
	local m = mode[n] or 0
	local literal = mem:at(p + n)
	local value = literal
	if m == 0 then
		value = mem:at(value)
	end
	state:debug('param ', n ,' (', literal, ') mode ', m, ': ', value)
	return value
end

local operations = {}
operations[1] = function(mode, mem, p, state)
	local left = select_param(mode, mem, p, state, 1)
	local right = select_param(mode, mem, p, state, 2)
	local position = mem:at(p + 3)
	state:debug('(add): [', position, '] = ', left, ' + ', right)
	mem:set(position, left + right)
	return p + 4
end
operations[2] = function(mode, mem, p, state)
	local left = select_param(mode, mem, p, state, 1)
	local right = select_param(mode, mem, p, state, 2)
	local position = mem:at(p + 3)
	state:debug('(mul): [', position, '] = ', left, ' * ', right)
	mem:set(position, left * right)
	return p + 4
end
operations[3] = function(mode, mem, p, state)
	io.write('> ')
	local input = tonumber(io.read())
	local position = mem:at(p + 1)
	state:debug('(inp): [', position, '] = ', input)
	mem:set(position, input)
	return p + 2
end
operations[4] = function(mode, mem, p, state)
	local value = select_param(mode, mem, p, state, 1)
	if mode[1] == 0 then
		state:debug('(out): [', position, ']')
	else
		state:debug('(out): ', position)
	end
	io.write('= ' .. value .. '\n')
	return p + 2
end
operations[5] = function(mode, mem, p, state)
	local conditional = select_param(mode, mem, p, state, 1)
	local destination = select_param(mode, mem, p, state, 2)
	if conditional ~= 0 then
		state:debug('(jit): jumping to ', destination)
		return destination
	end
	return p + 3
end
operations[6] = function(mode, mem, p, state)
	local conditional = select_param(mode, mem, p, state, 1)
	local destination = select_param(mode, mem, p, state, 2)
	if conditional == 0 then
		state:debug('(jif): jumping to ', destination)
		return destination
	end
	return p + 3
end
operations[7] = function(mode, mem, p, state)
	local left = select_param(mode, mem, p, state, 1)
	local right = select_param(mode, mem, p, state, 2)
	local position = mem:at(p + 3)
	local value = left < right and 1 or 0
	state:debug('(lt): [', position, '] = ', value)
	mem:set(position, value)
	return p + 4
end
operations[8] = function(mode, mem, p, state)
	local left = select_param(mode, mem, p, state, 1)
	local right = select_param(mode, mem, p, state, 2)
	local position = mem:at(p + 3)
	local value = left == right and 1 or 0
	state:debug('(lt): [', position, '] = ', value)
	mem:set(position, value)
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
	for opcode in string.gmatch(input, '(-?%d+),?') do
		self.memory:set(self.memory:size(), tonumber(opcode))
	end
	return self
end

local function parse_opcode(instruction)
	local stack = {}
	local opcode = {id = nil, param = {}}
	for d in string.gmatch(tostring(instruction), '%d') do
		stack[#stack + 1] = d
	end
	if #stack == 1 then
		opcode.id = tonumber(stack[#stack])
	else
		local n = {
			table.remove(stack, #stack - 1),
			table.remove(stack, #stack)
		}
		opcode.id = tonumber(table.concat(n))
		for i = #stack, 1 , -1 do
			opcode.param[#opcode.param + 1] = tonumber(stack[i])
		end
	end
	return opcode
end

function m:run(i, d)
	local raw
	local opcode
	local p = i or 0
	self.debug_mode = d
	while true do
		raw = self.memory:at(p)
		opcode = parse_opcode(raw)
		self:debug('[', p, ']', ': ', raw, '(', opcode.id, ')')
		if opcode.id == 99 then break end
		p = operations[opcode.id](opcode.param, self.memory, p, self)
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
