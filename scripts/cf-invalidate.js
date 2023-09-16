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
  const cfName = stackObj?.['Stacks']?.[0]?.['Outputs']?.find(
    (elem) => elem['OutputKey'] === 'CfDistributionId',
  )?.['OutputValue'];
  if (!cfName) {
    console.error('Cannot find cloudfront distribution. Please deploy stack first.');
    return;
  }
  console.log(`Found cloudfront distribution: ${cfName}`);
  exec(`aws cloudfront create-invalidation --distribution-id ${cfName} --paths '/*'`, (err, stdout, stderr) => {
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
