// Generates ts definitions
// using os-specific script

var exec = require('child_process').exec;
var os = require('os');

function puts(error, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
}

console.log("Generating ts definitions from .proto files.");

if (os.type() === "Linux" || os.type() === "Darwin") {
    exec("chmod 400 scripts/proto_ts_gen_bash.sh");
    exec("bash scripts/proto_ts_gen_bash.sh", puts);
}
else if (os.type() === "Windows_NT") {
    exec("powershell.exe scripts/proto_ts_gen_win.ps1", puts);
}
