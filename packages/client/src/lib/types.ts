export type LockerCount = {
	[department: string]: DepartmentLockerCount;
};

export type DepartmentLockerCount = {
	departmentName: string;
	canReserve: boolean;
	lockerLeft: number;
	totalLocker: number;
	availableFrom?: Date;
	availableTo?: Date;
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
