:: Use the following command in Vim on the log:
:: %s/^.* Started uploading.*\.$//ge | %s/^.* Finished uploading.*total\.$//ge | %s/^.* Image \(.* was successfully uploaded\.$\)\@=/del "/ge | %s/.* Couldn't upload \(.*: image already exists here\.\)\@=/del "/ge | %s/: image already exists here\.$/"/ge | %s/ was successfully uploaded\.$/"/ge | %s/.* Couldn't upload \(.*: image too big? too small? corrupted?\.\)\@=/move "/ge | %s/: image too big? too small? corrupted?\./" upload_failure_dimensions/ge | %s/.* Couldn't upload \(.*: undefined\.$\)\@=/move "/ge | %s/: undefined\.$/" upload_failure_undefined/ge | g/^$/d

If Not Exist "upload_failure_dimensions\" (
    mkdir upload_failure_dimensions
)

If Not Exist "upload_failure_undefined\" (
    mkdir upload_failure_undefined
)

TIMEOUT 3

:: [Replace this line with the log text.]

TIMEOUT 999
