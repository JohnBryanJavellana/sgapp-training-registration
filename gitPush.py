import subprocess
import sys

def runProcess(branch, message):
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", str(message)])
    subprocess.run(["git", "push", "origin", str(branch)])
    subprocess.run(["git", "status"])

def main():
    if(len(sys.argv) <= 1):
        print("Check if branch is provided")
        return

    branch = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else "no-commit-message-yet"
    runProcess(branch=branch, message=message)

if __name__ == "__main__":
    main()
