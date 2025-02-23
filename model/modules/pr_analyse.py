from github import Github, GithubException, InputGitTreeElement
from halo import Halo
import os
from rich.console import Console
import time
import pyrebase
from modules.slack_bot import send_slack_notification

# Initialize Firebase with existing config
firebase_config = {
    "apiKey": os.getenv("FAPIKEY"),
    "authDomain": os.getenv("AUTHDOMAIN"),
    "databaseURL": os.getenv("DATABASEURL"),
    "projectId": os.getenv("PROJECTID"),
    "storageBucket": os.getenv("STORAGEBUCKET"),
    "messagingSenderId": os.getenv("MESSAGINGSENDERID"),
    "appId": os.getenv("APPID"),
    "measurementId": os.getenv("MEASUREMENTID"),
}
firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()

github_token = os.getenv("GITHUB_TOKEN")
g = Github(github_token)
repo_name = "RajBhattacharyya/pv_app_api"
repo = g.get_repo(repo_name)
branch_name = "optimize-workflow"
workflow_path = ".github/workflows/deploy.yml"
commit_message = "Optimized GitHub Actions for Carbon Efficiency"
console = Console()


def create_pr(optimized_yaml, improvement_summary):
    """Creates a PR with the optimized workflow changes and opens an issue discussion."""
    with Halo(text="Checking for existing branches...", spinner="dots"):
        try:
            branch_ref = repo.get_git_ref(f"heads/{branch_name}")
            branch_ref.delete()
        except GithubException:
            pass

    with Halo(text="Creating new branch...", spinner="dots"):
        main_ref = repo.get_git_ref("heads/main")
        main_sha = main_ref.object.sha
        branch_ref = repo.create_git_ref(f"refs/heads/{branch_name}", main_sha)

    with Halo(text="Creating commit with optimized workflow...", spinner="dots"):
        blob = repo.create_git_blob(optimized_yaml, "utf-8")
        element = InputGitTreeElement(
            path=workflow_path, mode="100644", type="blob", sha=blob.sha
        )
        tree = repo.create_git_tree([element], base_tree=repo.get_git_tree(main_sha))
        parent_commit = repo.get_git_commit(main_sha)
        commit = repo.create_git_commit(commit_message, tree, [parent_commit])
        branch_ref.edit(commit.sha)

    pr_body = f"""
    ## Why This Change?
    {improvement_summary}

    ## Summary
    - **Optimized workflow for carbon efficiency**
    - **Reduced unnecessary job runs**
    - **Minimized redundant processes to lower CI/CD emissions**
    """

    with Halo(text="Creating Pull Request on GitHub...", spinner="dots"):
        pr = repo.create_pull(
            title="Optimize Workflow for Carbon Efficiency",
            body=pr_body,
            head=branch_name,
            base="main",
        )
        
        # Update realtime PR status
        db.child("has_new_pr").set(True)

    send_slack_notification(pr.html_url)
    
    return pr


def check_pr_status(pr_number, max_attempts=12, wait_seconds=5):
    attempts = 0
    while attempts < max_attempts:
        pr = repo.get_pull(pr_number)
        if pr.mergeable is True:
            return True, pr
        elif pr.mergeable is False and pr.mergeable_state != "unknown":
            console.print(f"[red]PR not mergeable. State: {pr.mergeable_state}[/red]")
            return False, pr
        console.print(
            "[yellow]GitHub is still evaluating PR mergeability. Waiting...[/yellow]"
        )
        time.sleep(wait_seconds)
        attempts += 1
    return False, repo.get_pull(pr_number)


def merge_pr(pr):
    mergeable, updated_pr = check_pr_status(pr.number)
    if mergeable:
        with Halo(text="Merging Pull Request...", spinner="dots"):
            try:
                updated_pr.merge(commit_message="Merging AI-optimized workflow")
                # Update realtime database when PR is merged
                db.child("has_new_pr").set(False)
                console.print(
                    f"[bold green]✅ PR Merged Successfully: {updated_pr.html_url}[/bold green]"
                )
            except GithubException as e:
                console.print(
                    f"[red]❌ GitHub API Error during merge: {e.data.get('message', str(e))}[/red]"
                )
    else:
        console.print("[red]❌ PR is not mergeable. Manual review required.[/red]")