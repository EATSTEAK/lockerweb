export type LockerCount = {
	[department: string]: DepartmentLockerCount;
};

export type DepartmentLockerCount = {
	departmentName: string;
	canReserve: boolean;
	lockerLeft: number;
	totalLocker: number;
	activateFrom?: Date;
	activateTo?: Date;
	contact: string;
	floors: {
		// TODO: Make buildings distinguishable
		[floor: string]: {
			canReserve: boolean;
			percentage: number;
			totalLocker: number;
			lockerLeft: number;
		};
	};
};

export type DepthData = {
	id: string;
	name: string;
	children?: DepthData[];
};

/* ServiceSettings Editor Types */

export type BuildingRemoveRequest = { id: string };
export type BuildingUpdateRequest = { id: string; name: string };

export type SectionRemoveRequest = { floor: string; id: string };
export type SectionUpdateRequest = {
	floor: string;
	id: string;
	height: number;
	disabled: number[];
	subsections: LockerSubsection[];
};
