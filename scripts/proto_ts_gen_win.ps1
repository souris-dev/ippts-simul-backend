# Powershell script to generate typescript definitions from
# .proto files under ../proto/
# Run this script from the project root directory

$this_dir = Get-Location
$PROTOC_GEN_TS_PATH = -join($this_dir.Path, "\node_modules\.bin\protoc-gen-ts.cmd")
$GRPC_TOOLS_NODE_PROTOC = "./node_modules/.bin/grpc_tools_node_protoc"
$PROTO_FILES_SUBDIR = "proto"
$PROTO_FILES_DIR = -join($this_dir.Path, "\", $PROTO_FILES_SUBDIR)
$OUT_DIR = -join($PROTO_FILES_DIR, "\gen")

if (!(Test-Path -Path $OUT_DIR)) {
    Write-Host "Output directory $OUT_DIR not found, creating directory."
    mkdir $OUT_DIR
}

$proto_dir_star = -join($PROTO_FILES_DIR, "\*")
$protofiles = Get-ChildItem -Path $proto_dir_star -Name -Include *.proto

Write-Host "`nGenerating ts definitions and output in directory:", $OUT_DIR

foreach ($f in $protofiles) {
    $params1 = '--js_out="import_style=commonjs,binary:' + $OUT_DIR + '"'
    $params2 = '--plugin="protoc-gen-ts=' + $PROTOC_GEN_TS_PATH + '"'
    $params3 = '--ts_out="' + $OUT_DIR + '"'
    $incl = '-I' + $PROTO_FILES_DIR

    Write-Host "Generating ts definitions and js output for:", $f

    & $GRPC_TOOLS_NODE_PROTOC $params1 $params2 $params3 $incl $f
}