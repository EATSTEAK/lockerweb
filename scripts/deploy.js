const execSync = require("child_process").execSync;

const arg = process.argv.slice(2).join(" ") || "";
execSync("pnpm run -r --filter=server deploy " + arg, { stdio: [0, 1, 2] });
execSync("pnpm run -r --filter=client deploy", { stdio: [0, 1, 2] });
