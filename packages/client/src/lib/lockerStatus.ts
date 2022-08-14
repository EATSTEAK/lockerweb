// eslint-disable-next-line import/extensions
import { variables } from '$lib/variables';

export const lockerStatus = () => {
	fetch(variables.baseUrl + '/locker/count')
		.then((res) => res.json())
		.then(data);
};
