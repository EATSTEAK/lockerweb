type DaoData = {
	type: { S: `user` | 'config' };
	id: { S: string };
}

type User = {
	id: string;
	name: string;
	isAdmin: boolean;
	department: string;
	lockerId?: string;
	claimedUntil?: string;
}

type UserUpdateRequest = {
	id: string;
	name?: string;
	isAdmin?: boolean;
	department?: string;
	lockerId?: string;
	claimedUntil?: string;
}

type UserDeleteRequest = {
	id: string;
}

type UserDao = DaoData & {
	n: { S: string };
	iA: { BOOL: boolean };
	d: { S: string };
	lockerId?: { S: string };
	cU?: { S: string };
}

type Config = {
	id: string;
	name: string;
	activateFrom: string;
	activateTo: string;
}

type ConfigDao = DaoData & {
	n: string;
	aF: string;
	aT: string;
}

type DepartmentConfig = Config & {
	contact?: string;
}

type DepartmentConfigDao = DaoData & ConfigDao & {
	c?: string;
}

type ServiceConfig = Config & {
	buildings: {
		[buildingId: string]: Building
	},
	lockers: {
		[lockerName: string]: LockerSection
	}
}

type ServiceConfigDao = DaoData & ConfigDao & {
	b: { M: { [buildingId: string]: { M: BuildingData } } }
	l: { M: { [lockerName: string]: { M: LockerSectionData } } }
}

type Building = {
	id: { S: string };
	name: { S: string };
}

type BuildingData = {
	i: string;
	n: string;
}

type LockerSection = {
	subsections: LockerSubsection[];
	disabled: string[];
	grid: [number, number]
}

type LockerSectionData = {
	s: { L: { M: LockerSubsectionData }[] };
	d: { L: { S: string } };
	grid: { L: [{ N: string }, { N: string }] };
}

type LockerSubsection = {
	department: string;
	range: [number, number]
}

type LockerSubsectionData = {
	d: { S: string },
	range: { L: [{ N: string }, { N: string }] };
}