import lockerData from '../lockers.json';

type LockerMap = {
	[building: string]: {
		[floor: string]: {
			[section: string]: {
				range: number[];
				department: 'E' | 'A' | 'C' | 'S' | 'G';
			}[];
		};
	};

};

export const lockers: LockerMap = lockerData as LockerMap;

export function isValidLocker(
	lockerId: string,
	department: string
): boolean {
	const parsedLockerId = lockerId.split('-');
	const buildingNum = parsedLockerId[0];
	const lockerFloor = parsedLockerId[1];
	const lockerSection = parsedLockerId[2].substr(0, 1);
	const lockerSectionNum = parseInt(parsedLockerId[2].substr(1));
	const selectedSections = lockers?.[buildingNum]?.[lockerFloor]?.[lockerSection];
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
	lockerId: string
): string {
	const parsedLockerId = lockerId.split('-');
	const buildingNum = parsedLockerId[0];
	const lockerFloor = parsedLockerId[1];
	const lockerSection = parsedLockerId[2].substr(0, 1);
	const lockerSectionNum = parseInt(parsedLockerId[2].substr(1));
	const selectedSections = lockers?.[buildingNum]?.[lockerFloor]?.[lockerSection];
	if (parsedLockerId.length !== 3) throw new Error('Given locker is not valid');
	if (!selectedSections) Error('Given locker is not valid');
	const section = selectedSections.find(
		(sect) => sect.range[0] <= lockerSectionNum && sect.range[1] >= lockerSectionNum
	);
	if (section) return section.department;
	else throw new Error('Given locker is not valid');
}