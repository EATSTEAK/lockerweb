import lockerData from '../lockers.json';

type LockerMap = {
	[floor: string]: {
		[section: string]: {
			range: number[];
			department: 'E' | 'A' | 'C' | 'S' | 'G';
		}[];
	};
};

export const lockers: LockerMap = lockerData as LockerMap;

export function isValidLocker(
	lockerFloor: string,
	lockerId: string,
	department?: 'E' | 'A' | 'C' | 'S' | 'G'
): boolean {
	const parsedLockerId = lockerId.split('-');
	const lockerSectionNum = parseInt(parsedLockerId[1]);
	const selectedSections = lockers?.[lockerFloor]?.[parsedLockerId[0]];
	if (parsedLockerId.length !== 2) return false;
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
	lockerFloor: string,
	lockerId: string
): 'E' | 'A' | 'C' | 'S' | 'G' {
	const parsedLockerId = lockerId.split('-');
	const lockerSectionNum = parseInt(parsedLockerId[1]);
	const selectedSections = lockers?.[lockerFloor]?.[parsedLockerId[0]];
	if (parsedLockerId.length !== 2) throw new Error('Given locker is not valid');
	if (!selectedSections) throw new Error('Given locker is not valid');
	const section = selectedSections.find(
		(sect) => sect.range[0] <= lockerSectionNum && sect.range[1] >= lockerSectionNum
	);
	if (section) return section.department;
	else throw new Error('Given locker is not valid');
}