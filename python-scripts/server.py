from flask import Flask, request

app = Flask(__name__)

@app.route('/run-task', methods=['POST'])
def run_task():
    task = request.json.get("task", "default")
    
    if task == "task1":
        return {"message": "Task 1 executed"}
    elif task == "task2":
        return {"message": "Task 2 executed"}
    else:
        return {"message": "Unknown task"}

if __name__ == '__main__':
    app.run(port=5000) 
