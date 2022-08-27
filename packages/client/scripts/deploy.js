import { exec } from 'child_process';

exec('aws cloudformation describe-stacks --stack-name ssu-it-locker', (err, stdout, stderr) => {
	if (err) {
		console.error(`Exception thrown: ${err.message}`);
		return;
	}
	if (stderr) {
		console.error(`Error occurred: ${stderr}`);
		return;
	}
	const stackObj = JSON.parse(stdout);
	const s3Name = stackObj?.['Stacks']?.[0]?.['Outputs']?.find(
		(elem) => elem['OutputKey'] === 'FrontS3BucketName'
	)?.['OutputValue'];
	if (!s3Name) {
		console.error('Cannot find s3 bucket. Please deploy lambda first.');
		return;
	}
	console.log(`Found s3 bucket: ${s3Name}`);
	exec(`aws s3 sync ./build "s3://${s3Name}/" --delete`, (err, stdout, stderr) => {
		if (err) {
			console.error(`Exception thrown: ${err.message}`);
			return;
		}
		if (stderr) {
			console.error(`Error occurred: ${stderr}`);
			return;
		}
		console.log(`${stdout}`);
		console.log('File uploaded, renaming html...');
		exec(`aws s3api list-objects --bucket ${s3Name}`, (err, stdout, stderr) => {
			if (err) {
				console.error(`Exception thrown: ${err.message}`);
				return;
			}
			if (stderr) {
				console.error(`Error occurred: ${stderr}`);
				return;
			}
			const files = JSON.parse(stdout);
			const contents = files['Contents'];
			contents.forEach((content) => {
				const key = content['Key'];
				if (
					key.endsWith('.html') &&
					!key.endsWith('index.html') &&
					!key.endsWith('400.html') &&
					!key.endsWith('403.html') &&
					!key.endsWith('404.html')
				) {
					exec(
						`aws s3 mv s3://${s3Name}/${key} s3://${s3Name}/${key.substr(
							0,
							key.lastIndexOf('.html')
						)}`,
						(err, stdout, stderr) => {
							if (err) {
								console.error(`Exception thrown: ${err.message}`);
								return;
							}
							if (stderr) {
								console.error(`Error occurred: ${stderr}`);
								return;
							}
							console.log(`${stdout}`);
						}
					);
				}
			});
		});
	});
});
