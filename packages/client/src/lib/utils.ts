export const getCookieValue = (name: string) =>
	document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

export function getDepartmentLockerCountsByFloor(
	config: ServiceConfig,
	departmentId: string
): { [buildingNum: string]: { [floor: string]: number } } {
	function countLockers([from, to]: [number, number]): number {
		return to - from + 1;
	}

	const deptLockerSubsections: [string, string, LockerSubsection[]][] = Object.values(
		config.buildings
	).flatMap((building) => {
		return Object.entries(building.lockers)
			.map<[string, string, LockerSubsection[]]>(([floor, sections]) => {
				const subsections: LockerSubsection[] = Object.values(sections).flatMap<LockerSubsection>(
					(section: LockerSection) =>
						section.subsections.filter((subsection) => subsection.department === departmentId)
				);
				return [building.id, floor, subsections];
			})
			.filter(([buildingNum, floor, subsections]) => subsections.length);
	});
	return deptLockerSubsections.reduce<{ [buildingNum: string]: { [floor: string]: number } }>(
		(result, [buildingNum, floor, subsections]) => {
			if (typeof result[buildingNum] !== 'object') result[buildingNum] = {};
			if (typeof result[buildingNum][floor] !== 'number') result[buildingNum][floor] = 0;
			result[buildingNum][floor] += subsections.reduce<number>(
				(a, subsection) => a + countLockers(subsection.range),
				0
			);
			return result;
		},
		{}
	);
}

export function getDepartmentNameById(configs: Config[], departmentId: string): string | undefined {
	return configs?.find((conf) => conf.id === departmentId)?.name;
}

export function isActivated(activateFrom: Date, activateTo: Date): boolean {
	if (activateFrom && activateTo) {
		return activateFrom.getTime() <= Date.now() && activateTo.getTime() > Date.now();
	} else if (activateFrom) {
		return activateFrom.getTime() <= Date.now();
	} else if (activateTo) {
		return activateTo.getTime() > Date.now();
	}
	return true;
}

export function getBuildingName(
	buildings: { [buildingId: string]: Building },
	buildingId: string
): string {
	return buildings?.[buildingId]?.name;
}

export function extractLockerInfoFromId(lockerId: string): {
	buildingId: string;
	floor: string;
	sectionId: string;
	lockerNum: number;
} {
	const [buildingId, floor, locker] = lockerId.split('-');
	const sectionId = locker.slice(0, 1);
	const lockerNum = parseInt(locker.slice(1));
	return {
		buildingId,
		floor,
		sectionId,
		lockerNum
	};
}
