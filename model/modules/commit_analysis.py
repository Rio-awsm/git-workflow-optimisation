from github import Github, InputGitTreeElement, GithubException
import os
import pyrebase

# Validate Firebase environment variables
firebase_env_vars = [
    "FAPIKEY",
    "AUTHDOMAIN",
    "DATABASEURL",
    "PROJECTID",
    "STORAGEBUCKET",
    "MESSAGINGSENDERID",
    "APPID",
    "MEASUREMENTID",
]

firebase_vars_missing = [var for var in firebase_env_vars if not os.getenv(var)]

if firebase_vars_missing:
    print(
        f"⚠️ Warning: Missing Firebase environment variables: {', '.join(firebase_vars_missing)}"
    )
    print("Firebase functionality will be disabled.")
    db = None
    firebase = None
else:
    try:
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
        print("✅ Firebase initialized successfully")
    except Exception as e:
        print(f"❌ Firebase initialization failed: {e}")
        db = None
        firebase = None


def get_repo_details():
    if not db:
        # Return default values or raise an error
        raise ValueError("Firebase is not initialized. Cannot fetch repo details.")

    data = db.child("users").get().val()

    if data and "owner_name" in data and "repo_name" in data:
        return data["owner_name"], data["repo_name"]
    else:
        raise ValueError("Firebase does not have required fields.")


def update_github_connection():
    global repo, BOT_USERNAME

    try:
        owner_name, repo_name = get_repo_details()
        github_token = os.getenv("GITHUB_TOKEN")

        if not github_token:
            raise ValueError("GITHUB_TOKEN environment variable is not set")

        g = Github(github_token)
        repo = g.get_repo(f"{repo_name}")
        BOT_USERNAME = owner_name
        print(f"Connected to repo: {repo.full_name}")
    except Exception as e:
        print(f"Error updating GitHub connection: {e}")
        # Set defaults or handle gracefully
        github_token = os.getenv("GITHUB_TOKEN")
        if github_token:
            g = Github(github_token)
            # Use a default repo or handle this case
            repo = None
            BOT_USERNAME = "unknown"


def firebase_listener(message):
    print("Firebase update detected, updating repo connection...")
    update_github_connection()


repo, BOT_USERNAME = None, None

# Only attempt to update connection if Firebase is available
if db:
    try:
        update_github_connection()
        db.child("users").stream(firebase_listener)
    except Exception as e:
        print(f"Error setting up Firebase listener: {e}")
else:
    # Handle case where Firebase is not available
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token:
        g = Github(github_token)
        # You'll need to set a default repo or get it from elsewhere
        try:
            repo = g.get_repo("RajBhattacharyya/pv_app_api")  # Default repo
            BOT_USERNAME = "RajBhattacharyya"  # Default bot username
            print(f"✅ Connected to default repo: {repo.full_name}")
        except Exception as e:
            print(f"❌ Error connecting to default repo: {e}")

workflow_path = ".github/workflows/deploy.yml"


def get_latest_commit():
    """Fetches the latest commit SHA from the main branch."""
    if not repo:
        raise ValueError("Repository is not initialized")
    return repo.get_commits()[0].sha


def fetch_commit_details(commit_sha):
    """Fetches the commit details including author and diff."""
    if not repo:
        raise ValueError("Repository is not initialized")

    commit = repo.get_commit(commit_sha)
    commit_author = commit.author.login if commit.author else "Unknown"

    diff_files = {file.filename: file.patch for file in commit.files}

    return {
        "author": commit_author,
        "diff_files": diff_files,
        "message": commit.commit.message,
    }


def is_bot_commit(commit_details):
    return (
        commit_details["author"] == BOT_USERNAME
        or "Optimized GitHub Actions for Carbon Efficiency" in commit_details["message"]
    )


def analyze_commit_diff(diff_files):
    suspicious_changes = []
    for filename, diff in diff_files.items():
        if workflow_path in filename or "github/workflows" in filename:
            suspicious_changes.append((filename, diff))
    return suspicious_changes
