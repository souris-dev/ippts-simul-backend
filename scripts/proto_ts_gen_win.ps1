# Powershell script to generate typescript definitions from
# .proto files under ../proto/
# Run this script from the project root directory

$this_dir = Get-Location
$PROTOC_GEN_TS_PATH = -join($this_dir.Path, "\node_modules\.bin\protoc-gen-ts.cmd")
$GRPC_TOOLS_NODE_PROTOC = "./node_modules/.bin/grpc_tools_node_protoc"
$PROTO_FILES_SUBDIR = "proto"
$PROTO_FILES_DIR = -join($this_dir.Path, "\", $PROTO_FILES_SUBDIR)

$OUT_DIRNAME = "protogen"
$OUT_SLAVE_DIR = -join($this_dir.Path, "\", "slave", "\", $OUT_DIRNAME)
$OUT_MASTER_DIR = -join($this_dir.Path, "\", "master", "\", $OUT_DIRNAME)

if (!(Test-Path -Path $OUT_SLAVE_DIR)) {
    Write-Host "Output directory $OUT_SLAVE_DIR not found, creating directory."
    mkdir $OUT_SLAVE_DIR
}

if (!(Test-Path -Path $OUT_MASTER_DIR)) {
    Write-Host "Output directory $OUT_MASTER_DIR not found, creating directory."
    mkdir $OUT_MASTER_DIR
}

$proto_dir_star = -join($PROTO_FILES_DIR, "\*")
$protofiles = Get-ChildItem -Path $proto_dir_star -Name -Include *.proto

Write-Host "`nGenerating ts definitions and output in directories:", $OUT_MASTER_DIR, "and", $OUT_SLAVE_DIR

# First generate the files into the slave directory
foreach ($f in $protofiles) {
    # See https://www.npmjs.com/package/ts-protoc-gen for the parameters

    $params1 = '--js_out="import_style=commonjs,binary:' + $OUT_SLAVE_DIR + '"'
    $params2 = '--plugin="protoc-gen-ts=' + $PROTOC_GEN_TS_PATH + '"'
    $params3 = '--ts_out="grpc_js:' + $OUT_SLAVE_DIR + '"'
    $params4 = '--grpc_out="grpc_js:' + $OUT_SLAVE_DIR + '"'
    $incl = '-I' + $PROTO_FILES_DIR

    Write-Host "Generating ts definitions and js output for:", $f

    & $GRPC_TOOLS_NODE_PROTOC $params1 $params2 $params4 $params3 $incl $f
}

# Next copy these files into the master directory
Copy-Item -Path $($OUT_SLAVE_DIR + '\*') -Destination $OUT_MASTER_DIR -Recurse