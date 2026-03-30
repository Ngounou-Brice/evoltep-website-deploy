from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
from werkzeug.utils import secure_filename

# EMAIL IMPORTS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# LOAD ENV
load_dotenv()

app = Flask(__name__)

# Configure CORS for both development and production
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

# ---------------- CONFIG ---------------- #
DATA_FILE = "data.json"
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "")

# ---------------- DEFAULT DATA ---------------- #
default_data = {
    "heroTitle": "We Build Powerful Digital Solutions",
    "heroBg": "",
    "projects": [
        {
            "id": 1,
            "title": "Project One",
            "description": "This is an example project.",
            "image": "/uploads/default-project.png",
            "category": "Web Development",
            "year": 2026,
            "link": ""
        }
    ],
    "blogs": [],  # Add blogs array
    "subscribers": []
}

# ---------------- LOAD DATA ---------------- #
if os.path.exists(DATA_FILE):
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
    except:
        data = default_data
else:
    data = default_data

# Save initial file if not exists
with open(DATA_FILE, "w") as f:
    json.dump(data, f, indent=4)

# Ensure subscribers list exists (for subscription feature)
if "subscribers" not in data:
    data["subscribers"] = []
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

# ---------------- HELPERS ---------------- #
def save_data():
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

def get_next_project_id():
    if data["projects"]:
        return max(p["id"] for p in data["projects"]) + 1
    return 1

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def is_admin_request():
    # If no API key is configured, allow all admin requests
    if not ADMIN_API_KEY:
        return True
    # If API key is configured, check it
    key = request.headers.get("X-API-KEY") or request.args.get("api_key")
    return bool(key and key == ADMIN_API_KEY)

def require_admin():
    if not is_admin_request():
        return jsonify({"success": False, "error": "Unauthorized"}), 401

# ---------------- ROUTES ---------------- #

# GET all data
@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify(data)

# UPLOAD Image (Admin)
@app.route("/api/projects/upload", methods=["POST"])
def upload_project_image():
    auth = require_admin()
    if auth is not None:
        return auth

    file = request.files.get("image")
    if not file or not allowed_file(file.filename):
        return jsonify({"success": False, "error": "Image file required"}), 400

    filename = secure_filename(file.filename)
    # randomize to avoid duplicates
    import uuid
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    file.save(os.path.join(app.config["UPLOAD_FOLDER"], unique_name))

    image_path = f"/{UPLOAD_FOLDER}/{unique_name}"
    # full URL of uploaded image
    image_url = request.host_url.rstrip("/") + image_path

    return jsonify({"success": True, "image": image_path, "imageUrl": image_url})

# ---------------- HERO ---------------- #
@app.route("/api/hero", methods=["POST"])
def update_hero():
    file = request.files.get("heroBg")

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        data["heroBg"] = f"/{UPLOAD_FOLDER}/{filename}"

    new_title = request.form.get("heroTitle")
    if new_title:
        data["heroTitle"] = new_title

    save_data()
    return jsonify({"success": True})

# ---------------- PROJECTS ---------------- #

# ADD PROJECT
@app.route("/api/projects", methods=["POST"])
def add_project():
    auth = require_admin()
    if auth is not None:
        return auth
    project = request.form.to_dict()

    if not project.get("title"):
        return jsonify({"success": False, "error": "Title required"}), 400

    # Handle year
    project["year"] = int(project.get("year", 2026))

    # NEW: project link
    project["link"] = project.get("link", "")

    # Handle image
    file = request.files.get("image")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        project["image"] = f"/{UPLOAD_FOLDER}/{filename}"
    else:
        project["image"] = "/uploads/default-project.png"

    project["id"] = get_next_project_id()
    project.setdefault("description", "")
    project.setdefault("category", "General")

    data["projects"].append(project)
    save_data()

    return jsonify({"success": True, "project": project})


# UPDATE PROJECT
@app.route("/api/projects/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    auth = require_admin()
    if auth is not None:
        return auth
    project = next((p for p in data["projects"] if p["id"] == project_id), None)

    if not project:
        return jsonify({"success": False, "error": "Not found"}), 404

    updates = request.form.to_dict()

    for field in ["title", "description", "category", "year", "link"]:
        if field in updates:
            project[field] = int(updates[field]) if field == "year" else updates[field]

    # Handle image
    file = request.files.get("image")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        project["image"] = f"/{UPLOAD_FOLDER}/{filename}"

    save_data()
    return jsonify({"success": True, "project": project})


# DELETE PROJECT
@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    auth = require_admin()
    if auth is not None:
        return auth
    project = next((p for p in data["projects"] if p["id"] == project_id), None)

    if not project:
        return jsonify({"success": False}), 404

    data["projects"].remove(project)
    save_data()

    return jsonify({"success": True})


# ---------------- BLOGS ---------------- #

def get_next_blog_id():
    if data["blogs"]:
        return max(blog["id"] for blog in data["blogs"]) + 1
    return 1

# ADD BLOG
@app.route("/api/blogs", methods=["POST"])
def add_blog():
    auth = require_admin()
    if auth is not None:
        return auth
    blog = request.form.to_dict()

    if not blog.get("title") or not blog.get("content"):
        return jsonify({"success": False, "error": "Title and content are required"}), 400

    blog["id"] = get_next_blog_id()
    blog["created_at"] = str(datetime.now())

    # Handle image upload for blog
    if "image" in request.files:
        file = request.files["image"]
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            blog["image"] = f"/{UPLOAD_FOLDER}/{filename}"

    data["blogs"].append(blog)
    save_data()
    return jsonify({"success": True, "blog": blog})

# UPDATE BLOG
@app.route("/api/blogs/<int:blog_id>", methods=["PUT"])
def update_blog(blog_id):
    auth = require_admin()
    if auth is not None:
        return auth
    blog = next((b for b in data["blogs"] if b["id"] == blog_id), None)
    if not blog:
        return jsonify({"success": False}), 404

    updated_blog = request.form.to_dict()

    # Handle image upload for blog
    if "image" in request.files:
        file = request.files["image"]
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            updated_blog["image"] = f"/{UPLOAD_FOLDER}/{filename}"

    blog.update(updated_blog)
    save_data()
    return jsonify({"success": True, "blog": blog})

# DELETE BLOG
@app.route("/api/blogs/<int:blog_id>", methods=["DELETE"])
def delete_blog(blog_id):
    auth = require_admin()
    if auth is not None:
        return auth
    blog = next((b for b in data["blogs"] if b["id"] == blog_id), None)

    if not blog:
        return jsonify({"success": False}), 404

    data["blogs"].remove(blog)
    save_data()
    return jsonify({"success": True})


# ---------------- BULK EMAIL ---------------- #
@app.route("/api/send-bulk-email", methods=["POST"])
def send_bulk_email():
    auth = require_admin()
    if auth is not None:
        return auth

    data_req = request.json
    subject = data_req.get("subject")
    message = data_req.get("message")
    recipient = data_req.get("recipient", "all")

    if not subject or not message:
        return jsonify({"success": False, "error": "Subject and message are required"}), 400

    if not EMAIL_USER or not EMAIL_PASS:
        return jsonify({"success": False, "error": "Email not configured"}), 500

    try:
        recipients = []
        if recipient == "all":
            recipients = [sub["email"] for sub in data.get("subscribers", [])]
        else:
            recipients = [recipient]

        if not recipients:
            return jsonify({"success": False, "error": "No recipients found"}), 400

        # Send to all recipients
        for email in recipients:
            msg = MIMEMultipart()
            msg["From"] = EMAIL_USER
            msg["To"] = email
            msg["Subject"] = subject

            body = f"""
{message}

---
This email was sent from Evoltep website.
If you no longer wish to receive these emails, please contact us.
"""
            msg.attach(MIMEText(body, "plain"))

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, email, msg.as_string())
            server.quit()

        return jsonify({"success": True, "sent_to": len(recipients)})

    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({"success": False, "error": "Failed to send emails"}), 500


# ---------------- CONTACT (EMAIL) ---------------- #
@app.route("/api/contact", methods=["POST"])
def send_email():
    data_req = request.json

    name = data_req.get("name")
    email = data_req.get("email")
    phone = data_req.get("phone")
    message = data_req.get("message")

    if not name or not email or not message:
        return jsonify({"success": False, "error": "Missing fields"}), 400

    if not EMAIL_USER or not EMAIL_PASS:
        return jsonify({"success": False, "error": "Email not configured"}), 500

    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER
        msg["Subject"] = f"New Message from {name}"

        body = f"""
New Message from your website:

Name: {name}
Email: {email}
Phone: {phone}

Message:
{message}
        """

        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())
        server.quit()

        return jsonify({"success": True})

    except Exception as e:
        print("EMAIL ERROR:", e)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/subscribe", methods=["POST"])
def subscribe():
    data_req = request.json
    email = data_req.get("email")
    name = data_req.get("name", "")

    if not email:
        return jsonify({"success": False, "error": "Email required"}), 400

    if email in data.get("subscribers", []):
        return jsonify({"success": True, "message": "Already subscribed"})

    data.setdefault("subscribers", []).append({"email": email, "name": name})
    save_data()

    return jsonify({"success": True, "message": "Subscribed successfully"})


@app.route("/api/subscribers", methods=["GET"])
def get_subscribers():
    auth = require_admin()
    if auth is not None:
        return auth
    return jsonify({"subscribers": data.get("subscribers", [])})


# ---------------- SERVE IMAGES ---------------- #
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ---------------- RUN ---------------- #
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug_mode = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)