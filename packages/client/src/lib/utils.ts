export const getCookieValue = (name: string) =>
	document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

export function getDepartmentLockerCountsByFloor(
	config: ServiceConfig,
	departmentId: string
): { [floor: string]: number } {
	function countLockers([from, to]: [number, number]): number {
		return to - from + 1;
	}

	const deptLockerSubsections: [string, LockerSubsection[]][] = Object.values(
		config.buildings
	).flatMap((building) => {
		return Object.entries(building.lockers)
			.map<[string, LockerSubsection[]]>(([floor, sections]) => {
				const subsections: LockerSubsection[] = Object.values(sections).flatMap<LockerSubsection>(
					(section: LockerSection) =>
						section.subsections.filter((subsection) => subsection.department === departmentId)
				);
				return [floor, subsections];
			})
			.filter(([floor, subsections]) => subsections.length);
	});
	return deptLockerSubsections.reduce<{ [floor: string]: number }>(
		(result, [floor, subsections]) => {
			if (typeof result[floor] !== 'number') result[floor] = 0;
			result[floor] += subsections.reduce<number>(
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
