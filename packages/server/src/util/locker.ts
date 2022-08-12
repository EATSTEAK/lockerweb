export function isValidLocker(
	config: ServiceConfig,
	lockerId: string,
	department: string
) {
	const buildings = config.buildings;
	const parsedLockerId = lockerId.split('-');
	const buildingNum = parsedLockerId[0];
	const lockerFloor = parsedLockerId[1];
	const lockerSection = parsedLockerId[2].substr(0, 1);
	const lockerSectionNum = parseInt(parsedLockerId[2].substr(1));
	const selectedSections = buildings[buildingNum]?.lockers[lockerFloor]?.[lockerSection]?.subsections;
	if (parsedLockerId.length !== 3) return false;
	if (!selectedSections) return false;
	const section = selectedSections.find(
		(sect) =>
			sect.range[0] <= lockerSectionNum &&
			sect.range[1] >= lockerSectionNum &&
			(department === undefined || department === sect.department)
	);
	return section !== undefined;
}

export function getLockerDepartment(
	config: ServiceConfig,
	lockerId: string
) {
	const buildings = config.buildings;
	const parsedLockerId = lockerId.split('-');
	const buildingNum = parsedLockerId[0];
	const lockerFloor = parsedLockerId[1];
	const lockerSection = parsedLockerId[2].substr(0, 1);
	const lockerSectionNum = parseInt(parsedLockerId[2].substr(1));
	const selectedSections = buildings[buildingNum]?.lockers[lockerFloor]?.[lockerSection]?.subsections;
	if (parsedLockerId.length !== 3) throw new Error('Given locker is not valid');
	if (!selectedSections) Error('Given locker is not valid');
	const section = selectedSections.find(
		(sect) => sect.range[0] <= lockerSectionNum && sect.range[1] >= lockerSectionNum
	);
	if (section) return section.department;
	else throw new Error('Given locker is not valid');
}