/* Common DAO Definition */

type DaoData = {
	type: { S: `user` | 'config' };
	id: { S: string };
};

/* User Definition */

type User = {
	id: string;
	name: string;
	isAdmin: boolean;
	department: string;
	lockerId?: string;
	claimedUntil?: string;
};

type UserUpdateRequest = {
	id: string;
	name?: string;
	isAdmin?: boolean;
	department?: string;
	lockerId?: string | null;
	claimedUntil?: string | null;
};

type UserDeleteRequest = {
	id: string;
};

type UserDao = DaoData & {
	n: { S: string };
	iA: { BOOL: boolean };
	d: { S: string };
	lockerId?: { S: string };
	cU?: { S: string };
};

type AccessTokenInfo = {
	id: string;
	accessToken: string;
	tokenType: 'Bearer';
	expiresIn: number;
};

/* Config Definition */

type Config = {
	id: string;
	name: string;
	activateFrom?: string;
	activateTo?: string;
};

type ConfigDao = DaoData & {
	n: { S: string };
	aF?: { S: string };
	aT?: { S: string };
};

type DepartmentConfig = Config & {
	contact?: string;
};

type DepartmentConfigDao = DaoData &
	ConfigDao & {
		c?: { S: string };
	};

type ServiceConfig = Config & {
	buildings: {
		[buildingId: string]: Building;
	};
};

type ServiceConfigDao = DaoData &
	ConfigDao & {
		b: { M: { [buildingId: string]: { M: BuildingData } } };
	};

type Building = {
	id: string;
	name: string;
	lockers: {
		[floor: string]: {
			// TODO: Make buildings distinguishable
			[lockerName: string]: LockerSection;
		};
	};
};

type BuildingData = {
	i: { S: string };
	n: { S: string };
	l: {
		M: {
			[floor: string]: {
				M: {
					[lockerName: string]: { M: LockerSectionData };
				};
			};
		};
	};
};

type LockerSection = {
	subsections: LockerSubsection[];
	disabled: number[];
	height: number;
};

type LockerSectionData = {
	s: { L: { M: LockerSubsectionData }[] };
	d: { NS: string[] };
	h: { N: string };
};

type LockerSubsection = {
	department: string;
	range: [number, number];
};

type LockerSubsectionData = {
	d: { S: string };
	r: { L: [{ N: string }, { N: string }] };
};

type ConfigUpdateRequest = {
	id: string;
	name?: string;
	activateFrom?: string | null;
	activateTo?: string | null;
};

type DepartmentConfigUpdateRequest = ConfigUpdateRequest & {
	contact?: string;
};

type ServiceConfigUpdateRequest = ConfigUpdateRequest & {
	buildings?: {
		[buildingId: string]: Building;
	};
};

type LockerCountResponse = {
	[departmentId: string]: {
		[floor: string]: number;
	};
};

/* Error Definition */

type ResponsibleError = {
	errorType: string;
	message?: string;
	additionalInfo?: Record<string, unknown>;
};
