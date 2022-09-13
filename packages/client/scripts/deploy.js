import { exec } from 'child_process';

exec('aws cloudformation describe-stacks --stack-name lockerweb', (err, stdout, stderr) => {
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
    (elem) => elem['OutputKey'] === 'FrontS3BucketName',
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
  });
});
