from flask import Flask, request, send_file, jsonify
import os
from sentence_transformers import SentenceTransformer
from collections import defaultdict
from flask_cors import CORS
from dotenv import load_dotenv
import time
import requests
from groq import Groq
import sys
import subprocess
import io

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

semantic_model = SentenceTransformer('all-MiniLM-L6-v2')

sessions = defaultdict(lambda: {"questions_asked": 0, "candidate_name": None, "interview_data": []})

AUDIO_FOLDER = './audio_files'
if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

TTS_URL = "https://api.deepgram.com/v1/speak?model=aura-asteria-en"

def generate_speech(text, output_file):
    try:
        headers = {
            "Authorization": f"Token {DEEPGRAM_API_KEY}",
            "Content-Type": "text/plain"
        }

        payload = text.encode("utf-8")

        response = requests.post(TTS_URL, headers=headers, data=payload)

        if response.status_code == 200:
            with open(output_file, "wb") as f:
                f.write(response.content)
            print(f"✅ Speech saved as: {output_file}")
        else:
            print(f"❌ Error: {response.status_code}, {response.text}")

    except Exception as e:
        print(f"⚠️ Error: {e}")

@app.route('/speak', methods=['POST'])
def speak():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    timestamp = int(time.time())
    output_file = os.path.join(AUDIO_FOLDER, f'tts_output_{timestamp}.wav')

    generate_speech(text, output_file)

    return send_file(output_file, mimetype="audio/wav")

def generate_question(topic, candidate_name):
    prompt = f"""
    Only Generate a complex interview question (within 1 line, no more than 20 words) for an AI engineer named {candidate_name} about {topic} and use {candidate_name} for personal touch while asking the question.
    Step 1: Understanding the Purpose
    Goal:
    Recognize that the primary objective is to assess the candidate's foundational knowledge.
    Focus on evaluating the candidate’s grasp of basic principles and theories relevant to their field.
    Step 2: Question Structure
    Depth of Understanding:
    Design questions that probe the depth of the candidate's understanding rather than surface-level knowledge.
    Ensure questions are formulated to require detailed explanations and comprehensive responses.
    Core Principles and Terminologies:
    Include questions that ask candidates to define or explain core principles and terminologies.
    Avoid vague or overly broad questions; be specific in what you are asking.
    Step 3: Concise and Clear
    Ensure the question is concise (no more than 20 words) and fits within 1-2 lines.
    Examples:
    Incorporate examples in the questions where applicable to illustrate the concept being assessed.
    Examples help candidates relate to practical applications of the principles.
    Step 4: Consistency and Precision
    Strict Adherence to Structure:
    Follow the defined structure strictly to maintain consistency across all questions.
    Ensure each question aligns with the purpose of assessing foundational knowledge.
    Relevance and Alignment:
    Ensure questions are relevant to the candidate’s field and aligned with the foundational principles they need to know.
    Avoid questions that deviate from the core objective.
    """

    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful interviewer."},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.3-70b-versatile",
        max_tokens=50,
        temperature=0.6
    )
    return chat_completion.choices[0].message.content

@app.route('/generate_question', methods=['POST'])
def generate_next_question():
    data = request.json
    print(data)
    topic = data.get("topic", "")
    candidate_name = data.get("candidate_name", "Candidate")

    next_question = generate_question(topic, candidate_name)

    sessions[candidate_name]["questions_asked"] += 1

    return jsonify({"question": next_question})

@app.route('/start_session', methods=['POST'])
def start_session():
    data = request.json
    candidate_name = data.get("candidate_name", "Candidate")

    sessions[candidate_name] = {"questions_asked": 0, "candidate_name": candidate_name, "interview_data": []}

    initial_question = "What specific topic or domain are you well-versed in?"
    return jsonify({"question": initial_question, "candidate_name": candidate_name})

def execute_python(code):
    original_stdout = sys.stdout
    sys.stdout = output_capture = io.StringIO()

    try:
        exec(code)
        output = output_capture.getvalue()
        return output
    except Exception as e:
        return str(e)
    finally:
        sys.stdout = original_stdout

import tempfile
import os
import subprocess

def execute_java(code):
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            java_file_path = os.path.join(temp_dir, 'Main.java')
            class_file_path = os.path.join(temp_dir, 'Main.class')

            with open(java_file_path, 'w') as java_file:
                java_file.write(code)
            
            compile_result = subprocess.run(
                ['javac', java_file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            
            if compile_result.returncode != 0:
                return compile_result.stderr.decode()
            
            run_result = subprocess.run(
                ['java', '-classpath', temp_dir, 'Main'], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            
            if run_result.returncode != 0:
                return run_result.stderr.decode()
            
            return run_result.stdout.decode()
    except Exception as e:
        return str(e)

def execute_cpp(code):
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            cpp_file_path = os.path.join(temp_dir, 'temp.cpp')
            executable_path = os.path.join(temp_dir, 'temp')

            with open(cpp_file_path, 'w') as cpp_file:
                cpp_file.write(code)
            
            compile_result = subprocess.run(
                ['g++', cpp_file_path, '-o', executable_path],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            
            if compile_result.returncode != 0:
                return compile_result.stderr.decode()
            
            run_result = subprocess.run(
                [executable_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            
            if run_result.returncode != 0:
                return run_result.stderr.decode()
            
            return run_result.stdout.decode()
    except Exception as e:
        return str(e)

def execute_c(code):
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            c_file_path = os.path.join(temp_dir, 'temp.c')
            executable_path = os.path.join(temp_dir, 'temp_c')

            with open(c_file_path, 'w') as c_file:
                c_file.write(code)
            
            compile_result = subprocess.run(
                ['gcc', c_file_path, '-o', executable_path],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            
            if compile_result.returncode != 0:
                return compile_result.stderr.decode()
            
            run_result = subprocess.run(
                [executable_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            
            if run_result.returncode != 0:
                return run_result.stderr.decode()
            
            print(run_result.stdout.decode())
            return run_result.stdout.decode()
    except Exception as e:
        return str(e)

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    language = data.get('language', 'python')
    code = data.get('code', '')

    if not code:
        return jsonify({"error": "No code provided"}), 400

    result = handler(language, code)

    return jsonify({"output": result['body']})

def handler(language, code):
    if language == 'python':
        result = execute_python(code)
    elif language == 'java':
        result = execute_java(code)
    elif language == 'cpp':
        result = execute_cpp(code)
    elif language == 'c':
        result = execute_c(code)
    else:
        result = 'Unsupported language: ' + language
    
    return {
        'statusCode': 200,
        'body': result,
    }

if __name__ == '__main__':
    app.run(port=5000, debug=True)