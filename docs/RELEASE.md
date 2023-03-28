## Releasing a new version of RCT

Open RCT Jira Board and check and set `Fix version` of each JIRA issue that is being released.
Once all desired issues for the given release are in the `Ready for Release` status, start the process:

1. Create a new branch in RCT GitHub repository by following the pattern: `release/x.y.z`. We use [semantic versioning](https://semver.org/):  
- `X - MAJOR` version when you make incompatible API changes
- `Y - MINOR` version when you add functionality in a backwards compatible manner
- `Z - PATCH` version when you make backwards compatible bug fixes
The following command can be used in the local terminal to automatically bump the version: `npm version <type>` where `type` can be: `major`, `minor` or `patch`.
2. Using the newly created branch, raise a Pull-Request against the default repository branch to validate checks. Once checks passed, merge the PullRequest.
3. Create a **DRAFT** GitHub release with **BOTH** the **title** and **tag** in the following format: `aliceo2/run-condition-table@<version>` where `version` follows `x.y.z` format
4. Update status of JIRA issues to `CLOSE` (You can use Bulk Change feature to edit multiple issues at once)
5. Generate `Release Notes` from JIRA and add them to the earlier GitHub release description.
6. Publish release
   Our release workflow will automatically: 
   - release the new module to NPM
   - build a tar file according to ALICE standards
   - publish the tar file to our own repository S3

7. Bump version in Ansible Recipe [system-configuration](https://gitlab.cern.ch/AliceO2Group/system-configuration) and trigger the pipeline for FLP
8. Mark version as released in JIRA and create the next release so that future tickets can be associated with it.
