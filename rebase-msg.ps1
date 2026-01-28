# Script to change commit message during rebase
$commitMsg = "Cleanup: comments and messages"
git commit --amend -m $commitMsg
git rebase --continue
