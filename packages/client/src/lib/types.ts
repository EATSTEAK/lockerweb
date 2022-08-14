export type LockerCount = {
	[department: string]: {
		canRserve: boolean;
		lockerLeft: number;
		totalLocker: number;
		availableFrom: Date;
		availableTo: Date;
		contact: string;
		floors: {
			[floor: string]: {
				canReserve: boolean;
				percentage: number;
				totalLocker: number;
				lockerLeft: number;
			};
		};
	};
};
