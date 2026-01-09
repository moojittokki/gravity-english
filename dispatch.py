import subprocess
import argparse
import os
import re

# Configuration
AGENTS = {
    "frontend": {
        "branch": "agent/frontend",
        "prompt_file": "prompts/frontend.txt"
    },
    "backend": {
        "branch": "agent/backend",
        "prompt_file": "prompts/backend.txt"
    }
}

def run_command(command, cwd=None):
    """Runs a shell command and returns output."""
    try:
        result = subprocess.run(
            command, shell=True, check=True, cwd=cwd,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(e.stderr)
        raise

def get_agent_response(agent_role, task_description, target_file):
    """Invokes the gemini CLI with the agent persona."""
    prompt_path = AGENTS[agent_role]["prompt_file"]
    
    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    full_prompt = (
        f"{system_prompt}\n\n"
        f"TASK: {task_description}\n"
        f"INSTRUCTION: YOU MUST output the full content of '{target_file}' inside a markdown code block (```...```). "
        f"Do not output anything else."
    )

    # Call gemini CLI via pipe
    process = subprocess.Popen(
        ["gemini", "--output-format", "text"], 
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = process.communicate(input=full_prompt)
    
    if process.returncode != 0:
        raise Exception(f"Gemini CLI failed: {stderr}")
        
    return stdout

def extract_code_block(response):
    """Extracts content from markdown code blocks."""
    match = re.search(r"```(?:\w+)?\n(.*?)```", response, re.DOTALL)
    if match:
        return match.group(1).strip()
    return response.strip() # Fallback if no block found

def checkout_branch(branch_name):
    """Switches to the specified git branch."""
    current_branch = run_command("git branch --show-current")
    if current_branch == branch_name:
        return

    # Check if branch exists
    branches = run_command("git branch --list")
    if branch_name not in branches:
        # Create if not exists (should verify based on main usually, but simple for now)
        run_command(f"git checkout -b {branch_name}") 
    else:
        run_command(f"git checkout {branch_name}")

def dispatch_task(agent_role, task, target_file):
    print(f"🤖 Dispatching Task to Agent: [{agent_role.upper()}]")
    print(f"📝 Task: {task}")
    print(f"📂 Target File: {target_file}")
    
    agent_config = AGENTS.get(agent_role)
    if not agent_config:
        print(f"❌ Error: Agent '{agent_role}' not defined.")
        return

    # 1. Switch to Agent's Desk (Branch)
    print(f"🔄 Switching to workspace: {agent_config['branch']}...")
    try:
        run_command(f"git checkout {agent_config['branch']}")
    except:
        # Try creating it if it doesn't exist (from main)
        run_command("git checkout main")
        run_command(f"git checkout -b {agent_config['branch']}")

    # 2. Get Work from Agent
    print("⏳ Agent is working (generating code)...")
    try:
        response = get_agent_response(agent_role, task, target_file)
        code_content = extract_code_block(response)
    except Exception as e:
        print(f"❌ Agent failed: {e}")
        return

    # 3. Save Work
    print(f"💾 Saving work to {target_file}...")
    with open(target_file, "w") as f:
        f.write(code_content)

    # 4. Commit Work
    print("📦 Committing changes...")
    run_command(f"git add {target_file}")
    commit_msg = f"{agent_role.capitalize()}: {task}"
    run_command(f"git commit -m '{commit_msg}'")
    
    print(f"✅ Task Complete! Work saved in branch '{agent_config['branch']}'.")
    print("---------------------------------------------------")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI Team Manager")
    parser.add_argument("--agent", required=True, choices=["frontend", "backend"], help="Role to dispatch")
    parser.add_argument("--task", required=True, help="Task description")
    parser.add_argument("--file", required=True, help="Target file name")
    
    args = parser.parse_args()
    
    dispatch_task(args.agent, args.task, args.file)
